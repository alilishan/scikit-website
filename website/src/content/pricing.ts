// All prices AUD, ex GST. Drafts — see content/research/scikit-pricing-research.pdf
// for recommended launch prices before going live.

export type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  popular?: boolean;
};

export const webPlans: Plan[] = [
  {
    name: "Starter",
    price: "$3,500",
    desc: "Up to 5 pages. Ideal for new businesses and sole traders. Live in about 3 weeks.",
    features: ["Up to 5 pages", "Mobile-first design", "Enquiry form", "SEO setup and Google Business Profile", "Live in about 3 weeks"],
  },
  {
    name: "Growth",
    price: "$7,500",
    popular: true,
    desc: "Up to 12 pages, custom design, online bookings or quote requests, blog, copywriting help. Live in 4–6 weeks.",
    features: ["Up to 12 pages, custom design", "Bookings or quote requests", "Blog and copywriting help", "CRM or email marketing integration", "Live in 4–6 weeks"],
  },
  {
    name: "Commerce",
    price: "$12,000",
    desc: "Online store with payments, shipping, GST and Xero/MYOB. Live in 6–8 weeks.",
    features: ["Online store (Shopify, WooCommerce or custom)", "Payments, shipping and GST set up", "Xero / MYOB integration", "Live in 6–8 weeks"],
  },
];

export type SimplePlan = { name: string; price: string; unit: string; desc: string };

export const seoPlans: SimplePlan[] = [
  { name: "Free Website & SEO Audit", price: "$0", unit: "", desc: "Video walkthrough and a one-page report within 3 business days." },
  { name: "Local SEO Setup", price: "$1,500", unit: "one-off, from", desc: "Google Business Profile, citations, schema and on-page fixes." },
  { name: "Local", price: "$790", unit: "/ month", desc: "1 area · 10 keywords · 1 article a month · monthly report" },
  { name: "Growth", price: "$1,490", unit: "/ month", desc: "City or region · 25 keywords · 2 articles a month · AI search tracking · monthly review call" },
];

export const carePlans: SimplePlan[] = [
  { name: "Essentials", price: "$99", unit: "/ month", desc: "Hosting, updates, backups, 30 min of changes." },
  { name: "Business", price: "$249", unit: "/ month", desc: "Plus security scanning, SEO health report, 2 hrs of changes." },
  { name: "Complete", price: "$599", unit: "/ month", desc: "Plus Microsoft 365 admin, security checks, 5 hrs of support." },
];

export const otherPrices = [
  { name: "Custom software / web app", price: "from $10,000" },
  { name: "Mobile app (iOS + Android)", price: "from $20,000" },
  { name: "Automation or integration", price: "from $2,500" },
  { name: "Cloud architecture & security review", price: "from $2,500" },
  { name: "Cloud migration or new platform", price: "from $8,000" },
  { name: "Cloud cost review", price: "from $1,200" },
  { name: "Microsoft 365 setup or migration", price: "from $1,500" },
  { name: "Security review (Essential Eight)", price: "from $1,800" },
  { name: "Hourly work", price: "$150 / hour" },
];

export const payment = [
  "Projects under $5,000: 50% upfront, 50% at launch",
  "Larger projects: milestone payments",
  "Monthly plans: billed in advance",
  "Bank transfer or card, 14-day terms",
];
