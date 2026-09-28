import type { Metadata } from "next";
import { CtaBlock } from "@/components/site/cta-block";
import { PlanCard, PriceCard } from "@/components/site/plan-card";
import { Eyebrow, PageTitle, Stop } from "@/components/site/primitives";
import { carePlans, otherPrices, payment, seoPlans, webPlans } from "@/content/pricing";
import { Reveal } from "@/components/site/motion";
import { stagger } from "@/lib/stagger";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Pricing | Web Design & SEO Prices | Scikit",
  description:
    "Website design from $3,500, SEO from $790/month and hosting from $99/month. Clear, fixed prices for Australian small businesses. All prices AUD ex GST.",
  path: "/pricing",
});

const h2 = "display m-0 text-[30px] tracking-[-0.03em]";

export default function PricingPage() {
  return (
    <>
      <Reveal onLoad className="container-site flex flex-col gap-5 pt-20 pb-10">
        <Eyebrow>Pricing</Eyebrow>
        <PageTitle className="max-w-[820px]">
          Clear prices, fixed quotes<Stop />
        </PageTitle>
        <p className="m-0 max-w-[620px] text-lg leading-[1.6] text-body">
          You&apos;ll know exactly what you&apos;re paying before we start. All prices in AUD, ex GST.
        </p>
      </Reveal>

      <section className="container-site flex flex-col gap-6 pt-10 pb-16">
        <h2 className={h2}>Websites</h2>
        <div className="auto-grid gap-5 [--min:280px]">
          {webPlans.map((p, i) => (
            <Reveal key={p.name} delay={stagger(i, 0.1)}>
              <PlanCard name={p.name} prefix="from" price={p.price} features={p.features} popular={p.popular} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-warm-100 bg-offwhite">
        <div className="container-site flex flex-col gap-6 py-16">
          <h2 className={h2}>SEO</h2>
          <div className="auto-grid gap-5 [--min:240px]">
            {seoPlans.map((p, i) => (
              <Reveal key={p.name} delay={stagger(i)}>
                <PriceCard {...p} className="bg-white" />
              </Reveal>
            ))}
          </div>
          <p className="m-0 text-sm text-label">Minimum 3 months, then month-to-month.</p>
        </div>
      </section>

      <section className="container-site flex flex-col gap-6 py-16">
        <h2 className={h2}>Hosting &amp; Care</h2>
        <div className="auto-grid gap-5 [--min:260px]">
          {carePlans.map((p, i) => (
            <Reveal key={p.name} delay={stagger(i)}>
              <PriceCard {...p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site auto-grid gap-12 pt-4 pb-24 [--min:340px]">
        <Reveal className="flex flex-col gap-5">
          <h2 className={h2}>Other services</h2>
          <dl className="m-0 flex flex-col border-t-2 border-charcoal">
            {otherPrices.map((o) => (
              <div key={o.name} className="flex justify-between gap-5 border-b border-warm-200 py-[15px] text-[15px]">
                <dt>{o.name}</dt>
                <dd className="m-0 font-semibold whitespace-nowrap">{o.price}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-5">
          <h2 className={h2}>Payment</h2>
          <ul className="m-0 flex list-none flex-col border-t-2 border-charcoal p-0">
            {payment.map((p) => (
              <li key={p} className="border-b border-warm-200 py-[15px] text-[15px] leading-normal">
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <CtaBlock title="Want an exact price?" />
    </>
  );
}
