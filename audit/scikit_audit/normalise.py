"""Turns whatever URL was typed into a stable domain key and a fetchable URL."""

from __future__ import annotations

from urllib.parse import urlsplit


def ensure_url(raw: str) -> str:
    """'Foo.com.au/about' -> 'https://foo.com.au/about'."""
    raw = raw.strip()
    if "://" not in raw:
        raw = "https://" + raw
    return raw


def domain_key(raw: str) -> str:
    """'https://www.Foo.com.au/about?x=1' -> 'foo.com.au'. Used as the audit log key."""
    host = urlsplit(ensure_url(raw)).hostname or ""
    host = host.lower().rstrip(".")
    if host.startswith("www."):
        host = host[4:]
    return host


def same_site(url: str, domain: str) -> bool:
    """True when url is on domain or one of its subdomains."""
    host = domain_key(url)
    return host == domain or host.endswith("." + domain)
