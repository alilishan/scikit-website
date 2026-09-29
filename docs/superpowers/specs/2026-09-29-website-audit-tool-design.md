# Scikit Website & SEO Audit Tool — Design

Date: 2026-09-29
Status: Draft for review

## Purpose

The website offers a "Free Website & SEO Audit": a prospect sends their URL and gets a short video walkthrough plus a one-page report within 3 business days. This tool produces that one-page report.

It is an internal command-line tool that only Lishan runs, on Lishan's Mac. It is **not** part of the website. The website keeps collecting the lead through the existing contact form; the audit is run by hand afterwards.

Success looks like: one command per prospect gives a branded, accurate A4 report (HTML + PDF) in a few minutes. It never repeats paid API calls for a site audited in the last 30 days, and it stays inside the SerpApi free plan.

## Decisions (agreed in chat)

| Topic | Decision |
|---|---|
| Where it lives | New `audit/` folder in this repo, separate from `website/` |
| Language | Python 3.12+ |
| Audit log | Local SQLite file `audit/audits.db`, only for Lishan |
| Re-audit rule | Each domain is audited once; again only if the last finished audit is 30+ days old (or with `--force`) |
| Speed / Core Web Vitals | Google PageSpeed Insights API |
| Rankings | SerpApi (Google engine, Australia, location-targeted) |
| Google Business Profile | SerpApi (Google Maps engine), so there is a single key |
| Search terms | Claude suggests 5 terms from the homepage; Lishan confirms or edits them before any search runs |
| Summary + "three things" | Claude drafts them from the ranked findings; Lishan edits the draft before rendering |
| Output | Branded one-page A4 `report.html` + `report.pdf` |

## Budget: SerpApi free plan

SerpApi is on the free plan, which has a small monthly search quota. Every design choice below tries to spend as few searches as possible.

- **Cost per audit: at most 6 searches**: 5 ranking terms × 1 page (top 10 results), plus 1 Maps lookup for GBP. There is no pagination.
- **GBP can cost 0 searches**: if a ranking search already returned a Google local pack that contains the business, the Maps lookup is skipped.
- **Re-renders cost 0 searches**: raw SerpApi responses are stored in SQLite. Re-rendering, changing `rules.yaml` or changing the template never searches again.
- **30-day reuse**: see the Re-audit rule above.
- **Confirmation before spending**: before any searches run, the tool shows `This audit will use N searches. X left this month. Continue? [y/N]`. The remaining count comes from SerpApi's Account API (`/account.json`), which doesn't count against the quota.
- **Hard stop**: `rules.yaml` sets `budget.serpapi_monthly_limit`. The tool refuses to run if the searches it has logged this month plus N would go over that limit.
- **Cost-free development**: tests and `--offline` runs use recorded fixture responses in `audit/tests/fixtures/` and never call SerpApi.
- `--skip-ranking` / `--skip-gbp` flags let an audit run without spending searches; those sections show "not checked".

PageSpeed Insights (free, 25k requests/day with a key) and Claude (a few cents per audit) aren't quota-limited in practice.

## Folder layout

```
audit/
  README.md               how to set up and run
  pyproject.toml          deps: httpx, jinja2, pyyaml, anthropic, playwright, rich
  .env                    SERPAPI_KEY, PSI_API_KEY, ANTHROPIC_API_KEY (gitignored)
  .env.example            same keys, empty (committed)
  rules.yaml              thresholds, findings, wording, budget, limits
  brand/
    report.html.j2        Jinja2 template, A4 print CSS
    report.css
    logo.svg              copied from branding/logos/scikit-primary.svg
    fonts/                Inter + Inter Tight (local, so PDFs render offline)
  scikit_audit/
    __main__.py           CLI entry
    cli.py                argument parsing, the confirm prompts
    db.py                 SQLite schema + queries
    normalise.py          URL → domain key
    crawl.py              single homepage fetch shared by all checks
    checks/
      speed.py            PageSpeed Insights
      ranking.py          SerpApi Google search
      gbp.py              SerpApi Google Maps (or local pack reuse)
      security.py         HTTPS, cert, headers, CMS, exposed files
    rules.py              evaluates rules.yaml → findings
    ai.py                 Claude: term suggestion, summary + three fixes
    render.py             Jinja2 → HTML, Playwright → PDF
  reports/                output, gitignored: <domain>/<date>/report.{html,pdf}, draft.yaml
  audits.db               gitignored
  tests/
    fixtures/             recorded PSI / SerpApi / Claude / HTML responses
```

The website and the tool share no code; `brand/` holds copies of the colours and logo.

## Command line

```
python -m scikit_audit https://example.com.au            # full audit
python -m scikit_audit example.com.au --force            # ignore the 30-day rule
python -m scikit_audit example.com.au --render-only      # re-render latest stored audit (0 API calls)
python -m scikit_audit example.com.au --terms "a, b, c"  # skip the Claude suggestion
python -m scikit_audit example.com.au --skip-ranking --skip-gbp
python -m scikit_audit --list                            # recent audits + searches used this month
python -m scikit_audit --offline <fixture-name>          # run on fixtures (development)
```

## Pipeline

1. **Normalise + look up.** Lower-case the URL, drop the scheme, `www.`, the path, query and trailing slash to get the `domain` key. If there's a `complete` audit for that domain under 30 days old and no `--force`, print its date and go straight to step 7 (re-render).
2. **Crawl.** Make one `httpx` GET of the homepage (follow redirects, 15s timeout, a normal browser user-agent). Keep: final URL, redirect chain, status, headers, HTML, TLS certificate expiry. If the site can't be reached, stop with a clear message; nothing is spent.
3. **Suggest terms.** Claude gets the title, meta description, H1/H2s, visible address/suburb and the business name. It returns JSON: 5 terms, plus a `location` (e.g. "Melbourne, Victoria, Australia") and the business name. The terminal shows them and Lishan accepts, edits or replaces them. Skipped when `--terms` is given.
4. **Confirm budget.** Show the number of searches this audit needs and how many are left (see Budget), then wait for y/N.
5. **Run the checks.** `speed` and `security` run in parallel with the SerpApi checks. Each check returns `{status: ok|error|skipped, metrics: {...}, raw: {...}}`. An `error` never stops the audit.
   - **speed**: PSI `runPagespeed` for `mobile` and `desktop`. Records performance/accessibility/best-practices/SEO scores; LCP, CLS, INP and FCP (field data if CrUX has it, otherwise lab); plus the top 3 "opportunities".
   - **ranking**: for each term, SerpApi `engine=google`, `google_domain=google.com.au`, `gl=au`, `hl=en`, `location=<location>`, one page. Records the site's position (or "not in top 10"), the top 3 organic competitor domains, and whether a local pack appeared and whether the business is in it.
   - **gbp**: reuse a local-pack match if there is one; otherwise one SerpApi `engine=google_maps` search for `<business name> <suburb>`. Records rating, review count, category, hours present, photo count, website link present, and whether the listing looks claimed. If no confident match is found, report "Couldn't find a Google Business Profile" (itself a finding).
   - **security**: from the crawl plus a few cheap requests to the prospect's site (no paid APIs). Checks: HTTP→HTTPS redirect, certificate days left, HSTS/CSP/X-Frame-Options/X-Content-Type-Options/Referrer-Policy, mixed content in the HTML, CMS + version from the generator meta/paths, and exposed `/.git/HEAD`, `/wp-login.php`, `/readme.html`, `/xmlrpc.php`, directory listing. Backups are always reported as "Can't be checked from outside — ask us".
6. **Findings + draft.** `rules.py` evaluates `rules.yaml` against the metrics and produces findings (`id, section, severity high|medium|low, text`) sorted by severity. Claude gets the findings and key metrics and returns `summary` (2 sentences, plain English, for a small-business owner) and `fixes` (exactly 3, each a title plus a sentence). This is written to `draft.yaml`, which opens in `$EDITOR`; after Lishan saves it, the tool asks "Render? [Y/n]".
7. **Render.** Jinja2 renders `report.html` from the stored metrics, findings and edited draft. Playwright (Chromium) prints `report.pdf` on A4 with backgrounds on. Everything is written to `reports/<domain>/<YYYY-MM-DD>/`, and the tool prints the paths.

## Storage

```sql
CREATE TABLE audits (
  id              INTEGER PRIMARY KEY,
  domain          TEXT NOT NULL,
  url             TEXT NOT NULL,        -- final URL after redirects
  created_at      TEXT NOT NULL,        -- ISO 8601 UTC
  status          TEXT NOT NULL,        -- running | complete | failed
  terms_json      TEXT,                 -- terms + location + business name
  metrics_json    TEXT,                 -- per-check {status, metrics}
  raw_json        TEXT,                 -- raw PSI / SerpApi / crawl responses
  findings_json   TEXT,
  draft_json      TEXT,                 -- the edited summary + three fixes
  serpapi_used    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX audits_domain_created ON audits(domain, created_at);
```

The 30-day rule and the monthly search count are both queries on this table.

## rules.yaml

```yaml
budget:
  serpapi_monthly_limit: 100        # set to your plan's quota
  reaudit_after_days: 30
limits:
  ranking_terms: 5
  competitors_shown: 3
thresholds:
  lcp_s:       { good: 2.5, poor: 4.0 }
  cls:         { good: 0.1, poor: 0.25 }
  inp_ms:      { good: 200, poor: 500 }
  perf_score:  { good: 90,  poor: 50 }
  cert_days:   { warn: 30,  fail: 7 }
  gbp_reviews: { warn: 20 }
  gbp_rating:  { warn: 4.2 }
findings:
  - id: slow_mobile
    section: speed
    when: "speed.mobile.lcp_s > thresholds.lcp_s.poor"
    severity: high
    text: "Your site takes {speed.mobile.lcp_s}s to show on a phone. Google's target is under 2.5s."
  # ~25 findings covering the four sections
```

`when` expressions are evaluated with a small, safe evaluator (comparisons, `and`/`or`/`not`, dotted lookups into metrics/thresholds, no arbitrary Python). If a finding refers to a metric that's missing because its check failed, that finding simply doesn't fire.

## Report

A single A4 portrait page with the Scikit brand: off-white `#f8f7f4` background, charcoal `#111111` text, orange `#ff6a2e` accents (large orange text uses `#ee5a1f` for contrast), Inter Tight for headings and Inter for body text.

Sections, top to bottom:
1. Header: logo, "Website & SEO Audit", domain, date.
2. Summary box: Claude's edited 2-sentence summary.
3. **01 Speed & mobile**: mobile and desktop score gauges; LCP, CLS and INP with pass/warn/fail chips.
4. **02 Search rankings**: a table of term, your position and the top 3 competitors.
5. **03 Google Business Profile**: rating, review count, and a checklist (hours, photos, website link, claimed).
6. **04 Security & backups**: a ✓ / ⚠ / ✗ checklist; backups shown as "ask us".
7. **05 The three things we'd fix first**: numbered, with an orange rail on the left.
8. Footer: scikit.com.au, info@scikit.com.au, "Book a call".

A section whose check failed or was skipped shows "Not checked this time — we'll cover it in your video walkthrough." Content is kept to one page by capping list lengths from `rules.yaml`, and the rendered HTML is checked to fit A4 (see Testing).

## Error handling

- Missing API key → that check is `skipped` with the reason; the audit continues.
- HTTP errors / timeouts → one retry with backoff, then `error`; the audit continues.
- Claude fails or returns invalid JSON → one retry. If that fails, term suggestion falls back to manual entry, and the draft falls back to an empty `draft.yaml` for Lishan to fill in.
- Ctrl-C mid-run → the audit row stays `running`. The next run for that domain reuses any stored check results instead of calling the APIs again.

## Testing

- Unit tests (pytest) for `normalise`, the rules evaluator, the budget maths and each check's parsing, all run against recorded fixtures. **No test calls SerpApi.**
- One end-to-end `--offline` run on a fixture site produces an HTML and PDF; the test asserts the PDF is exactly 1 page.
- Manual check: one real audit of scikit.com.au (6 searches at most) before using it on prospects.

## Out of scope (first version)

- Any website integration (form, API route, public report page).
- Sharing the audit log with Hassan (would need a hosted DB).
- Recording the video walkthrough.
- Auditing pages other than the homepage.
- Emailing the report automatically.
