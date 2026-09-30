"""03 Google Business Profile: reuse the map pack from the ranking searches, else one SerpApi Maps search."""

from __future__ import annotations

from difflib import SequenceMatcher

from ..normalise import same_site
from ..sources import SourceError
from .ranking import place_matches


def run(src, business: str, suburb: str, domain: str, ll: str | None, pack_places: list[dict]) -> dict:
    """ll is '@lat,lng,14z' for the location, or None."""
    match = next((p for p in pack_places if place_matches(p, domain, business)), None)
    if match:
        return {"status": "ok", "metrics": parse(match, source="local pack"), "raw": {"place": match}, "searches": 0}

    params = {"engine": "google_maps", "type": "search", "q": f"{business} {suburb}".strip(), "hl": "en", "google_domain": "google.com.au"}
    if ll:
        params["ll"] = ll
    try:
        data = src.serp(params)
    except SourceError as e:
        return {"status": "error", "error": str(e), "metrics": {}, "raw": {}, "searches": 1}

    place = best_match(data, business, domain)
    raw = {"place": place, "search_parameters": data.get("search_parameters")}
    if place is None:
        return {"status": "ok", "metrics": {"found": False}, "raw": raw, "searches": 1}
    return {"status": "ok", "metrics": parse(place, source="maps"), "raw": raw, "searches": 1}


def best_match(data: dict, business: str, domain: str) -> dict | None:
    """Google Maps returns place_results for a single confident hit, else a list of local_results."""
    if isinstance(data.get("place_results"), dict):
        return data["place_results"]
    candidates = data.get("local_results") or []
    for p in candidates:
        if p.get("website") and same_site(p["website"], domain):
            return p
    scored = [(SequenceMatcher(None, business.lower(), (p.get("title") or "").lower()).ratio(), p) for p in candidates]
    scored.sort(key=lambda s: s[0], reverse=True)
    return scored[0][1] if scored and scored[0][0] >= 0.6 else None


def parse(place: dict, source: str) -> dict:
    website = place.get("website") or (place.get("links") or {}).get("website")
    hours = place.get("hours") or place.get("operating_hours")
    photos = place.get("photos_count") or len(place.get("images") or []) or (1 if place.get("thumbnail") else 0)
    unclaimed = place.get("unclaimed_listing")
    category = place.get("type") or ", ".join((place.get("types") or [])[:2]) or None
    return {
        "found": True,
        "source": source,
        "name": place.get("title"),
        "rating": place.get("rating"),
        "reviews": place.get("reviews") or 0,
        "category": category,
        "address": place.get("address"),
        "has_hours": bool(hours),
        "has_website": bool(website),
        "has_photos": bool(photos),
        "photos": photos,
        # Only known when Google shows "Own this business?"; None = couldn't tell.
        "claimed": (not unclaimed) if unclaimed is not None else None,
    }
