import Link from "next/link";
import Image from "next/image";
import { services } from "@/content/services";
import { emailHref, localityLine, phoneHref, site } from "@/lib/site";
import pkg from "../../../package.json";

// Site version from package.json.
const version = `v${pkg.version}`;

const colTitle = "pb-1 text-xs tracking-[0.16em] text-label uppercase";

export function SiteFooter() {
  return (
    <footer className="border-t border-warm-200 bg-offwhite">
      <div className="container-site flex flex-col gap-12 pt-16 pb-8">
        <div className="auto-grid gap-10 [--min:200px]">
          <div className="flex flex-col gap-4">
            <Image src="/logos/scikit-wordmark.svg" alt="scikit" width={72} height={30} className="h-[30px] w-auto self-start" />
            <p className="max-w-[260px] text-sm leading-relaxed text-body">{site.tagline}</p>
            <div className="text-[11px] tracking-[0.2em] text-label">DIGITAL, BUILT PROPERLY.</div>
          </div>
          <nav aria-label="Services" className="flex flex-col gap-0.5 text-sm">
            <div className={`${colTitle} pb-2`}>Services</div>
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="py-1 hover:text-orange">
                {s.title}
              </Link>
            ))}
          </nav>
          <nav aria-label="Company" className="flex flex-col gap-0.5 text-sm">
            <div className={`${colTitle} pb-2`}>Company</div>
            <Link href="/process" className="py-1 hover:text-orange">Process</Link>
            <Link href="/pricing" className="py-1 hover:text-orange">Pricing</Link>
            <Link href="/faq" className="py-1 hover:text-orange">FAQ</Link>
            <Link href="/contact" className="py-1 hover:text-orange">Contact</Link>
          </nav>
          <div className="flex flex-col gap-2.5 text-sm text-ink-soft">
            <div className={colTitle}>Contact</div>
            <address className="flex flex-col gap-2.5 not-italic">
              {site.street && <span>{site.street}</span>}
              <span>{localityLine}</span>
              {site.phone && (
                <a href={phoneHref} className="py-1 hover:text-orange">
                  {site.phone}
                </a>
              )}
              {site.email && (
                <a href={emailHref} className="py-1 hover:text-orange">
                  {site.email}
                </a>
              )}
            </address>
            {site.social.length > 0 && (
              <div className="flex gap-4 pt-2 text-charcoal">
                {site.social.map((s) => (
                  <a key={s.label} href={s.href} className="hover:text-orange" rel="noopener" target="_blank">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="max-w-[720px] text-[13px] leading-relaxed text-label">
          Scikit acknowledges the Traditional Custodians of the lands on which we live and work, and pays respect to Elders
          past and present.
        </p>
        <div className="flex flex-wrap justify-between gap-4 border-t border-warm-200 pt-[22px] text-[13px] text-label">
          <span>
            © {new Date().getFullYear()} Scikit · Melbourne, Australia{site.abn && ` · ABN ${site.abn}`}
          </span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="py-1 hover:text-orange">Privacy</Link>
            <Link href="/terms" className="py-1 hover:text-orange">Terms</Link>
            <span title="Site version">{version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
