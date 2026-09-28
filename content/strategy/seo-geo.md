# SEO and GEO strategy: Scikit (scikit.com.au)

*Written September 2026. **SEO** means ranking in Google and Bing. **GEO** (generative engine optimisation) means being cited or recommended by AI answer engines: Google AI Overviews and AI Mode, ChatGPT, Perplexity, Claude, Copilot and Gemini.*

## Goals (first 12 months)

1. Show up in **Melbourne local searches** (Google map results and the regular results below them) for our core services.
2. Get **named in AI answers** to questions like "who can build a booking system for my clinic in Melbourne?" or "Essential Eight help for a small business in Victoria".
3. Win national, non-local searches through **useful guides** (pricing, Essential Eight, Microsoft 365, AI for small business).
4. Turn that traffic into **booked chats and health checks**, the only number that really matters.

---

## Part 1: The brand-name problem (do this first)

"Scikit" is owned in search by **scikit-learn**, the Python machine-learning library. Searching "scikit" alone will never show us. So:

- **Always pair the name with a descriptor.** Use "Scikit, web design & SEO agency Melbourne" or "Scikit Australia" in the homepage title, the "Why Scikit" section, Organization schema, Google Business Profile, LinkedIn, directories and email signatures. AI engines learn *entities* from consistent descriptions. Keep one sentence identical everywhere:
  > **Scikit builds fast, secure websites that get found on Google, custom software that fits how you work, and the cloud systems that keep it all running, for Australian small businesses.**
- **Organization schema with `sameAs`** links to every official profile (LinkedIn, Google Business Profile, Clutch, GoodFirms and so on). This tells Google and AI engines which "Scikit" we are.
- **Don't try to rank for "scikit".** Brand searches will come as "scikit melbourne" or "scikit.com.au".
- Consider a **visual and verbal identity** clearly separate from scikit-learn (see the logo prompt, which already rules out orange and blue circles).

---

## Part 2: Local SEO foundations

### Google Business Profile (the biggest single win)
- **Category:** "Software company". Secondary categories: "Website designer", "Computer support and services", "Computer security service", "Internet marketing service" (only if you do marketing).
- **Address rules:** Google doesn't allow virtual offices or PO boxes. Set up as a **service-area business**: verify using a real address (e.g. a founder's Melbourne home), then **hide the address** and list service areas (Melbourne, Victoria, and major cities). This matters because the footer currently has an address placeholder.
- Add every service, with descriptions and "from" prices matching the website.
- Add photos of the founders, not stock images. Post weekly (tips, project launches). Upload the logo and cover image.
- **Reviews are the biggest local ranking factor you control.** Ask every client, from the first project, with a direct review link in the handover email and the care-plan welcome email. Reply to every review.

### Keep name, address and phone (NAP) consistent
Use the same business name, phone, website and descriptor everywhere. Once the ABN is registered, check the business name on ABN Lookup matches.

### Directories and citations (these also feed GEO)
AI engines lean heavily on "best X in Melbourne" listicles, and those listicles pull from these directories. In priority order:
1. **Clutch, GoodFirms, DesignRush, TechBehemoths.** Our competitors appear through these ([see competitor research](../research/competitors.md)). Clutch reviews weigh heavily.
2. **Bing Places** (ChatGPT search draws on Bing's index) and **Apple Business Connect** (Siri and Apple Maps).
3. **True Local, Yellow Pages (Australia), Hotfrog, Yelp AU, StartLocal.**
4. **LinkedIn company page**, with both founders listing Scikit as their workplace.
5. Industry profiles: **AWS Partner Network** (once eligible) and **Microsoft partner listings**. Both are trust and link signals.

---

## Part 3: Keywords and page map

*No search-volume numbers here yet. Pull real figures from Google Keyword Planner or Search Console once live, and re-rank. Priorities below are based on buying intent and competition.*

| Priority | Search theme | Target page |
|---|---|---|
| **Top** | web design melbourne · small business web design · web design agency melbourne | `/` and `/services/websites` |
| **Top** | seo melbourne · local seo melbourne · seo for small business australia · seo agency melbourne | `/services/seo` (very competitive, so win long-tail and suburb/industry terms first) |
| High | small business website design melbourne · web design melbourne fixed price | `/services/websites` |
| High | custom software development melbourne · web app developers melbourne · booking system developer | `/services/custom-software` |
| High | essential eight small business · cyber security for small business melbourne · essential eight consultant victoria | `/services/cyber-security` |
| High | microsoft 365 setup small business · microsoft 365 migration melbourne · IT support small business melbourne | `/services/cloud-and-it` |
| Medium | app developers melbourne · mobile app development small business australia | `/services/mobile-apps` |
| Medium | ai automation small business australia · ai chatbot for website australia | `/services/ai-automation` |
| Medium | website hosting melbourne · website maintenance melbourne · website care plan · take over website from developer | `/services/hosting-care` |
| Medium | aws consultant melbourne · aws cost optimisation small business · aws migration small business | new page: `/services/aws` (Hassan's ex-AWS background is a strong, specific differentiator) |
| Content | how much does a website cost in australia · how much does an app cost australia · custom software cost australia | guides (see Part 5) |

### Industry pages (only once you have something real to say)
For example `/industries/clinics`, `/industries/trades`, `/industries/accountants`. Each needs genuinely specific content: industry rules (e.g. health records privacy for clinics), typical problems, relevant tools (Cliniko, ServiceM8, Xero Practice Manager). **Don't** mass-produce suburb or city pages ("web design Box Hill", "web design Geelong"…). Google treats these as doorway pages and they can hurt the whole site.

---

## Part 4: Technical SEO checklist

- [ ] Static or server-rendered pages (Next.js / Astro), not a client-only single-page app, so crawlers and AI bots see the full content without running JavaScript.
- [ ] Core Web Vitals in the green (LCP < 2.5s, INP < 200ms, CLS < 0.1). This is also a sales proof point: "our own site scores 100".
- [ ] One `<h1>` per page. Unique title (≤ 60 characters) and meta description (≤ 155). Already drafted in each page's front matter.
- [ ] Clean URLs as in the content README, `sitemap.xml`, canonical tags, `en-AU` language tag.
- [ ] **Structured data (JSON-LD):**
  - `Organization` + `ProfessionalService` (name, description sentence, logo, url, `areaServed: Australia`, `address` suburb/state only, `sameAs`)
  - `Person` for Ali and Hassan (`jobTitle`, `worksFor`, `sameAs` LinkedIn, credentials via `hasCredential`)
  - `Service` with `Offer` / `priceSpecification` in AUD on each service page
  - `FAQPage` on the FAQ and service-page FAQs
  - `Article` with an author on every guide
  - `BreadcrumbList`
- [ ] Google Search Console **and Bing Webmaster Tools** (Bing feeds ChatGPT and Copilot search). Submit the sitemap to both and turn on IndexNow.
- [ ] GA4 with conversion events: booking made, form submitted, phone click, email click.

### `robots.txt`: let AI crawlers in
Decide on purpose. For a new business that wants to be recommended, **allow**:
```
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
Sitemap: https://scikit.com.au/sitemap.xml
```
Also check the host or CDN (Vercel, Cloudflare) isn't blocking AI bots by default. Some now do.

Optional: publish `/llms.txt`, a short Markdown summary of who we are, services, prices and key URLs. There's little evidence it's heavily used yet, but it takes ten minutes.

---

## Part 5: Content strategy (SEO and GEO together)

### How to write every page so AI can quote it
AI engines pull short, self-contained passages. On every service page and guide:
1. **Answer first.** Open with a 40–60 word direct answer to the page's main question, naming Scikit and Melbourne/Australia.
   > *"A small business website in Australia typically costs $3,500–$12,000 + GST for a professional build. At Scikit, a web design and SEO agency in Melbourne, sites start from $3,500 for up to five pages and take about three weeks."*
2. **Question-style H2s** that match how people ask AI ("How long does a Microsoft 365 migration take?").
3. **Specific facts and numbers:** prices in AUD, timeframes, named standards (Essential Eight, Privacy Act 1988, APPs, Notifiable Data Breaches scheme). Vague copy doesn't get cited.
4. **Tables and lists** for comparisons and steps.
5. **A named author with credentials** on every guide. "Hassan Sheikh, AWS Certified Security – Specialty, former AWS Solutions Architect" is exactly the expertise and trust signal (Google's E-E-A-T) that both Google and AI engines reward.
6. **A visible "last updated" date.** Review quarterly, since AI engines favour fresh content.

### Content pillars and first 12 guides
Each guide links to its service page. Aim for **2 per month**.

**Costs (highest buying intent. Competitors already rank for these, and AI engines quote pricing guides constantly)**
1. How much does a website cost in Australia? (2026 pricing guide)
2. How much does it cost to build an app in Australia?
3. Custom software vs off-the-shelf: what it really costs a small business
4. Website maintenance costs in Australia: what you should be paying for

**Security (Hassan's authority)**
5. The Essential Eight for small business: a plain-English guide (with a free checklist PDF to capture leads)
6. Fake invoice and payment-redirection scams: how to protect your business
7. What to do in the first hour after your business email is hacked (Australia)

**Cloud and Microsoft 365**
8. Microsoft 365 Business Basic vs Standard vs Premium: which does a small business need?
9. Moving off an on-premise server: a small business guide to AWS and Azure
10. Why is my AWS bill so high? 10 things we find in small business accounts

**AI and software (Ali's authority)**
11. AI for small business in Australia: what's worth doing and what's hype
12. Is my customer data safe with ChatGPT? The Privacy Act and AI tools

### Proof content (add as you earn it)
- **Case studies** with real numbers (hours saved, enquiries up, costs cut). They're the most-cited content type for "who should I hire" questions. Name the client and industry, with permission.
- Real Google and Clutch reviews embedded on the site.

---

## Part 6: Off-site GEO (being mentioned where AI looks)

AI engines recommend businesses that *other sources* mention. Priorities:

1. **Directory profiles with reviews** (Part 2). Aim for 5+ Clutch reviews in year one.
2. **Get into "best X in Melbourne" listicles.** Many of the lists that surface competitors are published by agencies and directories that accept submissions. Contact the authors, and consider publishing honest comparison content of our own.
3. **LinkedIn:** both founders posting weekly (short practical tips from the guides). LinkedIn content is widely indexed and cited.
4. **Communities:** answer questions properly (not spam) on r/AusFinance, r/melbourne, r/smallbusiness, Whirlpool Forums and Australian small business Facebook groups. Reddit is one of the most-cited sources in AI answers.
5. **Local partnerships and backlinks:** accountants, bookkeepers, business coaches and co-working spaces who refer clients. Swap guest articles. Business associations: Business Victoria events, local chambers of commerce, Council for Small Business Organisations Australia (COSBOA) member groups.
6. **PR angles:** "ex-AWS architect offers free cyber health checks to Melbourne small businesses" for local media (e.g. Leader community news, SmartCompany, Dynamic Business).
7. **Free tools that earn links:** an Essential Eight self-assessment quiz, or a website cost calculator.

---

## Part 7: Measurement

| What | Tool | Check |
|---|---|---|
| Rankings, clicks, impressions | Google Search Console, Bing Webmaster Tools | Weekly |
| Map pack visibility, calls, direction requests | Google Business Profile insights | Monthly |
| Traffic from AI engines | GA4, filtered by referrer: `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`, `claude.ai` | Monthly |
| **AI visibility** | Manual prompt test (below), or a tracking tool once budget allows (e.g. Semrush AI toolkit, Ahrefs Brand Radar, Profound, LLMrefs) | Monthly |
| Leads | Bookings and form submissions, by source | Weekly |

### Monthly AI prompt test
Run the same 15–20 prompts in ChatGPT (search on), Perplexity, Google AI Mode, Gemini and Claude. Log whether Scikit is mentioned, which competitors are named, and which sources are cited. The cited sources tell you where to get listed next. Starter prompts:
- "Who can build a custom booking system for a small business in Melbourne?"
- "Best small business web developers in Melbourne"
- "I need help implementing the Essential Eight for my 10-person business in Victoria"
- "Who can migrate my small business to Microsoft 365 in Melbourne?"
- "Affordable AWS consultant for a small business in Australia"
- "How much does a website cost in Australia?" (are we cited as a source?)
- "AI automation help for an accounting firm in Melbourne"

---

## Part 8: 90-day plan

**Days 1–30: Foundations**
- Register the ABN and business name. Get a business phone number.
- Launch the site with schema, sitemap, robots.txt, Search Console, Bing Webmaster Tools and GA4 conversion tracking.
- Google Business Profile (service-area), Bing Places, Apple Business Connect, LinkedIn company page.
- Clutch, GoodFirms, DesignRush and TechBehemoths profiles, all using the same one-sentence description.
- Publish guide #1 (website cost) and #5 (Essential Eight) with the lead-capture checklist.
- Run the first AI prompt test as a baseline.

**Days 31–60: Authority**
- Publish guides #2, #8 and #10. Add the `/services/aws` page.
- Founders start weekly LinkedIn posts. Answer 2–3 community questions a week.
- Pitch 3 local partners (accountants or bookkeepers) and 1 media story.
- Start the free health-check offer. Every health check is a chance to ask for a review later.

**Days 61–90: Proof**
- First case study and first 3–5 reviews (Google + Clutch).
- Publish guides #6, #11 and #12.
- Contact 5 listicle authors about inclusion.
- Second AI prompt test. Compare with the baseline and adjust.

**After 90 days:** 2 guides a month, 1 case study a quarter, a quarterly freshness review of the top pages, a monthly prompt test, and industry pages once you've done 2+ projects in a sector.
