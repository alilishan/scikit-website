"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { Faq } from "@/content/faqs";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion from the design: independent items, orange +/− icon.
 * Answers stay in the HTML (hidden="until-found") so search engines and Ctrl+F can read them.
 */
export function FaqList({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <AccordionPrimitive.Root multiple hiddenUntilFound className={cn("flex flex-col border-t border-warm-300", className)}>
      {items.map((f) => (
        <AccordionPrimitive.Item key={f.q} className="border-b border-warm-300">
          <AccordionPrimitive.Header className="m-0">
            <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-5 bg-transparent py-[22px] text-left text-[17px] font-semibold text-charcoal">
              {f.q}
              <PlusIcon aria-hidden className="size-5 shrink-0 text-orange group-aria-expanded:hidden" />
              <MinusIcon aria-hidden className="hidden size-5 shrink-0 text-orange group-aria-expanded:block" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Panel className="pr-10 pb-6 text-[15px] leading-[1.65] text-body">
            <p className="m-0">{f.a}</p>
          </AccordionPrimitive.Panel>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
