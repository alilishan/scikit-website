"""Every outside call the tool makes goes through a Sources object.

LiveSources hits the real sites and APIs. FixtureSources replays recorded responses from
tests/fixtures/<name>/, so development and tests never spend SerpApi searches.
"""

from __future__ import annotations

import json
import re
import socket
import ssl
import time
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import TypeVar

import httpx
from pydantic import BaseModel

from .config import Keys

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
PSI_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
SERP_URL = "https://serpapi.com/search.json"
SERP_LOCATIONS_URL = "https://serpapi.com/locations.json"
SERP_ACCOUNT_URL = "https://serpapi.com/account.json"
MAX_HTML = 2_000_000

M = TypeVar("M", bound=BaseModel)


class SourceError(Exception):
    """An outside call failed after its retry. The check that made it reports status 'error'."""


@dataclass
class Page:
    status: int
    url: str
    headers: dict[str, str]
    text: str
    history: list[str] = field(default_factory=list)


class LiveSources:
    def __init__(self, keys: Keys, model: str):
        self.keys = keys
        self.model = model
        self.http = httpx.Client(headers={"User-Agent": UA}, follow_redirects=True, timeout=15)
        self.serp_calls = 0
        self._claude = None

    def _get(self, url: str, *, params=None, timeout: float = 15) -> httpx.Response:
        """GET with one retry (with backoff) on network errors and 429/5xx."""
        last: Exception | None = None
        for attempt in range(2):
            try:
                r = self.http.get(url, params=params, timeout=timeout)
                if r.status_code == 429 or r.status_code >= 500:
                    raise SourceError(f"{r.status_code} from {url}")
                return r
            except (httpx.HTTPError, SourceError) as e:
                last = e
                if attempt == 0:
                    time.sleep(2)
        raise SourceError(str(last))

    # --- the prospect's site ------------------------------------------------------------------
    def fetch(self, url: str) -> Page:
        r = self._get(url)
        return Page(
            status=r.status_code,
            url=str(r.url),
            headers={k.lower(): v for k, v in r.headers.items()},
            text=r.text[:MAX_HTML],
            history=[str(h.url) for h in r.history],
        )

    def cert_days(self, host: str) -> int | None:
        """Days until the TLS certificate expires, or None if there's no valid certificate."""
        try:
            ctx = ssl.create_default_context()
            with socket.create_connection((host, 443), timeout=10) as sock:
                with ctx.wrap_socket(sock, server_hostname=host) as tls:
                    cert = tls.getpeercert()
            expires = datetime.fromtimestamp(ssl.cert_time_to_seconds(cert["notAfter"]), UTC)
            return (expires - datetime.now(UTC)).days
        except (OSError, ssl.SSLError, KeyError, ValueError):
            return None

    # --- Google PageSpeed Insights ------------------------------------------------------------
    def psi(self, url: str, strategy: str) -> dict:
        params = [("url", url), ("strategy", strategy)]
        params += [("category", c) for c in ("performance", "accessibility", "best-practices", "seo")]
        if self.keys.psi:
            params.append(("key", self.keys.psi))
        r = self._get(PSI_URL, params=params, timeout=120)
        if r.status_code != 200:
            raise SourceError(f"PageSpeed Insights returned {r.status_code}: {r.text[:200]}")
        return r.json()

    # --- SerpApi -----------------------------------------------------------------------------
    def serp(self, params: dict) -> dict:
        """One paid search. Counted in self.serp_calls so the audit row records what was spent."""
        if not self.keys.serpapi:
            raise SourceError("SERPAPI_KEY is not set")
        r = self._get(SERP_URL, params={**params, "api_key": self.keys.serpapi}, timeout=60)
        self.serp_calls += 1
        data = r.json()
        if r.status_code != 200 or data.get("error"):
            # "hasn't returned any results" is a valid, empty answer, not a failure.
            if "hasn't returned any results" in str(data.get("error", "")):
                return data
            raise SourceError(f"SerpApi: {data.get('error') or r.status_code}")
        return data

    def serp_locations(self, q: str) -> list[dict]:
        """Free: doesn't count against the search quota."""
        r = self._get(SERP_LOCATIONS_URL, params={"q": q, "limit": 10})
        return r.json() if r.status_code == 200 else []

    def serp_account(self) -> dict | None:
        """Free: doesn't count against the search quota."""
        if not self.keys.serpapi:
            return None
        try:
            r = self._get(SERP_ACCOUNT_URL, params={"api_key": self.keys.serpapi})
            return r.json() if r.status_code == 200 else None
        except SourceError:
            return None

    # --- Claude ------------------------------------------------------------------------------
    def claude(self, kind: str, system: str, prompt: str, schema: type[M]) -> M:
        if not self.keys.anthropic:
            raise SourceError("ANTHROPIC_API_KEY is not set")
        import anthropic

        if self._claude is None:
            self._claude = anthropic.Anthropic(api_key=self.keys.anthropic)
        last: Exception | None = None
        for _ in range(2):
            try:
                resp = self._claude.messages.parse(
                    model=self.model,
                    max_tokens=16000,
                    system=system,
                    messages=[{"role": "user", "content": prompt}],
                    output_format=schema,
                )
                if resp.stop_reason == "refusal":
                    raise SourceError("Claude declined the request")
                if resp.parsed_output is None:
                    raise SourceError(f"Claude returned no parsable output (stop_reason={resp.stop_reason})")
                return resp.parsed_output
            except (anthropic.APIConnectionError, anthropic.RateLimitError, anthropic.InternalServerError, SourceError) as e:
                last = e
            except anthropic.APIStatusError as e:  # 400/401/404 etc. won't get better on retry
                raise SourceError(f"Claude API error {e.status_code}: {e.message}") from e
        raise SourceError(str(last))


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


class FixtureSources:
    """Replays tests/fixtures/<name>/*.json. See tests/fixtures/README.md for the file layout."""

    def __init__(self, directory: Path):
        self.dir = directory
        self.serp_calls = 0
        self.pages = self._load("pages.json") or {}

    def _load(self, name: str):
        p = self.dir / name
        return json.loads(p.read_text()) if p.exists() else None

    def fetch(self, url: str) -> Page:
        page = self.pages.get(url) or self.pages.get(url.rstrip("/")) or self.pages.get(url + "/")
        if page is None:
            return Page(status=404, url=url, headers={}, text="Not found")
        return Page(**page)

    def cert_days(self, host: str) -> int | None:
        return (self._load("cert.json") or {}).get("days")

    def psi(self, url: str, strategy: str) -> dict:
        data = self._load(f"psi_{strategy}.json")
        if data is None:
            raise SourceError(f"no fixture psi_{strategy}.json")
        return data

    def serp(self, params: dict) -> dict:
        self.serp_calls += 1
        name = f"serp_{params['engine']}_{slug(params['q'])}.json"
        data = self._load(name)
        if data is None:
            data = self._load(f"serp_{params['engine']}_default.json")
        if data is None:
            raise SourceError(f"no fixture {name}")
        return data

    def serp_locations(self, q: str) -> list[dict]:
        return self._load("locations.json") or []

    def serp_account(self) -> dict | None:
        return self._load("account.json")

    def claude(self, kind: str, system: str, prompt: str, schema: type[M]) -> M:
        data = self._load(f"claude_{kind}.json")
        if data is None:
            raise SourceError(f"no fixture claude_{kind}.json")
        return schema.model_validate(data)
