"""One fetch of the homepage, shared by every check."""

from __future__ import annotations

import json
import re
from urllib.parse import urlsplit

from bs4 import BeautifulSoup

from .sources import Page, SourceError


# schema.org LocalBusiness and its common subtypes (ProfessionalService, Plumber, Dentist, AutoRepair, ...).
LOCAL_SCHEMA = re.compile(
    r"Business|Service|Store|Shop|Organization|Restaurant|Contractor|Plumber|Electrician|Locksmith|Roofing|"
    r"HVAC|Mover|Painter|Repair|Dealer|Dentist|Clinic|Physician|Office|Agent|Attorney|Salon|Center|Club|Hotel|Cafe"
)


class Unreachable(Exception):
    """The prospect's site couldn't be loaded, so there is nothing to audit (and nothing is spent)."""


def crawl(src, url: str) -> dict:
    try:
        page: Page = src.fetch(url)
    except SourceError as e:
        raise Unreachable(f"Couldn't load {url}: {e}") from e
    if page.status >= 400:
        raise Unreachable(f"{url} returned HTTP {page.status}")

    host = urlsplit(page.url).hostname or ""
    return {
        "final_url": page.url,
        "status": page.status,
        "redirects": page.history,
        "headers": page.headers,
        "html": page.text,
        "cert_days": src.cert_days(host) if page.url.startswith("https://") else None,
        "page": page_facts(page.text),
    }


def page_facts(html: str) -> dict:
    """On-page SEO facts, plus the text Claude reads to suggest search terms."""
    soup = BeautifulSoup(html, "html.parser")
    meta = lambda name: (soup.find("meta", attrs={"name": re.compile(f"^{name}$", re.I)}) or {}).get("content", "")  # noqa: E731
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    h1s = [h.get_text(" ", strip=True) for h in soup.find_all("h1")]
    h2s = [h.get_text(" ", strip=True) for h in soup.find_all("h2")][:12]

    schema_types: list[str] = []
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "")
        except (json.JSONDecodeError, TypeError):
            continue
        items = data if isinstance(data, list) else data.get("@graph", [data]) if isinstance(data, dict) else []
        for item in items:
            t = item.get("@type") if isinstance(item, dict) else None
            schema_types += t if isinstance(t, list) else [t] if t else []

    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    text = re.sub(r"\s+", " ", soup.get_text(" ", strip=True))

    robots = meta("robots").lower()
    return {
        "title": title,
        "title_len": len(title),
        "meta_description": meta("description"),
        "meta_desc_len": len(meta("description")),
        "h1": h1s[:3],
        "h1_count": len(h1s),
        "h2": h2s,
        "generator": meta("generator"),
        "has_viewport": bool(meta("viewport")),
        "noindex": "noindex" in robots,
        "schema_types": sorted(set(schema_types)),
        "has_local_schema": any(LOCAL_SCHEMA.search(t) for t in schema_types if isinstance(t, str)),
        "text_excerpt": text[:3000],
    }
