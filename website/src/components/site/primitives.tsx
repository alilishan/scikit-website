import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Lucide arrow used on buttons and text links in place of a "→" character. */
export function Arrow({ className }: { className?: string }) {
  return <ArrowRightIcon aria-hidden strokeWidth={2} className={cn("size-4 shrink-0", className)} />;
}

export function Dot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full bg-orange", className)} />;
}

/** Headline that ends in the brand's orange full stop. */
export function Stop() {
  return <span className="text-orange">.</span>;
}

export function Eyebrow({ children, className, dot }: { children: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <div className={cn("eyebrow flex items-center gap-2.5", className)}>
      {dot && <Dot />}
      {children}
    </div>
  );
}

export function PageTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn("display m-0 text-[clamp(38px,4.6vw,62px)] leading-[1.02] tracking-[-0.04em] text-pretty", className)}>
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className, as: Tag = "h2" }: { children: React.ReactNode; className?: string; as?: "h2" | "h3" }) {
  return (
    <Tag className={cn("display m-0 text-[clamp(32px,3.4vw,46px)] leading-[1.04] tracking-[-0.035em]", className)}>
      {children}
    </Tag>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 border-b border-warm-400 pb-[3px] text-[15px] font-medium hover:text-orange">
      {children}
    </Link>
  );
}

export function Tick({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex size-[22px] shrink-0 items-center justify-center rounded-full bg-orange text-white", className)}
    >
      <CheckIcon strokeWidth={3} className="size-3" />
    </span>
  );
}
