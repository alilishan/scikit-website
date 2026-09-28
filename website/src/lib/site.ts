// Business details used across the site, read from environment variables (see .env.example).
// NEXT_PUBLIC_* values are public: they're shown on the page and bundled for the browser.
// Anything left unset is simply not shown (no placeholders on the live site).

const env = (value: string | undefined, fallback = "") => (value && value.trim() ? value.trim() : fallback);

export const site = {
  name: "Scikit",
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "https://scikit.com.au"),
  tagline: "Websites, software & cloud for Australian small businesses.",
  description:
    "Scikit builds fast, secure websites that get found on Google, custom software that fits how you work, and the cloud systems that keep it all running, for Australian small businesses.",
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  // Digits only, with country code, e.g. "61400000000"
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  street: env(process.env.NEXT_PUBLIC_STREET_ADDRESS),
  suburb: env(process.env.NEXT_PUBLIC_SUBURB, "Melbourne"),
  state: env(process.env.NEXT_PUBLIC_STATE, "VIC"),
  postcode: env(process.env.NEXT_PUBLIC_POSTCODE),
  abn: env(process.env.NEXT_PUBLIC_ABN),
  hours: "Mon–Fri, 9am–5:30pm AEST/AEDT",
  // Update when the privacy policy or terms change.
  legalUpdated: env(process.env.NEXT_PUBLIC_LEGAL_UPDATED, "28 September 2026"),
  social: [
    { label: "LinkedIn", href: env(process.env.NEXT_PUBLIC_LINKEDIN_URL) },
    { label: "Instagram", href: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
    { label: "Facebook", href: env(process.env.NEXT_PUBLIC_FACEBOOK_URL) },
  ].filter((s) => s.href),
  showAnnouncement: true,
  showChat: true,
};

/** "Melbourne VIC 3000" (postcode only if set). */
export const localityLine = [site.suburb, site.state, site.postcode].filter(Boolean).join(" ");
/** Full address on one line, e.g. "1 Example St, Melbourne VIC 3000". */
export const addressLine = [site.street, localityLine].filter(Boolean).join(", ");

export const emailHref = site.email ? `mailto:${site.email}` : "/contact";
export const phoneHref = site.phone ? `tel:${site.phone.replace(/[^\d+]/g, "")}` : "/contact";
export const smsHref = site.phone ? `sms:${site.phone.replace(/[^\d+]/g, "")}` : "/contact";
export const whatsappHref = site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` : "/contact";
