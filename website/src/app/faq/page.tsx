import type { Metadata } from "next";
import { CtaBlock } from "@/components/site/cta-block";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { Eyebrow, PageTitle, Stop } from "@/components/site/primitives";
import { faqGroups } from "@/content/faqs";
import { Reveal } from "@/components/site/motion";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "FAQ | Web Design & SEO | Scikit",
  description:
    "Answers about website costs, timelines, SEO, hosting, ownership and working with Scikit, a web design and SEO agency in Melbourne.",
  path: "/faq",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) =>
    g.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <Reveal onLoad className="container-site flex flex-col gap-5 pt-20 pb-10">
        <Eyebrow>Frequently asked questions</Eyebrow>
        <PageTitle>
          Straight answers<Stop />
        </PageTitle>
      </Reveal>

      <section className="container-site flex flex-col gap-14 pt-6 pb-24">
        {faqGroups.map((g) => (
          <Reveal key={g.name} className="grid gap-x-12 gap-y-6 lg:grid-cols-3">
            <h2 className="display m-0 pt-5 text-[26px] tracking-[-0.025em]">{g.name}</h2>
            <FaqList items={g.items} className="min-w-0 lg:col-span-2" />
          </Reveal>
        ))}
      </section>

      <CtaBlock title="Still have a question?" />
    </>
  );
}
