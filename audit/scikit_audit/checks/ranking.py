"""02 Search rankings: SerpApi Google search, Australia, one page (top 10) per term."""

from __future__ import annotations

from ..normalise import domain_key, same_site
from ..sources import SourceError


STATES = {
    "VIC": "Victoria", "NSW": "New South Wales", "QLD": "Queensland", "WA": "Western Australia",
    "SA": "South Australia", "TAS": "Tasmania", "ACT": "Australian Capital Territory", "NT": "Northern Territory",
}


def resolve_location(src, place: str) -> dict | None:
    """'Richmond, VIC' -> SerpApi's canonical Australian location (free call).

    A bare 'Richmond' matches Richmond, Virginia first, so the query includes the full state
    name, and a result in the right state wins. Returns
    {"canonical": "Richmond,Victoria,Australia", "lat": .., "lng": ..} or None.
    """
    parts = [p.strip() for p in place.split(",") if p.strip()]
    if not parts:
        return None
    suburb = parts[0]
    state = STATES.get(parts[1].upper(), parts[1]) if len(parts) > 1 else None
    queries = [f"{suburb},{state}", suburb] if state else [suburb]
    for q in queries:
        found = [loc for loc in src.serp_locations(q) if loc.get("country_code") == "AU" and loc.get("canonical_name")]
        if state:
            found.sort(key=lambda loc: state.lower() not in loc["canonical_name"].lower())
        if found:
            gps = found[0].get("gps") or [None, None]  # SerpApi gives [lng, lat]
            return {"canonical": found[0]["canonical_name"], "lng": gps[0], "lat": gps[1]}
    return None


def search_params(term: str, location: str | None) -> dict:
    params = {"engine": "google", "q": term, "google_domain": "google.com.au", "gl": "au", "hl": "en", "num": 10}
    if location:
        params["location"] = location
    return params


def run(src, terms: list[str], location: str | None, domain: str, business: str, competitors_shown: int) -> dict:
    rows, raw, places, errors = [], {}, [], []
    for term in terms:
        try:
            data = src.serp(search_params(term, location))
        except SourceError as e:
            errors.append(f"{term}: {e}")
            rows.append({"term": term, "position": None, "competitors": [], "error": True})
            continue
        raw[term] = _trim(data)
        row = parse(data, term, domain, business, competitors_shown)
        places += row.pop("places")
        rows.append(row)

    ok = [r for r in rows if not r.get("error")]
    if not ok:
        return {"status": "error", "error": "; ".join(errors), "metrics": {}, "raw": raw}

    positions = [r["position"] for r in ok]
    competitor_counts: dict[str, int] = {}
    for r in ok:
        for c in r["competitors"]:
            competitor_counts[c] = competitor_counts.get(c, 0) + 1
    top = max(competitor_counts.items(), key=lambda kv: kv[1])[0] if competitor_counts else None

    metrics = {
        "terms": rows,
        "terms_count": len(ok),
        "terms_in_top3": sum(1 for p in positions if p is not None and p <= 3),
        "terms_in_top10": sum(1 for p in positions if p is not None),
        "terms_not_found": sum(1 for p in positions if p is None),
        "local_pack_seen": sum(1 for r in ok if r["local_pack"]),
        "in_local_pack_count": sum(1 for r in ok if r["in_local_pack"]),
        "top_competitor": top,
        "top_competitor_count": competitor_counts.get(top, 0) if top else 0,
    }
    result = {"status": "ok", "metrics": metrics, "raw": raw, "places": places}
    if errors:
        result["error"] = "; ".join(errors)
    return result


def local_places(data: dict) -> list[dict]:
    """The Google map pack. SerpApi returns it as {"places": [...]} or as a plain list."""
    lr = data.get("local_results")
    if isinstance(lr, dict):
        return lr.get("places") or []
    return lr if isinstance(lr, list) else []


def place_matches(place: dict, domain: str, business: str) -> bool:
    website = (place.get("links") or {}).get("website") or place.get("website") or ""
    if website and same_site(website, domain):
        return True
    title = (place.get("title") or "").lower()
    name = business.lower().strip()
    return bool(name) and (name in title or title in name) and len(title) > 3


def parse(data: dict, term: str, domain: str, business: str, competitors_shown: int) -> dict:
    position, competitors = None, []
    for r in data.get("organic_results") or []:
        link = r.get("link") or ""
        if same_site(link, domain):
            if position is None:
                position = r.get("position")
        else:
            d = domain_key(link)
            if d and d not in competitors and len(competitors) < competitors_shown:
                competitors.append(d)
    places = local_places(data)
    return {
        "term": term,
        "position": position,
        "competitors": competitors,
        "local_pack": bool(places),
        "in_local_pack": any(place_matches(p, domain, business) for p in places),
        "places": places,
    }


def _trim(data: dict) -> dict:
    keep = ("search_parameters", "search_information", "organic_results", "local_results", "error")
    return {k: data[k] for k in keep if k in data}
