"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";

/** Respects the visitor's "reduce motion" setting for every motion animation on the site. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Entrance animation: fades, un-blurs and lifts content into place.
 * By default it plays when the element scrolls into view; set `onLoad` for above-the-fold content.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  onLoad = false,
  offset = 14,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onLoad?: boolean;
  offset?: number;
}) {
  return (
    <BlurFade
      className={className}
      delay={delay}
      inView={!onLoad}
      inViewMargin="-60px"
      direction="up"
      offset={offset}
      duration={0.55}
      blur="6px"
    >
      {children}
    </BlurFade>
  );
}

/**
 * Brand-coloured light running around a card's border. Hidden when reduced motion is on.
 * `outside` draws it just beyond the card's edge (so it shows against the page on dark cards);
 * the card must be `relative` and must not clip overflow.
 */
export function EdgeBeam({ dark = false, outside = false }: { dark?: boolean; outside?: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const colorTo = outside ? "#FFB08F" : dark ? "#F8F7F4" : "#FFB08F";
  const beams = (
    <>
      <BorderBeam size={outside ? 140 : 120} duration={9} borderWidth={outside ? 2 : 1.5} colorFrom="#FF6A2E" colorTo={colorTo} />
      <BorderBeam size={outside ? 140 : 120} duration={9} delay={4.5} borderWidth={outside ? 2 : 1.5} colorFrom="#FF6A2E" colorTo={colorTo} />
    </>
  );
  if (!outside) return beams;
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-[5px] rounded-[19px]">
      {beams}
    </div>
  );
}

/** Staggered on-load reveal for headline lines. Renders spans, so it's valid inside an <h1>. */
export function RevealLines({ lines, delay = 0, step = 0.12 }: { lines: React.ReactNode[]; delay?: number; step?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="block"
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: delay + i * step, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {line}
        </motion.span>
      ))}
    </>
  );
}
