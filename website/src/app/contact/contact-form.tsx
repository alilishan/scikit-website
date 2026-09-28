"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { sendEnquiry, type EnquiryState } from "./actions";

const needs = ["New website", "Website redesign", "SEO", "Hosting & care", "Free audit", "Something else"];
const budgets = ["Under $5k", "$5k–$10k", "$10k–$20k", "$20k+", "Not sure"];

const field = "flex flex-col gap-[7px] text-[13px] font-medium";
const input =
  "rounded-lg border border-warm-300 bg-white px-3.5 py-[13px] text-[15px] font-normal outline-orange focus-visible:outline-2";
const chip =
  "inline-block cursor-pointer rounded-full border border-warm-300 bg-white px-[15px] py-[9px] text-sm peer-checked:border-charcoal peer-checked:bg-charcoal peer-checked:text-offwhite peer-focus-visible:outline-2 peer-focus-visible:outline-orange";

export function ContactForm() {
  // Changing the key remounts the form, which resets it after "Send another enquiry".
  const [formKey, setFormKey] = useState(0);
  return <EnquiryForm key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function EnquiryForm({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(sendEnquiry, { status: "idle" });
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className="flex flex-col items-start gap-4 py-10 outline-none" role="status">
        <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-orange text-white">
          <CheckIcon strokeWidth={3} className="size-6" />
        </span>
        <h2 className="display m-0 text-[30px] tracking-[-0.03em]">Thanks! We&apos;ve got it.</h2>
        <p className="m-0 text-base leading-[1.6] text-body">Ali or Hassan will be in touch within one business day.</p>
        <button type="button" onClick={onReset} className="cursor-pointer p-0 text-sm text-label underline">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="auto-grid gap-4 [--min:200px]">
        <label className={field}>
          Name *
          <input name="name" required autoComplete="name" className={input} />
        </label>
        <label className={field}>
          Business name
          <input name="business" autoComplete="organization" className={input} />
        </label>
        <label className={field}>
          Email *
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className={field}>
          Phone
          <input name="phone" type="tel" autoComplete="tel" className={input} />
        </label>
      </div>
      <label className={field}>
        Current website (if you have one)
        <input name="website" placeholder="yourbusiness.com.au" className={input} />
      </label>

      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-[13px] font-medium">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {needs.map((n) => (
            <label key={n}>
              <input type="checkbox" name="needs" value={n} className="peer sr-only" />
              <span className={chip}>{n}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-[13px] font-medium">Budget</legend>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <label key={b}>
              <input type="radio" name="budget" value={b} className="peer sr-only" />
              <span className={chip}>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className={field}>
        Tell us about your business *
        <textarea name="about" required rows={5} className={`${input} resize-y`} />
      </label>

      {/* Honeypot for spam bots. Hidden from people and screen readers. */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <p className="m-0 text-[13px] text-label">
        We&apos;ll only use your details to reply to your enquiry. See our{" "}
        <Link href="/privacy" className="underline">
          privacy policy
        </Link>
        .
      </p>

      {state.status === "error" && (
        <p role="alert" className="m-0 rounded-lg border border-orange/40 bg-white px-3.5 py-3 text-sm">
          {state.message}
        </p>
      )}

      <div className="flex">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-charcoal px-[30px] py-4 text-[15px] font-medium text-offwhite shadow-button hover:bg-orange hover:shadow-button-accent disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sending…" : <>Send <ArrowRightIcon aria-hidden className="size-4" /></>}
        </button>
      </div>
    </form>
  );
}
