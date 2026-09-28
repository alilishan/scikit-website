import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Page metadata with matching canonical, Open Graph and Twitter tags, so shared links and
 * AI search tools always see the right URL, title and description for the page.
 * Keep titles ≤ 60 characters and descriptions 70–160 characters.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_AU",
      siteName: site.name,
      url: path,
      title,
      description,
      // Page-level openGraph replaces the inherited file-based image, so reference it explicitly.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Scikit: websites, software & cloud for Australian small businesses" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/twitter-image"] },
  };
}
