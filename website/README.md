# scikit.com.au

Marketing site for Scikit. Next.js 16 (App Router), Tailwind CSS v4 and shadcn/ui (Base UI), with Lucide icons and Magic UI animations (motion). Every page is statically generated.

The design comes from the Claude Design handoff in `../branding/design_handoff_scikit_website/`, and the copy from `../content/`.

## Run locally

```bash
cp .env.example .env.local   # then fill in your details and RESEND_API_KEY
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

## Where things live

| What | File |
|---|---|
| Business details (email, phone, address, ABN, socials, WhatsApp) | `.env.local` / Vercel env vars (read in `src/lib/site.ts`) |
| Prices | `src/content/pricing.ts` and the `plans` in `src/content/services.ts` |
| Service pages (all 8 use one template) | `src/content/services.ts` → `src/app/services/[slug]/page.tsx` |
| FAQs | `src/content/faqs.ts` |
| Home page lists (audit items, process steps, founders, promises) | `src/content/home.ts` |
| Brand colours, fonts, layout utilities | `src/app/globals.css` |
| Header, footer, CTA block, chat widget, FAQ accordion | `src/components/site/` |
| Contact form + server action (Resend email, Cloudflare Turnstile bot check) | `src/app/contact/`, `src/lib/mailer.ts`, `src/lib/turnstile.ts` |
| SEO: sitemap, robots (AI crawlers allowed), JSON-LD | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/site/json-ld.tsx` |

## Before launch

- [ ] Fill in the `NEXT_PUBLIC_*` business details (email, phone, address, postcode, ABN, WhatsApp, socials). Anything unset shows as a `[...]` placeholder.
- [ ] Confirm prices (see `content/research/scikit-pricing-research.pdf` for recommended launch prices).
- [ ] Replace the founder photo placeholders and the CSS laptop on the home page with real images.
- [ ] Have `/privacy` and `/terms` reviewed and set their "Last updated" dates.
- [ ] Set `RESEND_API_KEY` (and the `TURNSTILE_*` keys) and send a test enquiry.

## Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel. If the repo root is the parent folder, set **Root Directory** to `website`. The framework preset (Next.js) is detected automatically.
2. Add the environment variables from `.env.example` in **Project → Settings → Environment Variables**.
3. Add the domain `scikit.com.au` (and `www`) in **Project → Settings → Domains**, and update the DNS records at your registrar as Vercel shows.
4. After launch, submit `https://www.scikit.com.au/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
