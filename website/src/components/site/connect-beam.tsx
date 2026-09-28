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
import { cn } from "@/lib/utils";

const Node = forwardRef<HTMLDivElement, { icon?: LucideIcon; label: string; className?: string; children?: React.ReactNode }>(
  function Node({ icon: Icon, label, className, children }, ref) {
    return (
      <div className="z-10 flex flex-col items-center gap-2 text-center">
        <div
          ref={ref}
          className={cn(
            "flex size-12 items-center justify-center rounded-full bg-white shadow-card sm:size-14",
            className
          )}
        >
          {Icon ? <Icon aria-hidden className="size-5 text-charcoal sm:size-6" strokeWidth={1.75} /> : children}
        </div>
        <span className="max-w-[92px] text-xs leading-tight text-body sm:max-w-none sm:text-[13px]">{label}</span>
      </div>
    );
  }
);

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      <span className="text-[11px] tracking-[0.18em] text-label uppercase">{title}</span>
      {children}
    </div>
  );
}

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
      <div
        ref={container}
        className="relative grid grid-cols-3 items-center gap-2 overflow-hidden rounded-2xl bg-offwhite px-3 py-10 shadow-panel sm:px-10 sm:py-12"
      >
        <Column title="Get found">
          <Node ref={google} icon={SearchIcon} label="Google search" />
          <Node ref={ai} icon={SparklesIcon} label="AI search" />
          <Node ref={mobile} icon={SmartphoneIcon} label="Customers on mobile" />
        </Column>

        <div className="z-10 flex flex-col items-center gap-3 text-center">
          <div
            ref={site}
            className="flex size-20 items-center justify-center rounded-3xl bg-charcoal shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)] sm:size-24"
          >
            <Image src="/logos/icon-mark-white.svg" alt="" width={48} height={48} className="size-10 sm:size-12" />
          </div>
          <span className="display text-[15px] tracking-[-0.01em] sm:text-lg">Your website</span>
        </div>

        <Column title="Work smarter, stay secure">
          <Node ref={software} icon={CalendarCheckIcon} label="Bookings & custom software" />
          <Node ref={cloud} icon={CloudIcon} label="Cloud & backups" />
          <Node ref={security} icon={ShieldCheckIcon} label="Security & Microsoft 365" />
        </Column>

        <AnimatedBeam {...beam} fromRef={google} toRef={site} curvature={-40} endYOffset={-10} />
        <AnimatedBeam {...beam} fromRef={ai} toRef={site} delay={0.4} />
        <AnimatedBeam {...beam} fromRef={mobile} toRef={site} curvature={40} endYOffset={10} delay={0.8} />
        <AnimatedBeam {...beam} fromRef={site} toRef={software} curvature={-40} startYOffset={-10} delay={1.2} />
        <AnimatedBeam {...beam} fromRef={site} toRef={cloud} delay={1.6} />
        <AnimatedBeam {...beam} fromRef={site} toRef={security} curvature={40} startYOffset={10} delay={2} />
      </div>
      <figcaption className="sr-only">
        Google search, AI search and customers on mobile lead to your website, which connects to bookings and custom
        software, cloud and backups, and security and Microsoft 365.
      </figcaption>
    </figure>
  );
}
