"""Claude: suggests the 5 search terms, then drafts the summary and the three fixes."""

from __future__ import annotations

import json

from pydantic import BaseModel, Field


class TermSuggestion(BaseModel):
    business_name: str = Field(description="The business's trading name as shown on the site")
    suburb: str = Field(description="Suburb or city the business serves, e.g. 'Richmond'. Empty if unknown.")
    state: str = Field(description="Australian state abbreviation, e.g. 'VIC'. Empty if unknown.")
    terms: list[str] = Field(description="Exactly 5 Google searches a local customer would type")


class Fix(BaseModel):
    title: str = Field(description="Short imperative headline, max 8 words")
    detail: str = Field(description="One sentence: what we'd do and why it brings in more work")


class Draft(BaseModel):
    summary: str = Field(description="Two plain-English sentences summarising the audit for the owner")
    fixes: list[Fix] = Field(description="Exactly 3 fixes, most valuable first")


TERMS_SYSTEM = """You help a Melbourne web agency audit small-business websites in Australia.
Given facts scraped from a business's homepage, identify the business and suggest the 5 Google
searches its customers most likely type when looking for what it sells. Use Australian wording.
Mix service + location searches (e.g. "emergency plumber richmond") with one or two broader ones
(e.g. "blocked drain melbourne"). Lower-case, no brand names, no quotes."""

DRAFT_SYSTEM = """You write the summary and "three things we'd fix first" for a free one-page
website audit from Scikit, a Melbourne web agency. The reader is a busy small-business owner,
not a technical person. Plain Australian English, no jargon (or explain it in a few words),
no hype, no exclamation marks. Be specific and use the numbers given. Base everything only on the
findings and metrics provided; never invent problems. Pick the three fixes that would bring in the
most enquiries, combining related findings where it makes sense."""


def suggest_terms(src, page: dict, domain: str, n: int = 5) -> TermSuggestion:
    facts = {k: page.get(k) for k in ("title", "meta_description", "h1", "h2", "schema_types", "text_excerpt")}
    prompt = f"Website: {domain}\nHomepage facts:\n{json.dumps(facts, indent=1)}\n\nSuggest exactly {n} search terms."
    result = src.claude("terms", TERMS_SYSTEM, prompt, TermSuggestion)
    result.terms = [t.strip().lower() for t in result.terms if t.strip()][:n]
    return result


def draft(src, domain: str, business: str, findings: list[dict], metrics: dict, n_fixes: int = 3) -> Draft:
    key = {
        name: r.get("metrics")
        for name, r in metrics.items()
        if r.get("status") == "ok" and name in ("speed", "ranking", "gbp", "security")
    }
    # Drop bulky or noisy parts Claude doesn't need.
    for strategy in ("mobile", "desktop"):
        (key.get("speed") or {}).get(strategy, {}).pop("opportunities", None)
    prompt = (
        f"Business: {business} ({domain})\n\n"
        f"Findings, most severe first:\n{json.dumps(findings, indent=1)}\n\n"
        f"Key metrics:\n{json.dumps(key, indent=1, default=str)}\n\n"
        f"Write the summary and exactly {n_fixes} fixes."
    )
    result = src.claude("draft", DRAFT_SYSTEM, prompt, Draft)
    result.fixes = result.fixes[:n_fixes]
    return result
