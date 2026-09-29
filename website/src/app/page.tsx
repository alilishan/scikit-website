import { Fragment } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CtaBlock } from "@/components/site/cta-block";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { OpenChatButton } from "@/components/site/chat";
import { Arrow, Dot, Eyebrow, SectionTitle, Stop, TextLink, Tick } from "@/components/site/primitives";
import { auditItems, certifications, people, steps, ticks } from "@/content/home";
import { coreServices, moreServices } from "@/content/services";
import { homeFaqs } from "@/content/faqs";
import { Marquee } from "@/components/ui/marquee";
import { ConnectBeam } from "@/components/site/connect-beam";
import { HeroVisual } from "@/components/site/hero-visual";
import { ChartNoAxesColumnIncreasingIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import { WorkGrid } from "@/components/site/work-grid";
import { work } from "@/content/work";
import { EdgeBeam, Reveal, RevealLines } from "@/components/site/motion";
import { stagger } from "@/lib/stagger";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Scikit | Web Design & Software Development Melbourne",
  description:
    "Scikit builds fast, secure websites that rank on Google, plus custom software and cloud systems, for Australian small businesses. Melbourne-based, fixed prices.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <Hero />
      <TrustStrip />
      <Offer />
      <Services />
      <RecentWork />
      <Process />
      <WhyScikit />
      <HomeFaq />
      <CtaBlock title="Ready to get found on Google?" />
    </>
  );
}

const benefits = [
  { icon: ChartNoAxesColumnIncreasingIcon, title: "More visibility", body: "Get found on Google" },
  { icon: ZapIcon, title: "Better efficiency", body: "Tools that fit your workflow" },
  { icon: ShieldCheckIcon, title: "Long-term support", body: "Secure, reliable and scalable" },
];

function Hero() {
  return (
    <section className="container-site grid items-center gap-x-10 gap-y-14 pt-[72px] pb-[88px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
      <div className="flex flex-col gap-[26px]">
        <Reveal onLoad>
          <Eyebrow dot>Web design &amp; software development · Melbourne</Eyebrow>
        </Reveal>
        <h1 className="display m-0 text-[clamp(44px,5.6vw,76px)] leading-[0.98] tracking-[-0.04em]">
          <RevealLines
            delay={0.1}
            lines={[
              "Get Found.",
              "Work Smarter.",
              <Fragment key="stay-secure">
                Stay Secure<Stop />
              </Fragment>,
            ]}
          />
        </h1>
        <Reveal onLoad delay={0.5}>
          <p className="m-0 max-w-[520px] text-lg leading-[1.6] text-body">
            Scikit builds fast, secure websites that get found on Google, custom software that fits how you work, and the
            cloud systems that keep it all running, for Australian small businesses.
          </p>
        </Reveal>
        <Reveal onLoad delay={0.62} className="flex flex-wrap items-center gap-3.5">
          <Link href="/contact" className={buttonVariants({ variant: "brand", size: "xl" })}>
            Start a project <Arrow className="text-orange group-hover/button:text-white" />
          </Link>
          <a href="#offer" className={buttonVariants({ variant: "pill", size: "md" })}>
            See our offer
          </a>
        </Reveal>
        <Reveal onLoad delay={0.75}>
          <ul className="m-0 flex list-none flex-col gap-x-8 gap-y-4 p-0 pt-3 sm:flex-row sm:flex-wrap">
            {benefits.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <b.icon aria-hidden className="mt-0.5 size-6 shrink-0 text-charcoal" strokeWidth={1.75} />
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold whitespace-nowrap">{b.title}</span>
                  <span className="text-[13px] whitespace-nowrap text-body">{b.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <HeroVisual />
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-warm-100 bg-offwhite">
      <div className="container-site flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center sm:gap-x-10">
        <span className="shrink-0 text-xs tracking-[0.18em] text-label">BUILT BY ENGINEERS CERTIFIED IN</span>
        <p className="sr-only">{certifications.join(", ")}</p>
        <Marquee
          pauseOnHover
          repeat={3}
          aria-hidden
          className="w-full min-w-0 sm:w-auto sm:flex-1 [--duration:28s] [--gap:2rem] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
        >
          {certifications.map((c) => (
            <span key={c} className="flex items-center gap-8 text-[15px] font-medium whitespace-nowrap text-ink-soft">
              {c}
              <Dot className="size-1.5 opacity-60" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section id="offer" className="container-site scroll-mt-24 pt-24 pb-12">
      <Reveal className="auto-grid relative gap-12 overflow-hidden rounded-[14px] bg-charcoal p-[clamp(32px,5vw,64px)] text-offwhite shadow-dark [--min:320px]">
        <EdgeBeam dark />
        <div
          aria-hidden
          className="absolute -right-[120px] -bottom-[160px] size-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,106,46,0.35),rgba(255,106,46,0)_70%)]"
        />
        <div className="relative flex flex-col gap-[22px]">
          <div className="text-xs tracking-[0.2em] text-orange">FREE · NO OBLIGATION</div>
          <h2 className="display m-0 text-[clamp(34px,3.8vw,52px)] leading-[1.02] tracking-[-0.035em]">
            Free Website &amp; SEO Audit
          </h2>
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.6] text-on-dark">
            Send us your website and we&apos;ll show you exactly why it isn&apos;t bringing in more work. You get a short
            video walkthrough and a one-page report within 3 business days.
          </p>
          <div className="flex">
            <Link href="/contact" className={buttonVariants({ variant: "accent", size: "xl" })}>
              Get my free audit <Arrow />
            </Link>
          </div>
        </div>
        <ol className="relative m-0 flex list-none flex-col p-0">
          {auditItems.map((text, i) => (
            <li key={text} className="border-b border-dark-border">
              <Reveal delay={stagger(i, 0.08, 0.2)} offset={8} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 py-[18px] text-base leading-normal">
                <span className="pt-[3px] text-xs text-orange">0{i + 1}</span>
                <span>{text}</span>
              </Reveal>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

function Services() {
  return (
    <section className="container-site flex flex-col gap-11 pt-[72px] pb-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3.5">
          <Eyebrow>Services</Eyebrow>
          <SectionTitle>One team, from website to cloud.</SectionTitle>
        </div>
        <TextLink href="/services">All services <Arrow /></TextLink>
      </Reveal>
      {/* offset 0: fade only. A moving entrance would make the beams measure mid-animation and end up misaligned. */}
      <Reveal delay={0.1} offset={0}>
        <ConnectBeam />
      </Reveal>
      <div className="auto-grid gap-px overflow-hidden rounded-xl bg-warm-200 shadow-panel [--min:260px]">
        {coreServices.map((s, i) => (
          <Reveal key={s.slug} delay={stagger(i)} className="bg-white">
          <Link
            href={`/services/${s.slug}`}
            className="flex h-full min-h-[260px] flex-col gap-11 bg-white px-7 py-8 text-charcoal transition-colors hover:bg-offwhite"
          >
            <div className="flex justify-between text-xs tracking-[0.16em] text-tertiary">
              <span>{s.num}</span>
              <Dot />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <h3 className="display m-0 text-2xl tracking-[-0.025em]">{s.title}</h3>
              <p className="m-0 text-[15px] leading-[1.55] text-body">{s.body}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium">Learn more <Arrow /></span>
          </Link>
          </Reveal>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2.5 text-[15px] text-body">
        <span className="font-semibold text-charcoal">Also from the same team:</span>
        {moreServices.map((s, i) => (
          <span key={s.slug} className="flex items-center gap-[18px]">
            {i > 0 && <span className="text-warm-400">·</span>}
            <Link href={`/services/${s.slug}`} className="relative after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] hover:text-orange">
              {s.label ?? s.title}
            </Link>
          </span>
        ))}
      </div>
    </section>
  );
}

function RecentWork() {
  return (
    <section id="work" className="container-site flex scroll-mt-24 flex-col gap-11 pb-24">
      <Reveal className="flex flex-col gap-3.5">
        <Eyebrow>Recent work</Eyebrow>
        <SectionTitle>
          Things we&apos;ve built<Stop />
        </SectionTitle>
        <p className="m-0 max-w-[620px] text-[17px] leading-[1.6] text-body">
          Products and sites designed, built and run by the Scikit team, from the first sketch to the servers they run on.
        </p>
      </Reveal>
      <WorkGrid items={work} />
    </section>
  );
}

function Process() {
  return (
    <section className="border-y border-warm-100 bg-offwhite">
      <div className="container-site flex flex-col gap-12 py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>Process</Eyebrow>
            <SectionTitle>How We Work</SectionTitle>
          </div>
          <TextLink href="/process">See full process <Arrow /></TextLink>
        </Reveal>
        <ol className="auto-grid m-0 list-none gap-7 p-0 [--min:230px]">
          {steps.map((st, i) => (
            <li key={st.num}>
              <Reveal delay={stagger(i, 0.12)} className="flex flex-col gap-3.5 border-t-2 border-charcoal pt-[22px]">
                <span className="display text-[15px] text-orange">{st.num}</span>
                <h3 className="display m-0 text-[22px] tracking-[-0.02em]">{st.title}</h3>
                <p className="m-0 text-[15px] leading-[1.55] text-body">{st.short}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhyScikit() {
  return (
    <section className="container-site auto-grid items-start gap-14 py-24 [--min:340px]">
      <Reveal className="flex flex-col gap-[22px]">
        <Eyebrow>Why Scikit</Eyebrow>
        <SectionTitle>
          Why Scikit? Built by engineers<Stop />
        </SectionTitle>
        <p className="m-0 text-[17px] leading-[1.65] text-body">
          Most small business websites and systems are put together from templates and handed over. Ours are designed and
          built by senior engineers who&apos;ve designed systems for AWS and some of Victoria&apos;s largest organisations.
          That&apos;s why they&apos;re fast and secure, and they keep ranking.
        </p>
        <ul className="auto-grid m-0 list-none gap-x-6 gap-y-2.5 p-0 pt-2 [--min:220px]">
          {ticks.map((t) => (
            <li key={t} className="flex items-center gap-3 text-[15px] font-medium">
              <Tick />
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
      <div className="flex flex-col gap-[18px]">
        {people.map((p, i) => (
          <Reveal
            key={p.name}
            delay={stagger(i, 0.12, 0.1)}
            className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-5 rounded-xl bg-white p-5 shadow-card sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-[22px] sm:p-6"
          >
            <Image
              src={p.photo}
              alt={`${p.name}, co-founder of Scikit`}
              width={208}
              height={208}
              sizes="104px"
              className="aspect-square w-full rounded-[10px] object-cover"
            />
            <div className="flex flex-col gap-1.5">
              <div className="text-xs tracking-[0.16em] text-orange uppercase">{p.area}</div>
              <h3 className="display m-0 text-[21px] tracking-[-0.02em]">{p.name}</h3>
              <p className="m-0 text-sm leading-[1.55] text-body">{p.bio}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function HomeFaq() {
  return (
    <section className="mb-24 border-t border-warm-100 bg-offwhite">
      <div className="container-site auto-grid items-start gap-14 py-24 [--min:320px]">
        <Reveal className="flex flex-col gap-[18px] md:sticky md:top-[120px]">
          <Eyebrow>FAQ</Eyebrow>
          <SectionTitle>Questions, answered.</SectionTitle>
          <div className="flex flex-wrap gap-3 pt-1.5">
            <OpenChatButton className={buttonVariants({ variant: "brand", size: "md", className: "px-[22px] py-3.5" })}>
              Chat with us
            </OpenChatButton>
            <Link href="/faq" className={buttonVariants({ variant: "pill", size: "md", className: "px-5 py-[13px]" })}>
              All FAQs
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <FaqList items={homeFaqs} />
        </Reveal>
      </div>
    </section>
  );
}
