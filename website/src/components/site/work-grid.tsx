import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";
import { Reveal } from "@/components/site/motion";
import { stagger } from "@/lib/stagger";
import type { Work } from "@/content/work";

/** Screenshot inside a minimal browser frame, so it reads as a live website. */
function BrowserFrame({ src, alt, domain }: { src: string; alt: string; domain: string }) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-card ring-1 ring-black/5">
      <div className="flex items-center gap-3 border-b border-warm-100 bg-offwhite px-3 py-2">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-warm-300" />
          <span className="size-2 rounded-full bg-warm-300" />
          <span className="size-2 rounded-full bg-warm-300" />
        </div>
        <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-0.5 text-center text-[11px] text-label">
          {domain}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-offwhite">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1240px) 380px, (min-width: 768px) 45vw, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    </div>
  );
}

export function WorkGrid({ items }: { items: Work[] }) {
  return (
    <div className="auto-grid gap-6 [--min:300px]">
      {items.map((w, i) => (
        <Reveal key={w.name} delay={stagger(i, 0.1)}>
          <a
            href={w.url}
            target="_blank"
            rel="noopener"
            className="group flex h-full flex-col gap-5 rounded-2xl bg-white p-4 pb-6 shadow-card transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <BrowserFrame src={w.image} alt={`${w.name} website`} domain={w.domain} />
            <div className="flex flex-1 flex-col gap-3 px-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="display m-0 text-[22px] tracking-[-0.02em]">{w.name}</h3>
                  <span className="text-[13px] text-label">
                    {w.type} · {w.sector}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-offwhite transition-colors group-hover:bg-orange group-hover:text-white"
                >
                  <ArrowUpRightIcon className="size-4" />
                </span>
              </div>
              <p className="m-0 flex-1 text-[15px] leading-[1.6] text-body">{w.brief}</p>
              <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                {w.built.map((b) => (
                  <li key={b} className="rounded-full bg-offwhite px-2.5 py-1 text-xs text-ink-soft">
                    {b}
                  </li>
                ))}
              </ul>
              <span className="sr-only">Opens {w.domain} in a new tab</span>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
