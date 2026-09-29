import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EdgeBeam } from "./motion";

type PlanCardProps = {
  name: string;
  price: string;
  prefix?: string;
  suffix?: string;
  desc?: string;
  features?: string[];
  popular?: boolean;
};

/** Package card from the design. The "popular" plan is inverted (charcoal). */
export function PlanCard({ name, price, prefix, suffix, desc, features, popular }: PlanCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-5 rounded-[14px] p-8",
        popular ? "bg-charcoal text-offwhite shadow-dark" : "bg-white text-charcoal shadow-card"
      )}
    >
      {popular && <EdgeBeam outside />}
      <div className="flex items-center justify-between gap-2.5">
        <h3 className="display m-0 text-[22px]">{name}</h3>
        {popular && (
          <span className="rounded-full bg-orange px-2.5 py-[5px] text-[11px] tracking-[0.14em] text-charcoal">MOST POPULAR</span>
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        {prefix && <span className={cn("text-sm", popular ? "text-on-dark" : "text-body")}>{prefix}</span>}
        <span className="display text-[44px] tracking-[-0.03em]">{price}</span>
        {suffix && <span className={cn("text-sm", popular ? "text-on-dark" : "text-body")}>{suffix}</span>}
      </div>
      {desc && <p className={cn("m-0 text-[15px] leading-[1.6]", popular ? "text-on-dark" : "text-body")}>{desc}</p>}
      {features && (
        <ul
          className={cn(
            "m-0 flex list-none flex-col gap-2.5 border-t p-0 pt-[18px]",
            popular ? "border-dark-border" : "border-warm-200"
          )}
        >
          {features.map((f) => (
            <li key={f} className="flex gap-2.5 text-[15px] leading-[1.45]">
              <CheckIcon aria-hidden strokeWidth={2.5} className="mt-0.5 size-4 shrink-0 text-orange" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Smaller price card used for SEO and Hosting & Care plans on the pricing page. */
export function PriceCard({ name, price, unit, desc, className }: { name: string; price: string; unit?: string; desc: string; className?: string }) {
  return (
    <div className={cn("flex h-full flex-col gap-3 rounded-xl bg-white p-[26px] shadow-card", className)}>
      <h3 className="m-0 text-[15px] font-semibold">{name}</h3>
      <div className="display text-[32px] tracking-[-0.03em]">
        {price}
        {unit && <span className="font-sans text-sm font-normal text-label"> {unit}</span>}
      </div>
      <p className="m-0 text-sm leading-[1.55] text-body">{desc}</p>
    </div>
  );
}
