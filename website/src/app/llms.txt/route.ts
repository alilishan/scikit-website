import { services } from "@/content/services";
import { faqGroups } from "@/content/faqs";
import { carePlans, otherPrices, seoPlans, webPlans } from "@/content/pricing";
import { work } from "@/content/work";
import { addressLine, site } from "@/lib/site";

// /llms.txt: a plain-text summary for AI answer engines (ChatGPT, Perplexity, Claude, Google AI).
// Generated from the same content as the pages, so it never drifts out of date.
export const dynamic = "force-static";

export function GET() {
  const u = (path: string) => `${site.url}${path}`;
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Scikit is a web design and software development studio in ${site.suburb}, ${site.state}, working with businesses across Australia. It is run by two senior engineers: Hassan Sheikh (former AWS Solutions Architect, AWS Security Specialty certified, 20 years in infrastructure) and Ali Lishan (Chief Software Architect, 20+ years building web and mobile applications). All prices are in AUD and exclude GST.`,
    "",
    "## Contact",
    ...(site.email ? [`- Email: ${site.email}`] : []),
    ...(site.phone ? [`- Phone: ${site.phone}`] : []),
    ...(site.whatsapp ? [`- WhatsApp: ${site.whatsapp}`] : []),
    ...(addressLine ? [`- Location: ${addressLine}`] : []),
    `- Start a project or request a free website & SEO audit: ${u("/contact")}`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.title}](${u(`/services/${s.slug}`)}): ${s.metaDescription}`),
    "",
    "## Pricing",
    ...webPlans.map((p) => `- Website, ${p.name}: from ${p.price}. ${p.desc}`),
    ...seoPlans.map((p) => `- SEO, ${p.name}: ${p.price}${p.unit ? ` ${p.unit}` : ""}. ${p.desc}`),
    ...carePlans.map((p) => `- Hosting & Care, ${p.name}: ${p.price} ${p.unit}. ${p.desc}`),
    ...otherPrices.map((p) => `- ${p.name}: ${p.price}`),
    `- Full pricing: ${u("/pricing")}`,
    "",
    "## Work",
    ...work.map((w) => `- [${w.name}](${w.url}) (${w.type}, ${w.sector}): ${w.brief}`),
    "",
    "## FAQ",
    ...faqGroups.flatMap((g) => g.items.map((f) => `- ${f.q} ${f.a}`)),
    "",
    "## Pages",
    `- [Process](${u("/process")})`,
    `- [FAQ](${u("/faq")})`,
    `- [Privacy policy](${u("/privacy")})`,
  ];
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
