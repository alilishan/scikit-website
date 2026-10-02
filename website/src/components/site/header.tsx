"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { moreServices } from "@/content/services";
import { Arrow } from "./primitives";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const mainNav = [
  { label: "Web Design", href: "/services/websites" },
  { label: "SEO", href: "/services/seo" },
  { label: "Custom Software", href: "/services/custom-software" },
  { label: "Cloud & DevOps", href: "/services/cloud-devops" },
  { label: "Hosting & Care", href: "/services/hosting-care" },
];
const endNav = [
  { label: "Pricing", href: "/pricing" },
  // PROCESS PAGE HIDDEN (Oct 2026). To restore, see website/CLAUDE.md.
  // { label: "Process", href: "/process" },
  { label: "FAQ", href: "/faq" },
];
const moreLinks = moreServices.map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

function linkClass(active: boolean) {
  return cn("whitespace-nowrap hover:text-orange", active ? "font-semibold text-orange" : "text-charcoal");
}

export function AnnouncementBar() {
  if (!site.showAnnouncement) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2 bg-charcoal px-5 py-2.5 text-center text-[13px] text-offwhite">
      <span>Free website &amp; SEO audit for Australian businesses.</span>
      <Link href="/contact" className="relative after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] inline-flex items-center gap-1 font-medium text-orange hover:text-offwhite">
        Get yours <Arrow className="size-3.5" />
      </Link>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  // The mobile menu remembers the page it was opened on, so it closes itself after navigating.
  const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
  const menuOpen = menuOpenedOn === pathname;

  const moreActive = moreLinks.some((l) => pathname === l.href) || pathname === "/services";

  return (
    <header className="sticky top-0 z-50 border-b border-warm-100 bg-white/95 backdrop-blur-[10px]">
      <div className="container-site flex items-center justify-between gap-6 py-[18px]">
        <Link href="/" className="-my-2 flex shrink-0 py-2" aria-label="Scikit home">
          <Image src="/logos/scikit-wordmark.svg" alt="scikit" width={72} height={30} priority className="h-[30px] w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 text-sm min-[1180px]:flex">
          {mainNav.map((n) => (
            <Link key={n.href} href={n.href} className={linkClass(pathname === n.href)}>
              {n.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger
              openOnHover
              className={cn("flex cursor-pointer items-center gap-1 outline-none", linkClass(moreActive))}
            >
              More services <ChevronDownIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl p-1.5">
              {moreLinks.map((l) => (
                <DropdownMenuItem key={l.href} render={<Link href={l.href} />} className="rounded-lg px-3 py-2 text-sm">
                  {l.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/services" />} className="rounded-lg px-3 py-2 text-sm font-medium">
                All services
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {endNav.map((n) => (
            <Link key={n.href} href={n.href} className={linkClass(pathname === n.href)}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link href="/contact" className={buttonVariants({ variant: "brand", size: "nav" })}>
            Start a project
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpenedOn(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="cursor-pointer rounded-full border border-warm-400 bg-white px-4 py-2.5 text-sm font-medium min-[1180px]:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="flex flex-col border-t border-warm-100 bg-white px-[clamp(20px,4vw,40px)] pt-2 pb-5 min-[1180px]:hidden"
        >
          {[...mainNav, ...moreLinks, { label: "All services", href: "/services" }, ...endNav].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn("border-b border-warm-150 py-3.5 text-[17px]", linkClass(pathname === n.href))}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
