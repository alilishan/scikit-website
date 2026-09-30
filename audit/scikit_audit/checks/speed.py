"""01 Speed & mobile: Google PageSpeed Insights (Lighthouse + Core Web Vitals)."""

from __future__ import annotations

from ..sources import SourceError

# CrUX field-data keys in PSI's loadingExperience.metrics
FIELD = {
    "lcp": "LARGEST_CONTENTFUL_PAINT_MS",
    "cls": "CUMULATIVE_LAYOUT_SHIFT_SCORE",
    "inp": "INTERACTION_TO_NEXT_PAINT",
    "fcp": "FIRST_CONTENTFUL_PAINT_MS",
}


def run(src, url: str) -> dict:
    metrics, raw, errors = {}, {}, []
    for strategy in ("mobile", "desktop"):
        try:
            raw[strategy] = src.psi(url, strategy)
            metrics[strategy] = parse(raw[strategy])
        except (SourceError, KeyError, TypeError) as e:
            errors.append(f"{strategy}: {e}")
    if not metrics:
        error = "; ".join(errors)
        if "429" in error and not getattr(getattr(src, "keys", None), "psi", True):
            error = "Google refused the request without a key; add PSI_API_KEY to audit/.env"
        return {"status": "error", "error": error, "metrics": {}, "raw": raw}
    return {"status": "ok", "metrics": metrics, "raw": _trim(raw), **({"error": "; ".join(errors)} if errors else {})}


def parse(data: dict) -> dict:
    lh = data["lighthouseResult"]
    cats = lh["categories"]
    audits = lh["audits"]
    field = (data.get("loadingExperience") or {}).get("metrics") or {}

    def lab(audit_id: str) -> float | None:
        return (audits.get(audit_id) or {}).get("numericValue")

    def fld(key: str) -> float | None:
        return (field.get(FIELD[key]) or {}).get("percentile")

    score = lambda c: round((cats.get(c) or {}).get("score", 0) * 100) if (cats.get(c) or {}).get("score") is not None else None  # noqa: E731

    has_field = fld("lcp") is not None
    lcp_ms = fld("lcp") if has_field else lab("largest-contentful-paint")
    cls = (fld("cls") / 100) if fld("cls") is not None else lab("cumulative-layout-shift")
    fcp_ms = fld("fcp") if fld("fcp") is not None else lab("first-contentful-paint")

    return {
        "performance": score("performance"),
        "accessibility": score("accessibility"),
        "best_practices": score("best-practices"),
        "seo": score("seo"),
        "lcp_s": round(lcp_ms / 1000, 1) if lcp_ms is not None else None,
        "cls": round(cls, 2) if cls is not None else None,
        "inp_ms": fld("inp"),  # only real-user (field) data has INP
        "tbt_ms": round(lab("total-blocking-time")) if lab("total-blocking-time") is not None else None,
        "fcp_s": round(fcp_ms / 1000, 1) if fcp_ms is not None else None,
        "source": "field" if has_field else "lab",
        "opportunities": opportunities(audits),
    }


def opportunities(audits: dict, limit: int = 3) -> list[dict]:
    """The biggest time savings Lighthouse found, in plain titles."""
    found = []
    for a in audits.values():
        if a.get("score") is None or a["score"] >= 0.9:
            continue
        details = a.get("details") or {}
        saving = details.get("overallSavingsMs") or sum((a.get("metricSavings") or {}).get(k, 0) or 0 for k in ("LCP", "FCP"))
        if saving and saving > 100:
            found.append({"title": a.get("title", ""), "savings_ms": round(saving)})
    found.sort(key=lambda o: o["savings_ms"], reverse=True)
    return found[:limit]


def _trim(raw: dict) -> dict:
    """PSI responses are ~1MB with screenshots; keep only what re-rendering needs."""
    out = {}
    for strategy, data in raw.items():
        lh = data.get("lighthouseResult", {})
        out[strategy] = {
            "loadingExperience": data.get("loadingExperience"),
            "lighthouseResult": {
                "categories": {k: {"score": v.get("score")} for k, v in lh.get("categories", {}).items()},
                "audits": {
                    k: {kk: v.get(kk) for kk in ("title", "score", "numericValue", "metricSavings")}
                    | {"details": {"overallSavingsMs": (v.get("details") or {}).get("overallSavingsMs")}}
                    for k, v in lh.get("audits", {}).items()
                },
            },
        }
    return out
