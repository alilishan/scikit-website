import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CtaBlock } from "@/components/site/cta-block";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { PlanCard } from "@/components/site/plan-card";
import { Arrow, Eyebrow, PageTitle, Stop, TextLink } from "@/components/site/primitives";
import { getService, services } from "@/content/services";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/motion";
import { stagger } from "@/lib/stagger";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}` });
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.metaDescription,
    provider: { "@type": "ProfessionalService", name: site.name, url: site.url },
    areaServed: { "@type": "Country", name: "Australia" },
    url: `${site.url}/services/${s.slug}`,
    // Starting prices, so search and AI tools can quote them accurately. AUD, ex GST.
    offers: s.plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.desc,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: Number(p.price.replace(/[^\d.]/g, "")),
        priceCurrency: "AUD",
        valueAddedTaxIncluded: false,
        ...(p.prefix === "from" && { minPrice: Number(p.price.replace(/[^\d.]/g, "")) }),
      },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name: s.title, item: `${site.url}/services/${s.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbs} />
      {s.faqs && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      )}

      {/* Hero */}
      <section className="container-site auto-grid items-end gap-14 pt-20 pb-16 [--min:360px]">
        <Reveal onLoad className="flex flex-col gap-[22px]">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <PageTitle>
            {s.h1}
            <Stop />
          </PageTitle>
        </Reveal>
        <Reveal onLoad delay={0.2} className="flex flex-col gap-[22px]">
          <p className="m-0 text-lg leading-[1.6] text-body">{s.lead}</p>
          <div className="flex flex-wrap gap-3.5">
            <Link href={s.primary.href} className={buttonVariants({ variant: "brand", size: "md" })}>
              {s.primary.label} <Arrow />
            </Link>
            <Link href={s.secondary.href} className={buttonVariants({ variant: "pill", size: "md", className: "px-[22px] py-3.5" })}>
              {s.secondary.label}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Includes */}
      <section className="border-y border-warm-100 bg-offwhite">
        <div className="container-site flex flex-col gap-8 py-[72px]">
          <Reveal>
            <h2 className="display m-0 text-[32px] tracking-[-0.03em]">{s.includesTitle}</h2>
          </Reveal>
          <ul className="auto-grid m-0 list-none gap-x-8 gap-y-4 p-0 [--min:260px]">
            {s.includes.map((item, i) => (
              <li key={item} className="border-t border-warm-200">
                <Reveal delay={stagger(i, 0.05)} offset={8} className="flex items-start gap-3 py-3.5 text-[15px] leading-normal">
                <CheckIcon aria-hidden strokeWidth={2.5} className="mt-0.5 size-4 shrink-0 text-orange" />
                {item}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Plans */}
      <section className="container-site flex flex-col gap-9 py-[88px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="display m-0 text-[clamp(30px,3.2vw,44px)] tracking-[-0.035em]">{s.plansTitle}</h2>
          <TextLink href="/pricing">See full pricing <Arrow /></TextLink>
        </Reveal>
        <div className="auto-grid gap-5 [--min:280px]">
          {s.plans.map((p, i) => (
            <Reveal key={p.name} delay={stagger(i, 0.1)}>
              <PlanCard {...p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Info cards */}
      <section className="container-site auto-grid gap-5 pb-[88px] [--min:320px]">
        {s.cards.map((c, i) => (
          <Reveal key={c.title} delay={stagger(i, 0.1)} className="flex flex-col gap-3 rounded-[14px] bg-white p-8 shadow-card">
            <h2 className="display m-0 text-2xl tracking-[-0.02em]">{c.title}</h2>
            <p className="m-0 text-[15px] leading-[1.6] text-body">{c.body}</p>
          </Reveal>
        ))}
      </section>

      {/* FAQ */}
      {s.faqs && (
        <section className="mb-24 border-t border-warm-100 bg-offwhite">
          <div className="container-site auto-grid gap-12 py-20 [--min:320px]">
            <Reveal>
              <h2 className="display m-0 text-4xl tracking-[-0.03em]">FAQ</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqList items={s.faqs} />
            </Reveal>
          </div>
        </section>
      )}

      <CtaBlock title={s.ctaTitle} button={s.ctaButton} />
    </>
  );
}
