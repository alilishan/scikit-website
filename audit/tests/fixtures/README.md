# Test fixtures

Each folder is one recorded (or hand-written) audit, used by the tests and by
`python -m scikit_audit <url> --offline <folder>`. No file here costs a SerpApi search.

| File | Replaces |
|---|---|
| `pages.json` | fetches of the prospect's site, keyed by URL: `{status, url, headers, text, history}`. Missing URLs return 404. |
| `cert.json` | `{"days": N}`, days until the TLS certificate expires |
| `psi_mobile.json`, `psi_desktop.json` | PageSpeed Insights responses |
| `serp_google_<term-slug>.json` | SerpApi Google search for one term; falls back to `serp_google_default.json` |
| `serp_google_maps_<query-slug>.json` | SerpApi Google Maps search; falls back to `serp_google_maps_default.json` |
| `locations.json`, `account.json` | SerpApi Locations API and Account API (both free) |
| `claude_terms.json`, `claude_draft.json` | Claude's term suggestion and draft |

`brightflow/` is a made-up Richmond plumber on WordPress with typical problems: slow on mobile,
not in the map pack, few reviews, certificate expiring soon, readme.html exposed.
