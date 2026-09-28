"use client";

import { forwardRef, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import {
  CalendarCheckIcon,
  CloudIcon,
  SearchIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

// Labels are absolutely positioned under each icon, so every icon's centre is the true centre of its slot.
// That keeps the three rows level with each other and lets the beams meet each icon exactly.
const Node = forwardRef<HTMLDivElement, { icon: LucideIcon; label: string }>(function Node({ icon: Icon, label }, ref) {
  return (
    <div className="relative z-10 flex justify-center">
      <div ref={ref} className="flex size-12 items-center justify-center rounded-full bg-white shadow-card sm:size-14">
        <Icon aria-hidden className="size-5 text-charcoal sm:size-6" strokeWidth={1.75} />
      </div>
      <span className="absolute top-full left-1/2 mt-2 w-[104px] -translate-x-1/2 text-center text-xs leading-tight text-body sm:w-[200px] sm:text-[13px]">
        {label}
      </span>
    </div>
  );
});

const columnTitle = "text-center text-[11px] leading-snug tracking-[0.1em] text-label uppercase sm:tracking-[0.18em]";
const nodeColumn = "flex flex-col items-center gap-16 sm:gap-[72px]";

/**
 * "How it connects" diagram: search sends people to your website, and your website
 * feeds the software and cloud that run your business. Beams animate along each link.
 */
export function ConnectBeam() {
  const reduce = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const google = useRef<HTMLDivElement>(null);
  const ai = useRef<HTMLDivElement>(null);
  const mobile = useRef<HTMLDivElement>(null);
  const site = useRef<HTMLDivElement>(null);
  const software = useRef<HTMLDivElement>(null);
  const cloud = useRef<HTMLDivElement>(null);
  const security = useRef<HTMLDivElement>(null);

  const beam = {
    containerRef: container,
    pathColor: "#D0CDC7",
    pathOpacity: 0.6,
    pathWidth: 1.5,
    gradientStartColor: "#FF6A2E",
    gradientStopColor: "#FFB08F",
    duration: 4,
    // With reduced motion, draw the static lines only.
    repeat: reduce ? 0 : Infinity,
  };

  return (
    <figure className="m-0">
      <div ref={container} className="relative overflow-hidden rounded-2xl bg-offwhite px-3 pt-9 pb-14 shadow-panel sm:px-10 sm:pt-11 sm:pb-16">
        <div className="mb-7 grid grid-cols-3 gap-2 sm:mb-9">
          <span className={columnTitle}>Get found</span>
          <span aria-hidden />
          <span className={columnTitle}>Work smarter, stay secure</span>
        </div>

        <div className="grid grid-cols-3 items-center gap-2">
          <div className={nodeColumn}>
            <Node ref={google} icon={SearchIcon} label="Google search" />
            <Node ref={ai} icon={SparklesIcon} label="AI search" />
            <Node ref={mobile} icon={SmartphoneIcon} label="Customers on mobile" />
          </div>

          <div className="relative z-10 flex justify-center">
            <div
              ref={site}
              className="flex size-20 items-center justify-center rounded-3xl bg-charcoal shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)] sm:size-24"
            >
              <Image src="/logos/icon-mark-white.svg" alt="" width={48} height={48} className="size-10 sm:size-12" />
            </div>
            <span className="display absolute top-full left-1/2 mt-3 -translate-x-1/2 text-[15px] tracking-[-0.01em] whitespace-nowrap sm:text-lg">
              Your website
            </span>
          </div>

          <div className={nodeColumn}>
            <Node ref={software} icon={CalendarCheckIcon} label="Bookings & custom software" />
            <Node ref={cloud} icon={CloudIcon} label="Cloud & backups" />
            <Node ref={security} icon={ShieldCheckIcon} label="Security & Microsoft 365" />
          </div>
        </div>

        {/* Straight lines, centre to centre. The icons sit above the lines, so each line meets its icon cleanly. */}
        <AnimatedBeam {...beam} fromRef={google} toRef={site} />
        <AnimatedBeam {...beam} fromRef={ai} toRef={site} delay={0.4} />
        <AnimatedBeam {...beam} fromRef={mobile} toRef={site} delay={0.8} />
        <AnimatedBeam {...beam} fromRef={site} toRef={software} delay={1.2} />
        <AnimatedBeam {...beam} fromRef={site} toRef={cloud} delay={1.6} />
        <AnimatedBeam {...beam} fromRef={site} toRef={security} delay={2} />
      </div>
      <figcaption className="sr-only">
        Google search, AI search and customers on mobile lead to your website, which connects to bookings and custom
        software, cloud and backups, and security and Microsoft 365.
      </figcaption>
    </figure>
  );
}
