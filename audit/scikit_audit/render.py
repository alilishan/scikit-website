"""Stored audit -> report.html (Jinja2) -> report.pdf (Playwright, A4)."""

from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

from .config import BRAND_DIR, REPORTS_DIR

GRADE_LABEL = {"pass": "Good", "warn": "Needs work", "fail": "Poor", "info": "Ask us", "unknown": "Unknown"}


def grade_low_is_good(value, t: dict) -> str:
    if value is None:
        return "unknown"
    return "pass" if value <= t["good"] else "warn" if value <= t["poor"] else "fail"


def grade_score(value, t: dict) -> str:
    if value is None:
        return "unknown"
    return "pass" if value >= t["good"] else "warn" if value >= t["poor"] else "fail"


def check(ok, warn: bool = False) -> str:
    """True -> pass, False -> fail (or warn), None -> unknown."""
    if ok is None:
        return "unknown"
    return "pass" if ok else ("warn" if warn else "fail")


def section_note(findings: list[dict], section: str) -> str | None:
    hits = [f for f in findings if f["section"] == section]
    return hits[0]["text"] if hits else None


def speed_view(r: dict, t: dict) -> dict:
    m, d = r["metrics"].get("mobile") or {}, r["metrics"].get("desktop") or {}
    vitals = [
        {"label": "Main content appears", "abbr": "LCP", "value": f"{m['lcp_s']}s" if m.get("lcp_s") is not None else "–",
         "target": "under 2.5s", "grade": grade_low_is_good(m.get("lcp_s"), t["lcp_s"])},
        {"label": "Page stays still", "abbr": "CLS", "value": f"{m['cls']}" if m.get("cls") is not None else "–",
         "target": "under 0.1", "grade": grade_low_is_good(m.get("cls"), t["cls"])},
    ]
    if m.get("inp_ms") is not None:
        vitals.append({"label": "Reacts to taps", "abbr": "INP", "value": f"{m['inp_ms']}ms", "target": "under 200ms",
                       "grade": grade_low_is_good(m["inp_ms"], t["inp_ms"])})
    elif m.get("tbt_ms") is not None:
        vitals.append({"label": "Busy while loading", "abbr": "TBT", "value": f"{m['tbt_ms']}ms", "target": "under 200ms",
                       "grade": grade_low_is_good(m["tbt_ms"], {"good": 200, "poor": 600})})
    return {
        "gauges": [
            {"label": "Mobile", "score": m.get("performance"), "grade": grade_score(m.get("performance"), t["perf_score"])},
            {"label": "Desktop", "score": d.get("performance"), "grade": grade_score(d.get("performance"), t["perf_score"])},
        ],
        "vitals": vitals,
        "source": "real visitors (Chrome UX Report)" if m.get("source") == "field" else "a simulated phone test",
        "slowdowns": [f"{o['title']} (~{o['savings_ms'] / 1000:.1f}s)" for o in (m.get("opportunities") or [])[:2]],
    }


def ranking_view(r: dict) -> dict:
    m = r["metrics"]
    rows = []
    for row in m["terms"]:
        pos = row.get("position")
        rows.append({
            "term": row["term"],
            "position": "–" if row.get("error") else (f"#{pos}" if pos else "Not top 10"),
            "grade": "unknown" if row.get("error") else ("pass" if pos and pos <= 3 else "warn" if pos else "fail"),
            "competitors": row.get("competitors") or [],
        })
    return {"rows": rows, "in_top10": m["terms_in_top10"], "count": m["terms_count"]}


def gbp_view(r: dict, t: dict) -> dict:
    m = r["metrics"]
    if not m.get("found"):
        return {"found": False}
    rating, reviews = m.get("rating"), m.get("reviews") or 0
    return {
        "found": True,
        "name": m.get("name"),
        "category": m.get("category"),
        "rating": rating,
        "reviews": reviews,
        "checklist": [
            {"label": f"Rating {rating if rating is not None else '–'} ★", "grade": check(rating >= t["gbp_rating"]["warn"], warn=True) if rating is not None else "unknown"},
            {"label": f"{reviews} reviews", "grade": check(reviews >= t["gbp_reviews"]["warn"], warn=True)},
            {"label": "Opening hours listed", "grade": check(m.get("has_hours"), warn=True)},
            {"label": "Links to your website", "grade": check(m.get("has_website"))},
            {"label": "Has photos", "grade": check(m.get("has_photos"), warn=True)},
            {"label": "Listing claimed", "grade": check(m.get("claimed"))},
        ],
    }


def security_view(r: dict, t: dict) -> dict:
    m = r["metrics"]
    days = m.get("cert_days")
    cert = "unknown" if days is None else "pass" if days >= t["cert_days"]["warn"] else "warn" if days >= t["cert_days"]["fail"] else "fail"
    cms = m.get("cms")
    items = [
        {"label": "Uses HTTPS", "grade": check(m.get("https"))},
        {"label": "http:// redirects to https://", "grade": check(m.get("http_redirects_to_https"), warn=True)},
        {"label": f"Certificate valid ({days} days left)" if days is not None else "Certificate valid", "grade": cert},
        {"label": f"Security headers ({m.get('headers_present', 0)} of 5)", "grade": "pass" if m.get("headers_missing") == 0 else "warn" if m.get("headers_missing", 5) < 3 else "fail"},
        {"label": "Everything loads securely", "grade": check(m.get("mixed_content") == 0, warn=True)},
        {"label": "Private files hidden", "grade": check(m.get("exposed_count") == 0)},
        {"label": "Backups", "grade": "info", "note": "Can't be checked from outside"},
    ]
    return {"checks": items, "cms": f"{cms} {m.get('cms_version') or ''}".strip() if cms else None}


def build_view(audit: dict, rules: dict) -> dict:
    t = rules["thresholds"]
    metrics = audit["metrics"] or {}
    findings = audit["findings"] or []
    draft = audit["draft"] or {}
    terms = audit["terms"] or {}
    report = rules.get("report", {})

    def section(name: str, builder):
        r = metrics.get(name)
        if not r or r.get("status") != "ok" or not r.get("metrics"):
            return None
        return builder(r)

    created = datetime.fromisoformat(audit["created_at"])
    return {
        "domain": audit["domain"],
        "business": terms.get("business_name") or audit["domain"],
        "date": f"{created.day} {created:%B %Y}",
        "summary": draft.get("summary") or "",
        "fixes": draft.get("fixes") or [],
        "speed": section("speed", lambda r: speed_view(r, t)),
        "ranking": section("ranking", ranking_view),
        "gbp": section("gbp", lambda r: gbp_view(r, t)),
        "security": section("security", lambda r: security_view(r, t)),
        "location": location_label(terms.get("location")),
        "notes": {s: section_note(findings, s) for s in ("speed", "ranking", "gbp", "security")},
        "report": report,
        "grade_label": GRADE_LABEL,
    }


def location_label(canonical: str | None) -> str:
    """'Parramatta,Parramatta,New South Wales,Australia' -> 'Parramatta, New South Wales'."""
    parts = (canonical or "").split(",")
    return f"{parts[0]}, {parts[-2]}" if len(parts) >= 3 else parts[0]


def report_dir(domain: str, created_at: str) -> Path:
    return REPORTS_DIR / domain / created_at[:10]


def render_html(audit: dict, rules: dict, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    env = Environment(loader=FileSystemLoader(BRAND_DIR), autoescape=select_autoescape(["html", "j2"]))
    view = build_view(audit, rules)
    html = env.get_template("report.html.j2").render(
        **view,
        brand=os.path.relpath(BRAND_DIR, out_dir),
        logo_svg=(BRAND_DIR / "logo.svg").read_text(),
    )
    path = out_dir / "report.html"
    path.write_text(html)
    return path


def render_pdf(html_path: Path) -> tuple[Path, bool]:
    """Prints the HTML to an A4 PDF. Returns (path, fits_one_page)."""
    from playwright.sync_api import Error as PlaywrightError
    from playwright.sync_api import sync_playwright

    pdf_path = html_path.with_suffix(".pdf")
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(channel="chrome")  # the installed Google Chrome
        except PlaywrightError:
            browser = p.chromium.launch()  # Playwright's own Chromium (`playwright install chromium`)
        page = browser.new_page()
        page.goto(html_path.resolve().as_uri(), wait_until="networkidle")
        page.emulate_media(media="print")
        fits = page.evaluate("() => { const p = document.querySelector('.page'); return p.scrollHeight <= p.clientHeight + 1; }")
        page.pdf(path=str(pdf_path), format="A4", print_background=True, prefer_css_page_size=True,
                 margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
        browser.close()
    return pdf_path, fits
