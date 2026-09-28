# Handoff: Scikit Website (scikit.com.au)

## Overview
Marketing website for Scikit, a Melbourne web design, software and cloud studio for Australian small businesses. Seven pages are designed: Home, Services overview, Web Design (the template for every service page), Pricing, Process, FAQ and Contact. The site also has a shared header, footer, CTA block and floating chat widget. Brand assets (the logo set) are included.

## About the Design Files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. The task is to **recreate these designs in the target codebase** using its established patterns. If there is no codebase yet, choose a suitable framework. For a content site with SEO priority, we suggest **Next.js (App Router) or Astro, with Tailwind or CSS modules**, statically generated.

`Scikit Site.dc.html` is a single file with a client-side page switcher. In production, each page should be its own route (see the URL map below) with real `<title>` and meta description tags.

## Fidelity
**High-fidelity.** Colours, typography, spacing, copy and interactions are final. Recreate them pixel-accurately.

## Routes
| Page | URL | Prototype state |
|---|---|---|
| Home | `/` | `home` |
| Services overview | `/services` | `services` |
| Web Design | `/services/websites` | `web` |
| SEO, Custom Software, Hosting & Care, Mobile Apps, Cloud & M365, Cyber Security, AI & Automation | `/services/*` | not yet designed. Use the Web Design template with copy from the content PDF |
| Pricing | `/pricing` | `pricing` |
| Process | `/process` | `process` |
| FAQ | `/faq` | `faq` |
| Contact | `/contact` | `contact` |
| Privacy, Terms | `/privacy`, `/terms` | not designed. Use a plain long-form text layout |

SEO titles and meta descriptions for every page are in `content/Scikit-Website-Content.pdf` (the grey box at the top of each page).

## Design Tokens

### Colours
| Token | Hex | Use |
|---|---|---|
| charcoal | `#111111` | Text, primary buttons, dark sections |
| orange (accent) | `#FF6A2E` | Brand dot, accents, highlight CTA, numerals, ticks |
| white | `#FFFFFF` | Page background |
| off-white | `#F8F7F4` | Alternate section background, footer, light cards |
| warm-100 | `#EEECE7` | Section dividers |
| warm-200 | `#E6E4DF` | Card borders, row dividers |
| warm-300 | `#DDDAD4` | Input borders, FAQ dividers |
| warm-400 | `#D0CDC7` | Secondary button borders |
| body-muted | `#55534F` | Body copy on light |
| label-muted | `#6B6B6B` | Eyebrows, small labels |
| gray | `#9CA3AF` | Tertiary text |
| on-dark-muted | `#C9C7C2` | Body copy on charcoal |
| dark-border | `#2E2E2E` | Dividers inside dark sections |

### Typography
- **Headings:** Inter Tight 700 (Google Fonts). Negative tracking: −0.04em for H1, −0.035em for H2, −0.02 to −0.03em for H3.
  - H1: `clamp(38px, 4.6vw, 62px)`, line-height 1.02. The Home hero is `clamp(44px, 5.6vw, 76px)`, line-height 0.98.
  - H2: `clamp(32px, 3.4vw, 46px)`, line-height 1.04.
  - H3 / card titles: 20–24px.
  - Headlines end in an orange full stop: `<span style="color:#FF6A2E">.</span>`
- **Body:** Inter 400/500/600. Lead text 17–18px with line-height 1.6. Body 15–16px with line-height 1.55–1.65.
- **Eyebrow labels:** Inter 400, 12px, uppercase, letter-spacing 0.2em, colour `#6B6B6B`.
- Use `text-wrap: pretty` on paragraphs.

### Layout, spacing, radius
- Container: max-width 1240px, horizontal padding 40px (clamps to 20px on mobile).
- Section vertical padding: 80–96px. The hero top padding is 72–80px.
- Grids use `repeat(auto-fit, minmax(260–360px, 1fr))` with gaps of 20–56px.
- Radius: 999px for pills/buttons, 16px for large panels, 14px for plan cards, 12px for cards, 8px for inputs.
- Shadows appear only on the hero laptop and the chat panel (`0 24px 50px -20px rgba(0,0,0,.35)`).

### Buttons
- **Primary:** charcoal bg, off-white text, padding 16×26, pill, 15px/500. Hover changes the bg to orange with white text.
- **Accent** (dark sections): orange bg, white text. Hover changes to off-white bg with charcoal text.
- **Secondary:** transparent, 1px `#D0CDC7` border, pill. Hover changes the border to charcoal.
- **Text link:** 15px/500 with a 1px `#D0CDC7` bottom border, e.g. "All services →".

## Global Components
- **Announcement bar** (optional, can be toggled): charcoal, 13px centred. "Free website & SEO audit for Australian small businesses." plus an orange "Get yours →" link to Contact.
- **Header:** sticky, `rgba(255,255,255,.94)` with a backdrop blur and a 1px `#EEECE7` bottom border. It contains the logo (30px tall), 8 nav links (14px, gap 24px) and a primary "Start a project" pill. The active nav link is orange and weight 600.
  - **Below 1180px:** the nav links are hidden and a "Menu" pill button appears beside the CTA. It opens a full-width stacked list (17px links, 14px vertical padding, dividers). The header never wraps.
  - Nav: Web Design · SEO · Custom Software · Hosting & Care · More services (dropdown: Mobile apps, Cloud/IT & M365, Cyber security, AI & automation) · Pricing · Process · FAQ. The dropdown is not built in the prototype; implement a simple hover/click menu.
- **Shared CTA block** (bottom of every page except Contact): charcoal panel, radius 16, with a soft orange radial glow in the top-left. The title changes per page: Home "Ready to get found on Google?", Web "Get a fixed-price website quote within 2 business days.", Pricing "Want an exact price?", Process "Start with step 01." (button "Get my free audit"). The body copy and "or email [EMAIL]" line stay the same.
- **Footer:** off-white. Four columns: brand (logo, line, tagline), Services, Company, Contact (address, phone, email placeholders and socials). Below them sit the Acknowledgement of Country line, then a bottom bar with © and ABN on the left and Privacy/Terms on the right.
- **Floating chat:** fixed bottom-right. An orange pill labelled "Chat with us" toggles a 300px panel with a charcoal header (app icon, "Scikit", reply-time line), a greeting bubble and two buttons: "Message on WhatsApp" (primary) and "Send an SMS" (secondary). Link these to WhatsApp Business / an `sms:` URL.

## Screens

### Home
1. **Hero:** two columns (auto-fit, minmax 360). Left column: eyebrow with an orange dot "WEB DESIGN & SOFTWARE DEVELOPMENT · MELBOURNE", the H1 "Get Found. / Work Smarter. / Stay Secure." (line breaks as shown), lead copy, then the primary "Start a project →" and secondary "See our offer" buttons (the latter anchors to #offer). Right column: a CSS-built angled laptop (perspective 1600px; rotateY −18°, rotateX 7°, rotateZ 1.5°) showing a mini site preview. **Replace it with a real laptop photo or render** when one is available.
2. **Trust strip:** off-white band. "BUILT BY ENGINEERS CERTIFIED IN" followed by AWS Solutions Architect · AWS Security Specialty · Microsoft · Cisco CCNA · VMware. Swap it for client logos once there are 4+.
3. **Offer (#offer):** charcoal panel, radius 14, with an orange glow bottom-right. Left column: "FREE · NO OBLIGATION" in orange, the H2 "Free Website & SEO Audit", body copy and an orange "Get my free audit →" button. Right column: 5 numbered rows (01–05) separated by `#2E2E2E` dividers.
4. **Services:** H2 "One team, from website to cloud." with an "All services →" link. Four cards in a 1px-gap grid (the gap colour acts as the border, outer radius 12). Each card has a number and an orange dot, a title, body copy and "Learn more →". Hover changes the bg to off-white. Below the grid: "Also from the same team: Mobile apps · Microsoft 365 · Cyber security · AI & automation".
5. **Process:** off-white band. H2 "How We Work" with "See full process →". Four columns, each with a 2px charcoal top rule, an orange numeral, a title and a short line.
6. **Why Scikit:** two columns. Left: H2 and paragraph, then 4 ticks (orange circle with a white ✓). Right: two founder cards (96px photo placeholder, orange eyebrow, name, bio) for Ali Lishan and Hassan Sheikh.
7. **FAQ:** off-white band. Left column is sticky and holds the H2 "Questions, answered.", "Chat with us" (opens the chat widget) and "All FAQs". Right column: accordion with 6 questions.
8. Shared CTA, then the footer.
- **Recent Work** is intentionally omitted until there are 2–3 real projects (per the content notes).

### Services overview
Hero (eyebrow, H1, subline). "CORE SERVICES": 4 charcoal cards, each with an orange dot, title, short copy and an orange "Learn more →". "ALSO FROM THE SAME TEAM": 4 bordered white cards. Then an off-white "Not sure what you need?" band with the button "Get a free audit →".

### Web Design (service page template)
- Hero in two columns: eyebrow and H1 on the left; lead copy and two buttons on the right, bottom-aligned.
- "Every website includes": off-white band, 8 items in a grid, each with an orange ✓ and a top divider.
- "Packages": 3 plan cards. Growth is inverted (charcoal) with an orange "MOST POPULAR" pill. Each shows "from" + price (44px Inter Tight) + "+ GST" and a description. Includes a "See full pricing →" link.
- Two bordered info cards: "Already have a website?" and "Want to rank higher?".
- FAQ accordion with 3 questions.

### Pricing
Sections in order:
- Hero.
- Websites: 3 plan cards with feature lists (Growth inverted).
- SEO (off-white band): 4 cards, followed by the "Minimum 3 months…" note.
- Hosting & Care: 3 cards.
- Two columns: an "Other services" price table and a "Payment" list. Both use a 2px charcoal top rule and 1px row dividers.

### Process
Hero, then 4 step rows. Each row has a 44px orange numeral and a 30px title on the left, and a paragraph plus an off-white "You get: …" box on the right. Then a charcoal "Our promises" band with 4 items, each with a 2px orange top rule.

### FAQ
Hero "Straight answers." with 4 groups (Websites, SEO, Hosting & Support, Working with us). Each group has its title in the left column and an accordion spanning 2 columns.

### Contact
Two columns.
- **Left:** eyebrow, H1 "Tell us about your business.", lead copy, then an "OR REACH US DIRECTLY" key/value list (Email, Phone, Chat, Office, Hours).
- **Right:** off-white form card, radius 16, containing:
  - Name*, Business name, Email*, Phone (2-column auto-fit grid), then Current website.
  - "What do you need?" multi-select pill chips: New website · Website redesign · SEO · Hosting & care · Free audit · Something else. Selected chips are charcoal with off-white text.
  - Budget: single-select pill chips: Under $5k · $5k–$10k · $10k–$20k · $20k+ · Not sure.
  - "Tell us about your business*" textarea, the privacy line, and the primary "Send →" button.
  - **Success state** replaces the form: orange ✓ circle, "Thanks! We've got it." and "Ali or Hassan will be in touch within one business day.", plus a "Send another enquiry" reset link.
  - Inputs: 13×14 padding, 1px `#DDDAD4` border, radius 8, white bg, orange focus outline.

## Interactions & Behaviour
- FAQ accordions: each item toggles independently and the icon switches between + and −. Consider `<details>` for accessibility and SEO, or keep the answers in the DOM.
- Contact form: native required validation (Name, Email, About). On submit, POST to a form handler (Formspree, a Resend API route, etc.) and show the success state. Chips map to checkbox and radio inputs.
- Chat: toggles the panel open and closed; the "Chat with us" buttons elsewhere open it.
- The header is sticky, and page changes scroll to the top.
- Responsive: every grid uses auto-fit and collapses to one column on mobile. Headline sizes use clamp(). The header collapses below 1180px.

## Content
All copy comes from `content/home.md` and `content/Scikit-Website-Content.pdf`. The following placeholders **must be filled before launch**: `[EMAIL]`, `[PHONE]`, `[STREET ADDRESS]`, `[POSTCODE]`, `[ABN]`, and the LinkedIn/Instagram/Facebook URLs. Prices are drafts (the PDF notes that launch prices may change, e.g. Starter at $2,990).

## Assets (`logos/`)
All logos are outlined SVG paths with no font dependency.
- `scikit-wordmark.svg`, `-white`, `-mono`: the wordmark (Inter Tight 700, optically kerned, dotless ı with an independent orange dot).
- `scikit-primary.svg`, `-mono`, `-primary-offwhite`, `-reverse`: wordmark with the tagline "DIGITAL, BUILT PROPERLY."
- `scikit-lockup-web.svg`, `scikit-lockup-ship.svg`: wordmark with alternative taglines.
- `icon-dark.svg`, `icon-light.svg`, `icon-orange.svg`, `icon-mark.svg`, `icon-mark-white.svg`: app icon and bare "s" mark.
- `favicon.svg`: also generate `favicon.ico`, a 180px `apple-touch-icon` and a 512px PWA icon from this file.
- Photo placeholders (hero laptop screen, founder portraits) need real photography.

## Files
- `Scikit Site.dc.html`: all seven pages. Open it in a browser; switch pages with the nav or by adding `#home`, `#services`, `#web`, `#pricing`, `#process`, `#faq` or `#contact` to the URL.
- `Scikit Logo Set.dc.html`: brand sheet (logo usage, palette, type).
- `logos/`: SVG assets.
- `content/`: source copy.
- `support.js`: runtime needed to open the .dc.html prototypes locally.
