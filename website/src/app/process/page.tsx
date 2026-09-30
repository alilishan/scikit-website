import type { Metadata } from "next";
import { CtaBlock } from "@/components/site/cta-block";
import { Eyebrow, PageTitle, Stop } from "@/components/site/primitives";
import { promises, steps } from "@/content/home";
import { Reveal } from "@/components/site/motion";
import { stagger } from "@/lib/stagger";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Our Process | Web Design & SEO | Scikit",
  description:
    "How Scikit builds websites and runs SEO for Australian businesses. Audit, plan, build, launch and grow, with fixed prices and weekly updates.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <Reveal onLoad className="container-site flex flex-col gap-5 pt-20 pb-12">
        <Eyebrow>Our process</Eyebrow>
        <PageTitle className="max-w-[900px]">
          Four steps from first chat to a website that brings in work<Stop />
        </PageTitle>
        <p className="m-0 text-lg text-body">Fixed prices, weekly updates, no surprises.</p>
      </Reveal>

      <ol className="container-site m-0 flex list-none flex-col pt-6 pb-20">
        {steps.map((st) => (
          <li key={st.num} className="border-t border-warm-200">
            <Reveal className="auto-grid gap-x-12 gap-y-5 py-10 [--min:280px]">
            <h2 className="m-0 flex items-baseline gap-5">
              <span className="display text-[44px] tracking-[-0.03em] text-orange-ink">{st.num}</span>
              <span className="display text-[30px] tracking-[-0.03em]">{st.title}</span>
            </h2>
            <div className="flex flex-col gap-3.5">
              <p className="m-0 text-base leading-[1.65] text-body">{st.long}</p>
              <div className="rounded-lg bg-offwhite px-4 py-3.5 text-[15px]">
                <span className="font-semibold">You get:</span> {st.get}
              </div>
            </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <section className="mb-24 bg-charcoal text-offwhite">
        <div className="container-site flex flex-col gap-9 py-20">
          <h2 className="display m-0 text-[clamp(30px,3.2vw,44px)] tracking-[-0.035em]">Our promises</h2>
          <div className="auto-grid gap-7 [--min:240px]">
            {promises.map((p, i) => (
              <Reveal key={p.t} delay={stagger(i, 0.1)} className="flex flex-col gap-2.5 border-t-2 border-orange pt-[18px]">
                <h3 className="display m-0 text-xl">{p.t}</h3>
                <p className="m-0 text-[15px] leading-[1.55] text-on-dark">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock title="Start with step 01." button="Get my free audit" />
    </>
  );
}
