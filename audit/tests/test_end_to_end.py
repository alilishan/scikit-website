"""Full offline runs on the brightflow fixture: no network, no SerpApi searches."""

import pytest
from pypdf import PdfReader

from scikit_audit import render
from scikit_audit.cli import main
from scikit_audit.db import AuditDB

URL = "brightflowplumbing.com.au"


@pytest.fixture
def env(tmp_path, monkeypatch):
    monkeypatch.setattr(render, "REPORTS_DIR", tmp_path / "reports")
    return tmp_path


def run(env, *extra):
    return main([URL, "--offline", "brightflow", "--db", str(env / "audits.db"), *extra])


def test_full_audit_renders_a_one_page_pdf(env):
    assert run(env) == 0
    db = AuditDB(env / "audits.db")
    audit = db.latest(URL, status="complete")
    assert audit["serpapi_used"] == 6  # 5 terms + 1 Maps search (not in the local pack)
    assert audit["terms"]["location"] == "Richmond,Victoria,Australia"
    assert {"speed", "ranking", "gbp", "security", "page"} <= audit["metrics"].keys()
    assert any(f["id"] == "missing_from_map_pack" for f in audit["findings"])
    assert len(audit["draft"]["fixes"]) == 3

    out = next((env / "reports" / URL).iterdir())
    html = (out / "report.html").read_text()
    assert "Brightflow Plumbing" in html and "The three things we'd fix first" in html
    assert len(PdfReader(out / "report.pdf").pages) == 1


def test_second_run_within_30_days_spends_nothing(env):
    run(env)
    run(env)
    db = AuditDB(env / "audits.db")
    assert len(db.recent()) == 1
    assert db.serpapi_used_this_month() == 6


def test_force_runs_a_new_audit(env):
    run(env)
    run(env, "--force", "--no-pdf")
    assert AuditDB(env / "audits.db").serpapi_used_this_month() == 12


def test_skip_flags_spend_no_searches(env):
    run(env, "--skip-ranking", "--skip-gbp", "--no-pdf")
    audit = AuditDB(env / "audits.db").latest(URL)
    assert audit["serpapi_used"] == 0
    assert audit["metrics"]["ranking"]["status"] == "skipped"
    html = next((env / "reports" / URL).iterdir()).joinpath("report.html").read_text()
    assert "Not checked this time" in html


def test_render_only_needs_a_finished_audit(env):
    assert run(env, "--render-only") == 1
    run(env, "--no-pdf")
    assert run(env, "--render-only", "--no-pdf") == 0
