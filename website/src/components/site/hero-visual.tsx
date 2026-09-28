"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CodeXmlIcon, DatabaseIcon, PencilIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Home hero visual (branding/hero.png): the laptop with three "exploded" layers floating above it —
 * Design (the site), Develop (the code) and Deploy (hosting & monitoring) — each with a callout.
 *
 * The layers sit on exactly the same plane as the laptop's screen. The screen's four corners were
 * measured in the photo; a projective transform (homography) maps each flat layer onto that plane,
 * extended above and below the screen. Text inside uses container-query units so it scales with the visual.
 */

// Laptop photo (1400×933) placement inside the visual, as fractions of the container width.
const LAPTOP = { left: 0.02, width: 0.86, aspect: 1400 / 933 };
// Display corners measured in the photo (fractions of image width/height): TL, TR, BR, BL.
const SCREEN: Pt[] = [
  [0.3646, 0.0635],
  [0.9193, 0.1232],
  [0.8639, 0.6976],
  [0.3151, 0.5687],
];
// The display is 16:10, so one unit across ("u") is 1.6× one unit down ("v") on the screen plane.
const SCREEN_RATIO = 1.6;

type Pt = [number, number];

/** Solve the homography mapping 4 source points onto 4 destination points. Returns [a..h] (i = 1). */
function homography(src: Pt[], dst: Pt[]): number[] {
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [X, Y] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X, X]);
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y, Y]);
  }
  // Gauss–Jordan elimination with partial pivoting on the 8×9 augmented matrix.
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  return A.map((row, i) => row[8] / row[i]);
}

const apply = (h: number[], [x, y]: Pt): Pt => {
  const w = h[6] * x + h[7] * y + 1;
  return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w];
};

const toMatrix3d = (h: number[]) =>
  `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;

const UNIT_SQUARE: Pt[] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

/**
 * A layer spans [u0,u1] across the screen and starts at v0 (screen top = 0, screen bottom = 1).
 * `lift` pulls it towards the viewer: a uniform scale about the screen centre plus a shift
 * (in % of the visual's width). Both keep the layer parallel to the screen.
 */
type LayerSpec = {
  key: "design" | "code" | "deploy";
  u0: number;
  u1: number;
  v0: number;
  aspect: number;
  lift: { scale: number; dx: number; dy: number };
};

const LAYERS: LayerSpec[] = [
  { key: "design", u0: 0.02, u1: 0.98, v0: -0.88, aspect: 16 / 8.4, lift: { scale: 1.06, dx: -6, dy: -2 } },
  { key: "code", u0: 0.05, u1: 0.95, v0: -0.2, aspect: 16 / 7.4, lift: { scale: 1.09, dx: -7, dy: -2.5 } },
  { key: "deploy", u0: 0.03, u1: 0.97, v0: 0.38, aspect: 16 / 4.6, lift: { scale: 1.12, dx: -8, dy: -1 } },
];

type LayerGeo = { width: number; height: number; transform: string; right: Pt; top: Pt };
type Geometry = { w: number; h: number; layers: Record<LayerSpec["key"], LayerGeo> };

function computeGeometry(w: number, h: number): Geometry {
  const lw = LAPTOP.width * w;
  const lh = lw / LAPTOP.aspect;
  const lx = LAPTOP.left * w;
  const ly = h - lh;
  const screen = SCREEN.map(([x, y]) => [lx + x * lw, ly + y * lh] as Pt);
  const unitToScreen = homography(UNIT_SQUARE, screen);
  const centre = apply(unitToScreen, [0.5, 0.5]);

  const layers = {} as Geometry["layers"];
  for (const L of LAYERS) {
    const lift = ([x, y]: Pt): Pt => [
      centre[0] + (x - centre[0]) * L.lift.scale + (L.lift.dx / 100) * w,
      centre[1] + (y - centre[1]) * L.lift.scale + (L.lift.dy / 100) * w,
    ];
    const v1 = L.v0 + ((L.u1 - L.u0) * SCREEN_RATIO) / L.aspect;
    const quad = (
      [
        [L.u0, L.v0],
        [L.u1, L.v0],
        [L.u1, v1],
        [L.u0, v1],
      ] as Pt[]
    ).map((p) => lift(apply(unitToScreen, p)));
    // The element is laid out flat at this size, then warped onto `quad`.
    const width = 0.6 * w;
    const height = width / L.aspect;
    const rect: Pt[] = [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
    ];
    layers[L.key] = {
      width,
      height,
      transform: toMatrix3d(homography(rect, quad)),
      right: lift(apply(unitToScreen, [L.u1, (L.v0 + v1) / 2])),
      top: lift(apply(unitToScreen, [L.u0 + (L.u1 - L.u0) * 0.42, L.v0])),
    };
  }
  return { w, h, layers };
}

function FloatingLayer({
  geo,
  children,
  delay,
  floatDelay,
  z,
}: {
  geo: LayerGeo;
  children: React.ReactNode;
  delay: number;
  floatDelay: number;
  z: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: z }}
      initial={{ opacity: 0, y: -36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -6, 0] }}
        transition={{ delay: delay + 0.8 + floatDelay, duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: geo.width, height: geo.height, transform: geo.transform }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Callout({
  icon: Icon,
  title,
  lines,
  style,
  delay,
  align = "left",
  calloutRef,
}: {
  icon: LucideIcon;
  title: string;
  lines: string[];
  style: React.CSSProperties;
  delay: number;
  align?: "left" | "right";
  calloutRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <motion.div
      ref={calloutRef}
      className={cn("absolute z-40 flex items-start gap-[1.4cqw]", align === "right" && "right-0")}
      style={style}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <span className="flex size-[6.6cqw] min-h-7 min-w-7 shrink-0 items-center justify-center rounded-[1.6cqw] bg-white shadow-card">
        <Icon aria-hidden className="size-[3cqw] min-h-3.5 min-w-3.5 text-charcoal" strokeWidth={1.75} />
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
    <div className="grid h-full w-full grid-cols-[1fr_1fr] gap-[3%] overflow-hidden rounded-[1.6cqw] bg-offwhite p-[4%] shadow-[0_30px_60px_-25px_rgba(38,30,20,0.45)] ring-1 ring-black/5">
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
    <div className="grid h-full w-full grid-cols-[30%_1fr] items-end overflow-hidden rounded-[1.6cqw] bg-[#161616] font-mono text-[1.25cqw] leading-[1.7] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      <div className="flex h-full flex-col justify-end border-r border-white/10 px-[9%] py-[8%] text-[#8A8A8A]">
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
    <div className="grid h-full w-full grid-cols-3 gap-[2.5%] rounded-[1.6cqw] bg-offwhite/95 p-[2.5%] shadow-[0_30px_60px_-25px_rgba(38,30,20,0.45)] ring-1 ring-black/5">
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
  const container = useRef<HTMLDivElement>(null);
  const designCallout = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [designAnchor, setDesignAnchor] = useState<Pt | null>(null);

  // Measure the container and recompute the layer transforms whenever it resizes.
  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const update = () => {
      const box = el.getBoundingClientRect();
      if (!box.width) return;
      setGeo(computeGeometry(box.width, box.height));
      const c = designCallout.current?.getBoundingClientRect();
      if (c) setDesignAnchor([c.right - box.left, c.top - box.top + Math.min(14, c.height / 2)]);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const g = geo?.layers;
  const cq = geo ? geo.w / 100 : 0; // 1cqw in px

  return (
    <div ref={container} aria-hidden className="@container relative mx-auto aspect-[100/96] w-full max-w-[740px] select-none">
      {/* Laptop photo. mix-blend on the animated wrapper (its transform isolates children) melts the
          photo's near-white background into the page; the mask feathers its edges. */}
      <motion.div
        className="absolute bottom-0 mix-blend-multiply"
        style={{ left: `${LAPTOP.left * 100}%`, width: `${LAPTOP.width * 100}%` }}
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
          sizes="(min-width: 1240px) 640px, (min-width: 768px) 50vw, 90vw"
          className="h-auto w-full [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent),linear-gradient(to_bottom,#000_88%,transparent)]"
        />
        {/* Dark screen, cut to the display's measured corners: its content has "lifted out" into the layers. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(160deg,#2B2B2B_0%,#161616_55%,#0E0E0E_100%)]"
          style={{ clipPath: `polygon(${SCREEN.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(", ")})` }}
        />
      </motion.div>

      {geo && g && (
        <>
          <FloatingLayer geo={g.deploy} delay={0.5} floatDelay={1} z={10}>
            <DeployLayer />
          </FloatingLayer>
          <FloatingLayer geo={g.code} delay={0.35} floatDelay={0.5} z={20}>
            <CodeLayer />
          </FloatingLayer>
          <FloatingLayer geo={g.design} delay={0.2} floatDelay={0} z={30}>
            <DesignLayer />
          </FloatingLayer>

          {/* Dotted connectors from each callout to its layer's edge */}
          <motion.svg
            className="pointer-events-none absolute inset-0 z-40 h-full w-full overflow-visible"
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <g fill="none" stroke="#FF6A2E" strokeWidth={1.25} strokeDasharray="3 3">
              {designAnchor && (
                <path d={`M${designAnchor[0] + 8} ${designAnchor[1]} H${g.design.top[0]} V${g.design.top[1] - 4}`} />
              )}
              <path d={`M${geo.w - 21 * cq} ${g.code.right[1]} H${g.code.right[0] + 6}`} />
              <path d={`M${geo.w - 23 * cq} ${g.deploy.right[1]} H${g.deploy.right[0] + 6}`} />
            </g>
            <g fill="#FF6A2E">
              <circle cx={g.design.top[0]} cy={g.design.top[1]} r={4} />
              <circle cx={g.code.right[0]} cy={g.code.right[1]} r={4} />
              <circle cx={g.deploy.right[0]} cy={g.deploy.right[1]} r={4} />
            </g>
          </motion.svg>

          <Callout
            icon={CodeXmlIcon}
            title="Develop"
            lines={["Clean code", "Fast performance", "Built to scale"]}
            style={{ top: g.code.right[1] - 3.3 * cq }}
            align="right"
            delay={1.05}
          />
          <Callout
            icon={DatabaseIcon}
            title="Deploy"
            lines={["Secure hosting", "Backups & monitoring", "Ongoing support"]}
            style={{ top: g.deploy.right[1] - 3.3 * cq }}
            align="right"
            delay={1.2}
          />
        </>
      )}

      <Callout
        calloutRef={designCallout}
        icon={PencilIcon}
        title="Design"
        lines={["UI/UX design", "Modern & responsive", "Built for your brand"]}
        style={{ top: 0, left: 0 }}
        delay={0.9}
      />
    </div>
  );
}
