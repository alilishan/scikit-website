import json

import pytest

from scikit_audit import rules as rules_mod
from scikit_audit.checks import gbp, ranking, speed
from scikit_audit.cli import Abort, Prompter, confirm_budget
from scikit_audit.config import FIXTURES_DIR, load_rules
from scikit_audit.db import AuditDB
from scikit_audit.normalise import domain_key, ensure_url, same_site
from scikit_audit.sources import FixtureSources

FIX = FIXTURES_DIR / "brightflow"


def load(name):
    return json.loads((FIX / name).read_text())


# --- normalise --------------------------------------------------------------------------------
@pytest.mark.parametrize("raw", ["https://www.Foo.com.au/about?x=1", "foo.com.au", "http://foo.com.au/", "WWW.FOO.COM.AU."])
def test_domain_key(raw):
    assert domain_key(raw) == "foo.com.au"


def test_ensure_url_and_same_site():
    assert ensure_url("foo.com.au/a") == "https://foo.com.au/a"
    assert same_site("https://shop.foo.com.au/x", "foo.com.au")
    assert not same_site("https://notfoo.com.au/", "foo.com.au")


# --- rules evaluator ----------------------------------------------------------------------------
CTX = {"speed": {"mobile": {"lcp_s": 5.2, "inp_ms": None}}, "gbp": {"found": False}, "thresholds": {"lcp_s": {"poor": 4.0}}}


def test_evaluate_comparisons_and_logic():
    assert rules_mod.evaluate("speed.mobile.lcp_s > thresholds.lcp_s.poor", CTX)
    assert rules_mod.evaluate("gbp.found == False", CTX)
    assert rules_mod.evaluate("not gbp.found or gbp.reviews < 5", CTX)  # short-circuits past the missing field
    assert not rules_mod.evaluate("2 < speed.mobile.lcp_s < 4", CTX)


def test_missing_values_do_not_fire():
    with pytest.raises(rules_mod.Missing):
        rules_mod.evaluate("speed.desktop.lcp_s > 1", CTX)
    with pytest.raises(rules_mod.Missing):
        rules_mod.evaluate("speed.mobile.inp_ms > 500", CTX)  # None can't be compared


@pytest.mark.parametrize("expr", ["__import__('os').system('ls')", "speed.mobile.lcp_s + 1 > 2", "[1][0]"])
def test_disallowed_expressions(expr):
    with pytest.raises(rules_mod.RuleError):
        rules_mod.evaluate(expr, CTX)


def test_render_text():
    assert rules_mod.render_text("takes {speed.mobile.lcp_s}s", CTX) == "takes 5.2s"


def test_every_rule_in_rules_yaml_parses():
    rules = load_rules()
    ids = [f["id"] for f in rules["findings"]]
    assert len(ids) == len(set(ids)), "duplicate finding ids"
    for f in rules["findings"]:
        assert f["severity"] in rules_mod.SEVERITY_ORDER
        try:
            rules_mod.evaluate(f["when"], {"thresholds": rules["thresholds"]})
        except rules_mod.Missing:
            pass  # expected: no metrics in this context; RuleError would fail the test


# --- checks ------------------------------------------------------------------------------------
def test_speed_parse_prefers_field_data():
    m = speed.parse(load("psi_mobile.json"))
    assert m["performance"] == 38
    assert m["lcp_s"] == 5.2 and m["cls"] == 0.18 and m["inp_ms"] == 340
    assert m["source"] == "field"
    assert m["opportunities"][0]["title"] == "Eliminate render-blocking resources"


def test_speed_parse_falls_back_to_lab():
    m = speed.parse(load("psi_desktop.json"))
    assert m["source"] == "lab" and m["lcp_s"] == 2.3 and m["inp_ms"] is None and m["tbt_ms"] == 150


def test_ranking_parse_matches_www_and_collects_competitors():
    row = ranking.parse(load("serp_google_plumber-richmond.json"), "plumber richmond", "brightflowplumbing.com.au", "Brightflow Plumbing", 3)
    assert row["position"] == 3
    assert row["competitors"] == ["pipepros.com.au", "metroplumbing.com.au", "swiftdrains.com.au"]
    assert row["local_pack"] and not row["in_local_pack"]


def test_gbp_reuses_local_pack_without_a_search():
    src = FixtureSources(FIX)
    pack = [{"title": "Brightflow Plumbing", "rating": 4.6, "reviews": 14, "links": {"website": "https://brightflowplumbing.com.au/"}}]
    r = gbp.run(src, "Brightflow Plumbing", "Richmond", "brightflowplumbing.com.au", None, pack)
    assert r["searches"] == 0 and src.serp_calls == 0
    assert r["metrics"]["rating"] == 4.6 and r["metrics"]["source"] == "local pack"


def test_gbp_falls_back_to_one_maps_search():
    src = FixtureSources(FIX)
    r = gbp.run(src, "Brightflow Plumbing", "Richmond", "brightflowplumbing.com.au", "@-37.82,145.0,14z", [])
    assert src.serp_calls == 1
    assert r["metrics"]["found"] and r["metrics"]["claimed"] is True and not r["metrics"]["has_hours"]


def test_gbp_rejects_a_weak_match():
    data = {"local_results": [{"title": "Totally Different Electrical"}]}
    assert gbp.best_match(data, "Brightflow Plumbing", "brightflowplumbing.com.au") is None


# --- budget ------------------------------------------------------------------------------------
def test_budget_blocks_when_monthly_limit_would_be_exceeded(tmp_path):
    db = AuditDB(tmp_path / "a.db")
    audit_id = db.create("x.com.au", "https://x.com.au")
    db.add_serpapi_used(audit_id, 97)
    rules = {"budget": {"serpapi_monthly_limit": 100}}
    with pytest.raises(Abort, match="97 of your 100"):
        confirm_budget(db, rules, FixtureSources(FIX), Prompter(auto_yes=True), 6, True)
    confirm_budget(db, rules, FixtureSources(FIX), Prompter(auto_yes=True), 3, True)  # 97 + 3 fits


def test_budget_blocks_when_serpapi_has_fewer_left(tmp_path):
    db = AuditDB(tmp_path / "a.db")
    src = FixtureSources(FIX)
    src.serp_account = lambda: {"plan_searches_left": 2}
    with pytest.raises(Abort, match="only 2 searches"):
        confirm_budget(db, {"budget": {"serpapi_monthly_limit": 100}}, src, Prompter(auto_yes=True), 6, True)


def test_resolve_location_prefers_the_right_state():
    class Src:
        def serp_locations(self, q):
            return [
                {"canonical_name": "Richmond,Virginia,United States", "country_code": "US"},
                {"canonical_name": "Richmond,New South Wales,Australia", "country_code": "AU", "gps": [150.7, -33.6]},
                {"canonical_name": "Richmond,Victoria,Australia", "country_code": "AU", "gps": [145.0, -37.8]},
            ]

    loc = ranking.resolve_location(Src(), "Richmond, VIC")
    assert loc == {"canonical": "Richmond,Victoria,Australia", "lng": 145.0, "lat": -37.8}


def test_local_schema_detects_business_subtypes():
    from scikit_audit.crawl import page_facts

    html = '<script type="application/ld+json">{"@graph":[{"@type":"WebSite"},{"@type":"ProfessionalService"}]}</script>'
    assert page_facts(html)["has_local_schema"]
    assert not page_facts('<script type="application/ld+json">{"@type":"WebSite"}</script>')["has_local_schema"]
