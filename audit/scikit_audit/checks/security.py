"""04 Security & backups: what can be seen from outside, using free requests to the prospect's own site."""

from __future__ import annotations

import re
from urllib.parse import urljoin, urlsplit

from ..sources import SourceError

HEADERS = {
    "hsts": "strict-transport-security",
    "csp": "content-security-policy",
    "x_frame": "x-frame-options",
    "x_content_type": "x-content-type-options",
    "referrer_policy": "referrer-policy",
}


def run(src, crawl: dict) -> dict:
    final = crawl["final_url"]
    headers = crawl["headers"]
    html = crawl["html"]
    host = urlsplit(final).hostname or ""
    m: dict = {"https": final.startswith("https://"), "cert_days": crawl["cert_days"]}

    # Does plain http:// end up on https://?
    try:
        m["http_redirects_to_https"] = src.fetch(f"http://{host}/").url.startswith("https://")
    except SourceError:
        m["http_redirects_to_https"] = None

    for key, header in HEADERS.items():
        m[key] = header in headers
    # CSP frame-ancestors does the same job as X-Frame-Options.
    if not m["x_frame"] and "frame-ancestors" in headers.get("content-security-policy", ""):
        m["x_frame"] = True
    m["headers_present"] = sum(1 for k in HEADERS if m[k])
    m["headers_missing"] = len(HEADERS) - m["headers_present"]

    m["mixed_content"] = len(re.findall(r"""<(?:script|img|iframe|link|source|video|audio)\b[^>]*\b(?:src|href)=["']http://""", html, re.I)) if m["https"] else 0

    cms, version = detect_cms(html, crawl["page"].get("generator", ""), headers)
    m["cms"], m["cms_version"] = cms, version

    server = headers.get("server", "")
    powered = headers.get("x-powered-by", "")
    m["server_header"] = " ".join(x for x in (server, powered) if x) or None
    m["server_leak"] = bool(re.search(r"/\d", server) or re.search(r"/\d", powered))

    m["git_exposed"] = _probe(src, final, "/.git/HEAD", lambda p: p.text.lstrip().startswith("ref:"))
    m["env_exposed"] = _probe(src, final, "/.env", lambda p: bool(re.search(r"^[A-Z_]+=", p.text, re.M)) and "<html" not in p.text.lower())
    if cms == "WordPress":
        m["wp_readme"] = _probe(src, final, "/readme.html", lambda p: "wordpress" in p.text.lower())
        m["xmlrpc_open"] = _probe(src, final, "/xmlrpc.php", lambda p: "XML-RPC server accepts POST requests only" in p.text, ok_status=(200, 405))
        m["wp_login_open"] = _probe(src, final, "/wp-login.php", lambda p: "user_login" in p.text)
        m["dir_listing"] = _probe(src, final, "/wp-content/uploads/", lambda p: "Index of" in p.text)
    else:
        m["wp_readme"] = m["xmlrpc_open"] = m["wp_login_open"] = m["dir_listing"] = False
    m["exposed_count"] = sum(1 for k in ("git_exposed", "env_exposed", "wp_readme", "dir_listing") if m[k])
    m["backups"] = "unknown"  # can't be seen from outside
    return {"status": "ok", "metrics": m, "raw": {}}


def _probe(src, base: str, path: str, looks_exposed, ok_status=(200,)) -> bool:
    try:
        page = src.fetch(urljoin(base, path))
    except SourceError:
        return False
    return page.status in ok_status and looks_exposed(page)


def detect_cms(html: str, generator: str, headers: dict) -> tuple[str | None, str | None]:
    gen = generator or ""
    m = re.match(r"WordPress\s*([\d.]+)?", gen, re.I)
    if m or "/wp-content/" in html or "/wp-includes/" in html:
        version = m.group(1) if m and m.group(1) else None
        if not version:
            v = re.search(r"/wp-includes/[^\"']+\?ver=([\d.]+)", html)
            version = v.group(1) if v else None
        return "WordPress", version
    checks = [
        ("Shopify", "cdn.shopify.com" in html or "x-shopify-stage" in headers),
        ("Wix", "wix.com" in gen.lower() or "static.wixstatic.com" in html),
        ("Squarespace", "squarespace" in gen.lower() or "static1.squarespace.com" in html),
        ("Webflow", "webflow" in gen.lower() or "data-wf-site" in html),
        ("Joomla", "joomla" in gen.lower()),
        ("Drupal", "drupal" in gen.lower() or "x-drupal-cache" in headers),
        ("Next.js", "/_next/static/" in html),
    ]
    for name, hit in checks:
        if hit:
            return name, None
    return (gen or None), None
