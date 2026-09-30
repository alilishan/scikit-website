import type { Metadata } from "next";
import { Eyebrow, Stop } from "@/components/site/primitives";
import { addressLine, emailHref, phoneHref, site, whatsappHref } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { Reveal } from "@/components/site/motion";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Start a Project | Scikit, Melbourne & Australia-wide",
  description:
    "Start a website or SEO project with Scikit, or get a free website & SEO audit. Melbourne-based, working Australia-wide. We reply within one business day.",
  path: "/contact",
});

// Rows without a value (e.g. no phone set yet) are left out.
const rows = [
  { k: "Email", v: site.email, href: emailHref },
  { k: "Phone", v: site.phone, href: phoneHref },
  { k: "WhatsApp", v: site.whatsapp ? "Message us on WhatsApp" : "", href: whatsappHref },
  { k: "Office", v: addressLine },
  { k: "Hours", v: site.hours },
].filter((r) => r.v);

export default function ContactPage() {
  return (
    <section className="container-site auto-grid items-start gap-14 pt-20 pb-24 [--min:340px]">
      <Reveal onLoad className="flex flex-col gap-[22px]">
        <Eyebrow>Start a project</Eyebrow>
        <h1 className="display m-0 text-[clamp(38px,4.4vw,58px)] leading-[1.02] tracking-[-0.04em] text-pretty">
          Tell us about your business<Stop />
        </h1>
        <p className="m-0 text-[17px] leading-[1.6] text-body">
          We&apos;ll reply within one business day with next steps, or a fixed-price quote within 2 business days.
        </p>
        <div className="mt-3 flex flex-col border-t border-warm-200">
          <h2 className="m-0 pt-[18px] pb-1.5 text-[13px] font-semibold tracking-[0.12em] uppercase">Or reach us directly</h2>
          <dl className="m-0">
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 border-b border-warm-100 py-3 text-[15px]">
                <dt className="text-label">{r.k}</dt>
                <dd className="m-0">
                  {r.href ? (
                    <a href={r.href} className="hover:text-orange">
                      {r.v}
                    </a>
                  ) : (
                    r.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
      <Reveal onLoad delay={0.15} className="rounded-2xl bg-offwhite p-[clamp(24px,3vw,40px)] shadow-panel">
        <ContactForm />
      </Reveal>
    </section>
  );
}
