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

      {s.platforms && (
        <section className="container-site flex flex-col gap-8 pt-[88px]">
          <Reveal className="flex max-w-[720px] flex-col gap-3.5">
            <h2 className="display m-0 text-[clamp(30px,3.2vw,44px)] tracking-[-0.035em]">{s.platforms.title}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-body">{s.platforms.intro}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div role="table" aria-label={s.platforms.title} className="overflow-hidden rounded-xl bg-white shadow-card">
              <div role="row" className="hidden grid-cols-[1fr_1.3fr_1.3fr] gap-6 border-b border-warm-200 bg-offwhite px-7 py-4 text-xs tracking-[0.16em] text-label md:grid">
                <span role="columnheader">CAPABILITY</span>
                <span role="columnheader">AWS</span>
                <span role="columnheader">AZURE</span>
              </div>
              {s.platforms.rows.map((r) => (
                <div
                  key={r.capability}
                  role="row"
                  className="grid gap-x-6 gap-y-2 border-b border-warm-100 px-7 py-5 last:border-b-0 md:grid-cols-[1fr_1.3fr_1.3fr] md:py-4"
                >
                  <span role="rowheader" className="text-[15px] font-semibold">{r.capability}</span>
                  <span role="cell" className="text-[15px] leading-normal text-body">
                    <span className="mr-2 text-xs tracking-[0.12em] text-label md:hidden">AWS</span>
                    {r.aws}
                  </span>
                  <span role="cell" className="text-[15px] leading-normal text-body">
                    <span className="mr-2 text-xs tracking-[0.12em] text-label md:hidden">AZURE</span>
                    {r.azure}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {s.examples && (
        <section id="examples" className="container-site flex scroll-mt-24 flex-col gap-8 pt-[88px]">
          <Reveal className="flex max-w-[720px] flex-col gap-3.5">
            <h2 className="display m-0 text-[clamp(30px,3.2vw,44px)] tracking-[-0.035em]">{s.examples.title}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-body">{s.examples.intro}</p>
          </Reveal>
          <div className="auto-grid gap-5 [--min:300px]">
            {s.examples.items.map((ex, i) => (
              <Reveal key={ex.title} delay={stagger(i, 0.1)} className="flex flex-col gap-4 rounded-[14px] bg-white p-8 shadow-card">
                <span className="text-xs tracking-[0.16em] text-label uppercase">{ex.platform}</span>
                <h3 className="display m-0 text-[22px] leading-tight tracking-[-0.02em]">{ex.title}</h3>
                <p className="m-0 text-[15px] leading-[1.6] text-body">{ex.goal}</p>
                <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-warm-100 p-0 pt-4">
                  {ex.setup.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-normal">
                      <CheckIcon aria-hidden strokeWidth={2.5} className="mt-0.5 size-4 shrink-0 text-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {s.method && (
        <section className="mt-[88px] border-y border-warm-100 bg-offwhite">
          <div className="container-site flex flex-col gap-8 py-[72px]">
            <Reveal>
              <h2 className="display m-0 text-[32px] tracking-[-0.03em]">{s.method.title}</h2>
            </Reveal>
            <ol className="auto-grid m-0 list-none gap-x-8 gap-y-6 p-0 [--min:230px]">
              {s.method.steps.map((step, i) => (
                <li key={step.title} className="border-t border-warm-200">
                  <Reveal delay={stagger(i, 0.08)} offset={8} className="flex flex-col gap-2 pt-4">
                    <span className="display text-[28px] tracking-[-0.03em] text-orange-ink">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="display m-0 text-xl tracking-[-0.02em]">{step.title}</h3>
                    <p className="m-0 text-[15px] leading-[1.6] text-body">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

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
            {c.link && (
              <div>
                <TextLink href={c.link.href}>
                  {c.link.label} <Arrow />
                </TextLink>
              </div>
            )}
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
