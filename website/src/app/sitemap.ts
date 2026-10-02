import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // PROCESS PAGE HIDDEN (Oct 2026). To restore, see website/CLAUDE.md. "/process" removed from this list.
  const pages = ["", "/services", "/pricing", "/faq", "/contact", "/privacy", "/terms"];
  const now = new Date();
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      priority: p === "" ? 1 : p === "/privacy" || p === "/terms" ? 0.3 : 0.8,
    })),
    ...services.map((s) => ({
      url: `${site.url}/services/${s.slug}`,
      lastModified: now,
      priority: s.core ? 0.9 : 0.7,
    })),
  ];
}
