"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CodeXmlIcon, DatabaseIcon, PencilIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Home hero visual (branding/hero.png): the laptop with three "exploded" layers floating above it —
 * Design (the site), Develop (the code) and Deploy (hosting & monitoring) — each with a callout.
 * Everything is sized in container-query units (cqw), so the composition scales as one piece.
 */

// Shared tilt so every layer sits on the same plane as the laptop screen.
const TILT = "perspective(2400px) rotateX(42deg) rotateZ(-8deg) skewX(6deg)";

function FloatingLayer({
  children,
  className,
  delay,
  floatDelay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  floatDelay: number;
}) {
  return (
    <motion.div
      className={cn("absolute", className)}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ delay: delay + 0.8 + floatDelay, duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{ transform: TILT, transformStyle: "preserve-3d" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Callout({
  icon: Icon,
  title,
  lines,
  className,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  lines: string[];
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={cn("absolute z-30 flex items-start gap-[1.4cqw]", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <span className="flex size-[6.6cqw] shrink-0 items-center justify-center rounded-[1.6cqw] bg-white shadow-card">
        <Icon aria-hidden className="size-[3cqw] text-charcoal" strokeWidth={1.75} />
      </span>
      <span className="flex flex-col gap-[0.4cqw] pt-[0.3cqw]">
        <span className="text-[max(10px,2.1cqw)] font-semibold tracking-[0.04em] text-charcoal uppercase">{title}</span>
        {lines.map((l) => (
          // Sub-lines only when the visual is wide enough to read them.
          <span key={l} className="hidden text-[1.75cqw] leading-tight whitespace-nowrap text-body @min-[520px]:block">
            {l}
          </span>
        ))}
      </span>
    </motion.div>
  );
}

/** Design layer: a mini version of a client website. */
function DesignLayer() {
  return (
    <div className="grid aspect-[16/8.4] w-full grid-cols-[1fr_1fr] gap-[3%] overflow-hidden rounded-[1.6cqw] bg-offwhite p-[4%] shadow-[0_30px_60px_-25px_rgba(38,30,20,0.45)] ring-1 ring-black/5">
      <div className="flex flex-col">
        <Image src="/logos/scikit-wordmark.svg" alt="" width={72} height={30} className="h-auto w-[34%]" />
        <div className="display mt-[16%] text-[3.4cqw] leading-[0.98] tracking-[-0.04em] text-charcoal">
          Ideas into digital products<span className="text-orange">.</span>
        </div>
        <div className="mt-[6%] h-[0.5cqw] w-[70%] rounded-full bg-warm-200" />
        <div className="mt-[3%] h-[0.5cqw] w-[52%] rounded-full bg-warm-200" />
        <span className="mt-auto inline-flex w-fit items-center rounded-full bg-orange px-[1.8cqw] py-[0.7cqw] text-[1.3cqw] font-medium text-white shadow-button-accent">
          Let&apos;s talk →
        </span>
      </div>
      <div className="flex flex-col gap-[6%]">
        <div className="flex justify-end gap-[1.2cqw] text-[1.05cqw] text-body">
          <span>Work</span>
          <span>Services</span>
          <span>About</span>
          <span className="rounded-full bg-charcoal px-[0.9cqw] text-offwhite">Contact</span>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-[1cqw]">
          <Image src="/hero/building.webp" alt="" fill sizes="240px" className="object-cover" priority />
        </div>
      </div>
    </div>
  );
}

/** Develop layer: the code behind it. */
function CodeLayer() {
  return (
    <div className="grid aspect-[16/6] w-full grid-cols-[30%_1fr] overflow-hidden rounded-[1.6cqw] bg-[#161616] font-mono text-[1.25cqw] leading-[1.7] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      <div className="flex flex-col border-r border-white/10 px-[9%] py-[8%] text-[#8A8A8A]">
        {["src", "components", "pages", "styles", "public", "package.json"].map((f, i) => (
          <span key={f} className={cn("truncate", i === 0 && "text-[#C9C7C2]", i > 0 && i < 4 && "pl-[12%]")}>
            {i < 5 ? "▸ " : "  "}
            {f}
          </span>
        ))}
      </div>
      <div className="px-[6%] py-[5%] whitespace-pre text-[#C9C7C2]">
        <span className="text-[#C792EA]">export default function</span> <span className="text-[#82AAFF]">Home</span>() {"{"}
        {"\n  "}
        <span className="text-[#C792EA]">return</span> (
        {"\n    "}&lt;<span className="text-[#FF6A2E]">main</span> <span className="text-[#FFCB6B]">className</span>=
        <span className="text-[#C3E88D]">&quot;hero&quot;</span>&gt;
        {"\n      "}&lt;<span className="text-[#FF6A2E]">h1</span>&gt;Ideas into digital products.&lt;/<span className="text-[#FF6A2E]">h1</span>&gt;
        {"\n      "}&lt;<span className="text-[#FF6A2E]">p</span>&gt;Web design, development and more.&lt;/<span className="text-[#FF6A2E]">p</span>&gt;
        {"\n    "}&lt;/<span className="text-[#FF6A2E]">main</span>&gt;
        {"\n  "});{"\n"}
        {"}"}
      </div>
    </div>
  );
}

/** Deploy layer: hosting and monitoring dashboard. */
function DeployLayer() {
  const card = "flex flex-col justify-between rounded-[1.2cqw] bg-white p-[1.6cqw] shadow-card ring-1 ring-black/5";
  const label = "text-[1.25cqw] font-medium text-body";
  const stat = "display text-[2.6cqw] tracking-[-0.03em] text-charcoal";
  return (
    <div className="grid aspect-[16/4.6] w-full grid-cols-3 gap-[2.5%] rounded-[1.6cqw] bg-offwhite/95 p-[2.5%] shadow-[0_30px_60px_-25px_rgba(38,30,20,0.45)] ring-1 ring-black/5 backdrop-blur">
      <div className={card}>
        <span className={label}>Performance</span>
        <div className="flex items-end justify-between">
          <span className="relative flex size-[5.2cqw] items-center justify-center rounded-full border-[0.45cqw] border-[#22C55E] text-[1.7cqw] font-semibold text-[#15803D]">
            99
          </span>
          <svg viewBox="0 0 60 24" className="h-[3cqw] w-[45%]" aria-hidden>
            <polyline points="0,20 12,16 22,18 32,10 42,12 52,4 60,6" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className={card}>
        <span className={label}>Visitors</span>
        <div className="flex items-end justify-between">
          <span className={stat}>
            <span className="text-[#22C55E]">↑</span>125%
          </span>
          <span aria-hidden className="flex h-[3.2cqw] items-end gap-[0.35cqw]">
            {[30, 45, 38, 60, 55, 78, 100].map((h, i) => (
              <span key={i} className="w-[0.6cqw] rounded-t-sm bg-orange" style={{ height: `${h}%`, opacity: 0.45 + i * 0.08 }} />
            ))}
          </span>
        </div>
      </div>
      <div className={card}>
        <span className={label}>Uptime</span>
        <div className="flex items-center gap-[0.8cqw]">
          <span className="size-[1.2cqw] rounded-full bg-[#22C55E] shadow-[0_0_0_0.5cqw_rgba(34,197,94,0.2)]" />
          <span className={stat}>99.9%</span>
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div aria-hidden className="@container relative mx-auto aspect-[100/96] w-full max-w-[740px] select-none">
      {/* Laptop photo. Multiply blends its near-white background into the page. */}
      {/* mix-blend on the animated wrapper (not the img): the wrapper's transform isolates its children,
          so blending there is what lets the photo's near-white background disappear into the page. */}
      <motion.div
        className="absolute bottom-0 left-[2%] w-[86%] mix-blend-multiply"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/hero/laptop.webp"
          alt=""
          width={1400}
          height={933}
          priority
          sizes="(min-width: 1240px) 600px, (min-width: 768px) 50vw, 94vw"
          className="h-auto w-full [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent),linear-gradient(to_bottom,#000_88%,transparent)]"
        />
        {/* Dark screen, cut to the display's shape: its content has "lifted out" into the layers above. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(160deg,#2B2B2B_0%,#161616_55%,#0E0E0E_100%)]"
          style={{ clipPath: "polygon(36.4% 6.3%, 92% 11.9%, 86.7% 69.6%, 30.2% 59.4%)" }}
        />
      </motion.div>

      {/* Layers, back to front */}
      <FloatingLayer className="top-[57%] left-[13%] z-10 w-[56%]" delay={0.5} floatDelay={1}>
        <DeployLayer />
      </FloatingLayer>
      <FloatingLayer className="top-[36%] left-[12%] z-20 w-[55%]" delay={0.35} floatDelay={0.5}>
        <CodeLayer />
      </FloatingLayer>
      <FloatingLayer className="top-[9%] left-[11%] z-20 w-[57%]" delay={0.2} floatDelay={0}>
        <DesignLayer />
      </FloatingLayer>

      {/* Dotted connectors from each callout to its layer */}
      <svg className="pointer-events-none absolute inset-0 z-30 h-full w-full" viewBox="0 0 100 96" preserveAspectRatio="none">
        <g fill="none" stroke="#FF6A2E" strokeWidth="1.2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke">
          <path d="M24 4.6 H37 Q39 4.6 39 6.6 V13" vectorEffect="non-scaling-stroke" />
          <path d="M79 43.5 H69" vectorEffect="non-scaling-stroke" />
          <path d="M79 64.2 H71.5" vectorEffect="non-scaling-stroke" />
        </g>
        <g fill="#FF6A2E">
          <circle cx="39" cy="13.4" r="0.9" />
          <circle cx="68.6" cy="43.5" r="0.9" />
          <circle cx="71.1" cy="64.2" r="0.9" />
        </g>
      </svg>

      <Callout
        icon={PencilIcon}
        title="Design"
        lines={["UI/UX design", "Modern & responsive", "Built for your brand"]}
        className="top-0 left-0"
        delay={0.9}
      />
      <Callout
        icon={CodeXmlIcon}
        title="Develop"
        lines={["Clean code", "Fast performance", "Built to scale"]}
        className="top-[37%] right-0"
        delay={1.05}
      />
      <Callout
        icon={DatabaseIcon}
        title="Deploy"
        lines={["Secure hosting", "Backups & monitoring", "Ongoing support"]}
        className="top-[58%] right-0"
        delay={1.2}
      />
    </div>
  );
}
