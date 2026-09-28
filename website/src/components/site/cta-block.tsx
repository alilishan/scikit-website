import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { emailHref, site } from "@/lib/site";
import { Arrow } from "./primitives";
import { Reveal } from "./motion";

export function CtaBlock({ title, button = "Start a project" }: { title: string; button?: string }) {
  return (
    <section className="container-site pb-24">
      <Reveal className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-2xl bg-charcoal p-[clamp(36px,5vw,64px)] text-offwhite shadow-dark">
        <div
          aria-hidden
          className="absolute -top-[140px] -left-[100px] size-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,106,46,0.3),rgba(255,106,46,0)_70%)]"
        />
        <div className="relative flex max-w-[620px] flex-col gap-3.5">
          <h2 className="display m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.04] tracking-[-0.035em]">{title}</h2>
          <p className="m-0 text-[17px] leading-[1.55] text-on-dark">
            Tell us about your business. We&apos;ll send a fixed-price quote within 2 business days.
          </p>
        </div>
        <div className="relative flex flex-col items-start gap-3">
          <Link href="/contact" className={buttonVariants({ variant: "accent", size: "xl" })}>
            {button} <Arrow />
          </Link>
          {site.email && (
            <span className="text-sm text-tertiary">
              or email{" "}
              <a href={emailHref} className="text-on-dark underline-offset-2 hover:text-orange hover:underline">
                {site.email}
              </a>
            </span>
          )}
        </div>
      </Reveal>
    </section>
  );
}
