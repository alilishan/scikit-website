# Scikit — Website Content

Copy for the Scikit website. Every page is a Markdown file with front matter (title, meta description, slug) so it can be dropped into Next.js / Astro / any MDX setup.

## Site map

| Page | File | URL |
|---|---|---|
| Home | `home.md` | `/` |
| Services (overview) | `services/index.md` | `/services` |
| — Websites | `services/websites.md` | `/services/websites` |
| — SEO | `services/seo.md` | `/services/seo` |
| — Custom software & web apps | `services/custom-software.md` | `/services/custom-software` |
| — Mobile apps | `services/mobile-apps.md` | `/services/mobile-apps` |
| — Cloud, IT & Microsoft 365 | `services/cloud-and-it.md` | `/services/cloud-and-it` |
| — Cyber security | `services/cyber-security.md` | `/services/cyber-security` |
| — AI & automation | `services/ai-automation.md` | `/services/ai-automation` |
| — Hosting & Care | `services/hosting-care.md` | `/services/hosting-care` |
| Pricing | `pricing.md` | `/pricing` |
| Process | `process.md` | `/process` |
| FAQ | `faq.md` | `/faq` |
| Contact | `contact.md` | `/contact` |
| Privacy policy | `legal/privacy.md` | `/privacy` |
| Website terms | `legal/terms.md` | `/terms` |
| Shared bits (nav, footer, CTAs) | `global.md` | — |

## Positioning in one line

> **Get Found. Work Smarter. Stay Secure.**
> Scikit builds fast, secure websites that get found on Google, custom software that fits how you work, and the cloud systems that keep it all running, for Australian small businesses.

## Voice

- **Plain Australian English.** "Optimise", "organisation", "colour", "licence" (noun). Dollars are AUD and quoted **ex GST** unless stated.
- **Talk like a person, not an agency.** Short sentences. No "synergy", "cutting-edge", "world-class".
- **Lead with the owner's problem**, then the fix, then the proof.
- **Confident, not boastful.** We have serious enterprise experience; we use it to reassure, not to intimidate.
- **"We"** for the business. Founders are referred to by name.

## Placeholders to fill before launch

Search the folder for `[[` to find every one.

- `[[ABN]]` — register at abr.gov.au (and ACN if you incorporate as a Pty Ltd)
- `[[PHONE]]` — a business number (a 1300 number or a dedicated mobile, not a personal one)
- `[[EMAIL]]` — suggest hello@scikit.com.au
- `[[STREET ADDRESS]]` — or a virtual office / PO box; Melbourne is used as the city throughout
- Domain: **scikit.com.au** (confirmed)
- `[[LINKEDIN]]`
- Prices in `pricing.md` are **suggested starting points** — adjust to your costs before publishing.

## Things deliberately left out (add as you earn them)

- **Client logos, testimonials, case studies, star ratings.** None are invented here — the ACCC treats fake or unverifiable reviews/claims as misleading conduct. Add real ones as projects complete.
- **Partner badges** (AWS Partner, Microsoft Partner). Individual certifications are listed; company partner status needs to be applied for separately.

## Worth checking

- Both founders' bios name past and current employers (AWS, Powercor, Metro Trains Melbourne, etc.). Naming them factually as work history is normal, but check any current employment agreements for outside-business or conflict clauses, and never imply those organisations are clients or endorse Scikit.
- `legal/privacy.md` and `legal/terms.md` are sensible drafts, not legal advice. Have them reviewed.

## Research & strategy (internal — not website pages)

- `research/competitors.md` — Australian competitors, pricing benchmarks, positioning gaps
- `strategy/seo-geo.md` — SEO + GEO (AI search) strategy and 90-day plan
- `brand/logo-prompt.md` — prompt for Claude Design
- `_archive/` — superseded drafts (old long home page, old About page with full founder bios — reuse the bios for guide author boxes and LinkedIn)
