"""python -m scikit_audit <url>: runs an audit end to end. See README.md."""

from __future__ import annotations

import argparse
import os
import shlex
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path

import yaml
from pydantic import ValidationError

from . import ai, rules as rules_mod
from .checks import gbp, ranking, security, speed
from .config import DEFAULT_DB, FIXTURES_DIR, ROOT, load_keys, load_rules
from .crawl import Unreachable, crawl
from .db import AuditDB
from .normalise import domain_key, ensure_url
from .render import render_html, render_pdf, report_dir
from .sources import FixtureSources, LiveSources, SourceError


class Abort(Exception):
    """Stop the run with a message; nothing more is spent."""


class Prompter:
    def __init__(self, auto_yes: bool):
        self.auto_yes = auto_yes

    def ask(self, question: str, default: str = "") -> str:
        if self.auto_yes:
            return default
        suffix = f" [{default}]" if default else ""
        answer = input(f"{question}{suffix}: ").strip()
        return answer or default

    def confirm(self, question: str, default: bool = False) -> bool:
        if self.auto_yes:
            return True
        hint = "Y/n" if default else "y/N"
        answer = input(f"{question} [{hint}] ").strip().lower()
        return default if not answer else answer.startswith("y")


def parse_args(argv: list[str] | None) -> argparse.Namespace:
    p = argparse.ArgumentParser(prog="python -m scikit_audit", description="Scikit Website & SEO Audit")
    p.add_argument("url", nargs="?", help="the prospect's website, e.g. example.com.au")
    p.add_argument("--force", action="store_true", help="re-audit even if audited in the last 30 days")
    p.add_argument("--render-only", action="store_true", help="re-render the latest stored audit (no API calls)")
    p.add_argument("--edit", action="store_true", help="with --render-only: re-open the summary/fixes draft first")
    p.add_argument("--terms", help="comma-separated search terms (skips Claude's suggestion)")
    p.add_argument("--business", help="business name (defaults to Claude's guess)")
    p.add_argument("--location", help="suburb/city, e.g. 'Richmond, Victoria'")
    p.add_argument("--skip-ranking", action="store_true", help="don't run the rankings check (saves searches)")
    p.add_argument("--skip-gbp", action="store_true", help="don't run the Google Business Profile check")
    p.add_argument("--no-pdf", action="store_true", help="only write report.html")
    p.add_argument("--list", action="store_true", help="show recent audits and searches used this month")
    p.add_argument("--offline", metavar="FIXTURE", help="use recorded responses from tests/fixtures/FIXTURE (development)")
    p.add_argument("--yes", action="store_true", help="accept every prompt (non-interactive)")
    p.add_argument("--db", type=Path, help="audit log path (default audits.db)")
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    rules = load_rules()
    db = AuditDB(args.db or (ROOT / "audits-offline.db" if args.offline else DEFAULT_DB))

    if args.list:
        return list_audits(db, rules)
    if not args.url:
        print("Give a website to audit, e.g.  python -m scikit_audit example.com.au", file=sys.stderr)
        return 2

    if args.offline:
        src = FixtureSources(FIXTURES_DIR / args.offline)
    else:
        src = LiveSources(load_keys(), model=rules["ai"]["model"])
    prompt = Prompter(auto_yes=args.yes or bool(args.offline))

    try:
        run(args, rules, db, src, prompt)
    except Abort as e:
        print(f"\n{e}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\nStopped. Anything already fetched is saved; run the same command again to carry on.", file=sys.stderr)
        return 130
    return 0


def list_audits(db: AuditDB, rules: dict) -> int:
    limit = rules["budget"]["serpapi_monthly_limit"]
    print(f"SerpApi searches logged this month: {db.serpapi_used_this_month()} of {limit}\n")
    for a in db.recent():
        print(f"  {a['created_at'][:10]}  {a['status']:<9} {a['serpapi_used']:>2} searches  {a['domain']}")
    return 0


def run(args, rules: dict, db: AuditDB, src, prompt: Prompter) -> None:
    url = ensure_url(args.url)
    domain = domain_key(url)
    days = rules["budget"]["reaudit_after_days"]

    # 1. The 30-day rule.
    if args.render_only:
        audit = db.latest(domain, status="complete")
        if not audit:
            raise Abort(f"No finished audit for {domain} yet. Run it without --render-only first.")
        if args.edit:
            edit_draft(db, audit, prompt)
            audit = db.get(audit["id"])
        finish(db, audit, rules, args.no_pdf)
        return
    if not args.force:
        recent = db.latest(domain, status="complete", within_days=days)
        if recent:
            print(f"{domain} was audited on {recent['created_at'][:10]} (less than {days} days ago). "
                  "Re-rendering the stored result, no API calls. Use --force to audit again.")
            finish(db, recent, rules, args.no_pdf)
            return

    resume = None if args.force else db.latest(domain, status="running", within_days=days)
    audit_id = resume["id"] if resume else db.create(domain, url)
    metrics: dict = (resume or {}).get("metrics") or {}
    raw: dict = (resume or {}).get("raw") or {}
    if resume:
        print(f"Carrying on with the unfinished audit from {resume['created_at'][:10]} (checks that worked are reused).")

    # 2. Crawl the homepage.
    print(f"Loading {url} ...")
    try:
        site = crawl(src, url)
    except Unreachable as e:
        raise Abort(str(e)) from e
    db.update(audit_id, url=site["final_url"])
    metrics["page"] = {"status": "ok", "metrics": {k: v for k, v in site["page"].items() if k != "text_excerpt"}}
    raw["crawl"] = {k: site[k] for k in ("final_url", "status", "redirects", "headers", "cert_days")}

    # 3. Search terms, business name and location.
    terms = (resume or {}).get("terms") or choose_terms(args, rules, src, prompt, site, domain)
    db.update(audit_id, terms=terms, metrics=metrics, raw=raw)

    # 4. Budget check before any paid search.
    todo_ranking = not args.skip_ranking and not _ok(metrics, "ranking")
    todo_gbp = not args.skip_gbp and not _ok(metrics, "gbp")
    needed = (len(terms["terms"]) if todo_ranking else 0) + (1 if todo_gbp else 0)
    if needed:
        confirm_budget(db, rules, src, prompt, needed, todo_gbp)
    if args.skip_ranking:
        metrics["ranking"] = {"status": "skipped", "metrics": {}}
    if args.skip_gbp:
        metrics["gbp"] = {"status": "skipped", "metrics": {}}

    # 5. Run the checks. Speed and security run alongside the SerpApi checks.
    print("Running checks (PageSpeed can take up to a minute) ...")
    calls_before = src.serp_calls
    try:
        with ThreadPoolExecutor(max_workers=3) as pool:
            futures = {}
            if not _ok(metrics, "speed"):
                futures["speed"] = pool.submit(speed.run, src, site["final_url"])
            if not _ok(metrics, "security"):
                futures["security"] = pool.submit(security.run, src, site)
            if todo_ranking or todo_gbp:
                futures["serp"] = pool.submit(serp_checks, src, terms, domain, rules, todo_ranking, todo_gbp, metrics, raw)
            for name, fut in futures.items():
                result = fut.result()
                if name == "serp":
                    continue  # serp_checks writes into metrics/raw itself
                raw[name] = result.pop("raw", {})
                metrics[name] = result
                print(f"  {name}: {result['status']}" + (f" ({result['error']})" if result.get("error") else ""))
    finally:
        spent = src.serp_calls - calls_before
        if spent:
            db.add_serpapi_used(audit_id, spent)
        db.update(audit_id, metrics=metrics, raw=raw)
    for name in ("ranking", "gbp"):
        r = metrics.get(name, {})
        if r.get("status") in ("ok", "error"):
            print(f"  {name}: {r['status']}" + (f" ({r['error']})" if r.get("error") else ""))
    print(f"  SerpApi searches used: {spent}")

    # 6. Findings, then Claude's draft for Lishan to edit.
    findings = rules_mod.findings(metrics, rules)
    db.update(audit_id, findings=findings)
    print(f"\n{len(findings)} findings:")
    for f in findings:
        print(f"  [{f['severity']:<6}] {f['text']}")

    print("\nAsking Claude to draft the summary and the three fixes ...")
    try:
        draft = ai.draft(src, domain, terms["business_name"], findings, metrics, rules["limits"]["fixes"]).model_dump()
    except SourceError as e:
        print(f"  Claude couldn't draft it ({e}). You'll get an empty draft to fill in.")
        draft = {"summary": "", "fixes": [{"title": "", "detail": ""} for _ in range(rules["limits"]["fixes"])]}
    db.update(audit_id, draft=draft)
    audit = db.get(audit_id)
    edit_draft(db, audit, prompt)

    if not prompt.confirm("Render the report?", default=True):
        print("Saved. Render later with --render-only.")
        db.update(audit_id, status="complete")
        return
    db.update(audit_id, status="complete")
    finish(db, db.get(audit_id), rules, args.no_pdf)


def _ok(metrics: dict, name: str) -> bool:
    return (metrics.get(name) or {}).get("status") == "ok"


def serp_checks(src, terms: dict, domain: str, rules: dict, todo_ranking: bool, todo_gbp: bool, metrics: dict, raw: dict) -> None:
    """Rankings first, then GBP, which can reuse the map pack the ranking searches returned."""
    places: list[dict] = []
    if todo_ranking:
        r = ranking.run(src, terms["terms"], terms.get("location"), domain, terms["business_name"], rules["limits"]["competitors_shown"])
        places = r.pop("places", [])
        raw["ranking"] = r.pop("raw", {})
        metrics["ranking"] = r
    if todo_gbp:
        ll = f"@{terms['lat']},{terms['lng']},14z" if terms.get("lat") is not None else None
        r = gbp.run(src, terms["business_name"], terms.get("suburb", ""), domain, ll, places)
        raw["gbp"] = r.pop("raw", {})
        r.pop("searches", None)
        metrics["gbp"] = r


def choose_terms(args, rules: dict, src, prompt: Prompter, site: dict, domain: str) -> dict:
    n = rules["limits"]["ranking_terms"]
    suggestion = None
    if not args.terms:
        print("Asking Claude to suggest search terms ...")
        try:
            suggestion = ai.suggest_terms(src, site["page"], domain, n)
        except SourceError as e:
            print(f"  Claude couldn't suggest terms ({e}). Type them in instead.")

    business = args.business or (suggestion.business_name if suggestion else site["page"]["title"].split("|")[0].split(" - ")[0].strip())
    place = args.location or (", ".join(x for x in (suggestion.suburb, suggestion.state) if x) if suggestion else "") or "Melbourne, VIC"
    terms = [t.strip().lower() for t in args.terms.split(",") if t.strip()][:n] if args.terms else (suggestion.terms if suggestion else [])

    print()
    business = prompt.ask("Business name", business)
    place = prompt.ask("Suburb / city (for local results)", place)
    if terms:
        print("Search terms:")
        for i, t in enumerate(terms, 1):
            print(f"  {i}. {t}")
    answer = prompt.ask("Press Enter to keep these, or type your own, comma-separated" if terms else f"Type {n} search terms, comma-separated")
    if answer:
        terms = [t.strip().lower() for t in answer.split(",") if t.strip()][:n]
    if not terms:
        raise Abort("No search terms given.")

    loc = ranking.resolve_location(src, place)
    if loc:
        print(f"Searching as if from: {loc['canonical']}")
    else:
        print(f"Couldn't match '{place}' to a Google location; searching Google Australia without a location.")
    return {
        "business_name": business,
        "suburb": place.split(",")[0].strip(),
        "terms": terms,
        "location": loc["canonical"] if loc else None,
        "lat": loc["lat"] if loc else None,
        "lng": loc["lng"] if loc else None,
    }


def confirm_budget(db: AuditDB, rules: dict, src, prompt: Prompter, needed: int, gbp_included: bool) -> None:
    limit = rules["budget"]["serpapi_monthly_limit"]
    used = db.serpapi_used_this_month()
    account = src.serp_account() or {}
    left = account.get("plan_searches_left", account.get("total_searches_left"))

    if used + needed > limit:
        raise Abort(f"This audit needs {needed} SerpApi searches, but {used} of your {limit} for this month are already used "
                    "(budget.serpapi_monthly_limit in rules.yaml). Try --skip-ranking / --skip-gbp, or wait for next month.")
    if left is not None and needed > left:
        raise Abort(f"SerpApi says only {left} searches are left this month; this audit needs {needed}.")

    gbp_note = " (the Maps search is skipped if you're already in Google's map results)" if gbp_included else ""
    left_note = f"SerpApi says {left} left this month" if left is not None else "couldn't check SerpApi's remaining count"
    print(f"\nThis audit will use up to {needed} SerpApi searches{gbp_note}.")
    print(f"{left_note}; the tool has logged {used} of your {limit} limit.")
    if not prompt.confirm("Continue?"):
        raise Abort("Cancelled. No searches used.")


DRAFT_HEADER = """# Scikit audit draft for {domain}
# Edit the summary and the three fixes, save the file, then go back to the terminal.
# Plain English for the business owner. Keep each fix to a short title + one sentence.
#
# Findings (most severe first):
{findings}
"""


def edit_draft(db: AuditDB, audit: dict, prompt: Prompter) -> None:
    out = report_dir(audit["domain"], audit["created_at"])
    out.mkdir(parents=True, exist_ok=True)
    path = out / "draft.yaml"
    findings = "\n".join(f"#   [{f['severity']}] {f['text']}" for f in (audit["findings"] or [])) or "#   (none)"
    body = yaml.safe_dump(audit["draft"] or {}, sort_keys=False, allow_unicode=True, width=100)
    path.write_text(DRAFT_HEADER.format(domain=audit["domain"], findings=findings) + body)

    if prompt.auto_yes:
        return
    while True:
        open_in_editor(path)
        try:
            data = yaml.safe_load(path.read_text()) or {}
            draft = ai.Draft.model_validate(data).model_dump()
            break
        except (yaml.YAMLError, ValidationError) as e:
            print(f"That draft doesn't read correctly:\n{e}\nOpening it again.")
    db.update(audit["id"], draft=draft)


def open_in_editor(path: Path) -> None:
    editor = os.environ.get("VISUAL") or os.environ.get("EDITOR")
    print(f"\nDraft: {path}")
    if editor:
        subprocess.call([*shlex.split(editor), str(path)])  # terminal editors block until closed
    else:
        subprocess.call(["open", "-t", str(path)])  # macOS default text editor
        input("Edit and save the draft, then press Enter here ...")


def finish(db: AuditDB, audit: dict, rules: dict, no_pdf: bool) -> None:
    """Re-scores with the current rules.yaml (so rule edits apply) and renders."""
    findings = rules_mod.findings(audit["metrics"] or {}, rules)
    db.update(audit["id"], findings=findings)
    audit = db.get(audit["id"])
    out = report_dir(audit["domain"], audit["created_at"])
    html = render_html(audit, rules, out)
    print(f"\nReport: {html}")
    if not no_pdf:
        pdf, fits = render_pdf(html)
        print(f"PDF:    {pdf}")
        if not fits:
            print("Warning: the content is taller than one A4 page and got cut off. Shorten the summary or fixes (--render-only --edit).")
    print(f"Done {datetime.now():%H:%M}.")
