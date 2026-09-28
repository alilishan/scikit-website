import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CtaBlock } from "@/components/site/cta-block";
import { Arrow, Dot, Eyebrow, PageTitle, Stop } from "@/components/site/primitives";
import { coreServices, moreServices } from "@/content/services";
import { Reveal } from "@/components/site/motion";
import { stagger } from "@/lib/stagger";

export const metadata: Metadata = {
  title: "Services | Web Design, SEO & More | Scikit",
  description:
    "Web design, SEO and hosting for Australian small businesses, plus custom software, apps, Microsoft 365, cyber security and AI from the same senior team.",
  alternates: { canonical: "/services" },
};

const groupLabel = "text-[13px] font-semibold tracking-[0.14em] text-charcoal uppercase";

export default function ServicesPage() {
  return (
    <>
      <Reveal onLoad className="container-site flex flex-col gap-[22px] pt-20 pb-12">
        <Eyebrow>Services</Eyebrow>
        <PageTitle className="max-w-[900px]">
          Websites that get found, software that fits how you work, and the cloud systems that keep it running<Stop />
        </PageTitle>
        <p className="m-0 text-lg text-body">Designed, built, deployed and maintained by one team.</p>
      </Reveal>

      <section className="container-site flex flex-col gap-[22px] pt-6 pb-10">
        <h2 className={groupLabel}>Core services</h2>
        <div className="auto-grid gap-5 [--min:260px]">
          {coreServices.map((s, i) => (
            <Reveal key={s.slug} delay={stagger(i)}>
            <Link
              href={`/services/${s.slug}`}
              className="flex h-full min-h-[240px] flex-col gap-10 rounded-xl bg-charcoal px-7 py-[30px] text-offwhite shadow-dark transition-[background-color,translate] duration-200 hover:-translate-y-0.5 hover:bg-[#1F1F1F]"
            >
              <Dot className="size-2.5" />
              <div className="flex flex-1 flex-col gap-2.5">
                <h3 className="display m-0 text-2xl tracking-[-0.025em]">{s.title}</h3>
                <p className="m-0 text-[15px] leading-[1.55] text-on-dark">{s.short}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange">Learn more <Arrow /></span>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site flex flex-col gap-[22px] pt-6 pb-24">
        <h2 className={groupLabel}>Also from the same team</h2>
        <div className="auto-grid gap-5 [--min:260px]">
          {moreServices.map((s, i) => (
            <Reveal key={s.slug} delay={stagger(i)}>
            <Link
              href={`/services/${s.slug}`}
              className="flex h-full min-h-[170px] flex-col gap-2.5 rounded-xl bg-white p-7 shadow-card transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <h3 className="display m-0 text-[21px] tracking-[-0.02em]">{s.title}</h3>
              <p className="m-0 flex-1 text-[15px] leading-[1.55] text-body">{s.short}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium">Learn more <Arrow /></span>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site pb-24">
        <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-[14px] bg-offwhite p-11 shadow-panel">
          <h2 className="display m-0 text-[30px] tracking-[-0.03em]">Not sure what you need?</h2>
          <Link href="/contact" className={buttonVariants({ variant: "brand", size: "md" })}>
            Get a free audit <Arrow />
          </Link>
        </Reveal>
      </section>

      <CtaBlock title="Ready to get found on Google?" />
    </>
  );
}
