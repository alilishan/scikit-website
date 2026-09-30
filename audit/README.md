# Scikit Website & SEO Audit

Runs the "Free Website & SEO Audit" for a prospect and produces a branded one-page A4 report
(`report.html` + `report.pdf`). An internal tool, run by hand; not part of the website.
Design: [`docs/superpowers/specs/2026-09-29-website-audit-tool-design.md`](../docs/superpowers/specs/2026-09-29-website-audit-tool-design.md).

## Setup (once)

```bash
cd audit
uv sync                      # Python 3.12+ and dependencies into .venv
cp .env.example .env         # then fill in the three keys
```

| Key | Where | Needed for |
|---|---|---|
| `SERPAPI_KEY` | serpapi.com → API key | rankings + Google Business Profile |
| `PSI_API_KEY` | Google Cloud console → enable "PageSpeed Insights API" → create API key (free) | speed. Google refuses keyless requests, so this is required. |
| `ANTHROPIC_API_KEY` | console.anthropic.com | suggested search terms + the draft summary/fixes |

PDFs are printed with your installed Google Chrome. If Chrome isn't installed, run
`uv run playwright install chromium` once.

## Running an audit

```bash
uv run python -m scikit_audit someplumber.com.au
```

1. Loads the homepage.
2. Claude suggests the business name, suburb and 5 search terms. Press Enter to keep them or type your own.
3. Shows how many SerpApi searches it will use (max 6) and how many you have left, and asks before spending.
4. Runs speed, rankings, Google Business Profile and security checks.
5. Lists the findings, then opens `draft.yaml` (Claude's summary + three fixes) in your editor
   (`$EDITOR`, or TextEdit). Edit, save, press Enter.
6. Writes `reports/<domain>/<date>/report.html` and `report.pdf`.

Other commands:

```bash
uv run python -m scikit_audit site.com.au --force              # ignore the 30-day rule
uv run python -m scikit_audit site.com.au --render-only        # re-render, 0 API calls
uv run python -m scikit_audit site.com.au --render-only --edit # change the wording, re-render
uv run python -m scikit_audit site.com.au --terms "a, b, c" --location "Richmond, VIC"
uv run python -m scikit_audit site.com.au --skip-ranking --skip-gbp   # spend no searches
uv run python -m scikit_audit --list                           # recent audits + searches used
```

## SerpApi free plan

- Up to 6 searches per audit: 5 terms plus 1 Maps lookup. The Maps lookup is skipped when the
  business already shows in Google's map pack.
- A domain audited in the last 30 days is re-rendered from the database; nothing is searched again.
- `budget.serpapi_monthly_limit` in `rules.yaml` is a hard cap, currently 250 to match the free plan.
- If a run is interrupted, running the same command carries on and reuses the checks that already finished.

## Changing the report

- **Thresholds, findings, wording:** `rules.yaml`. Run `--render-only` to re-score stored audits.
- **Look and layout:** `brand/report.html.j2` and `brand/report.css`.

## Development

```bash
uv run pytest                                                   # no network, no searches
uv run python -m scikit_audit brightflowplumbing.com.au --offline brightflow   # fixture run
```

Fixture format: `tests/fixtures/README.md`. The audit log is `audits.db` (SQLite). Reports, the
database and `.env` are gitignored.
