import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Terms of Use | Scikit",
  description: "Terms of use for the Scikit website.",
  alternates: { canonical: "/terms" },
};

// DRAFT: have this reviewed before launch. Covers website use only; client work needs a separate services agreement.
export default function TermsPage() {
  return (
    <LegalPage eyebrow="Terms" title="Website terms of use" updated={site.legalUpdated}>
      <p>
        These terms apply to your use of scikit.com.au, operated by Scikit{site.abn && ` (ABN ${site.abn})`}. By using the site, you agree
        to them.
      </p>

      <h2>Information on this site</h2>
      <p>
        Content on this website is general information only, not professional advice for your specific situation. Prices
        shown are indicative starting prices in Australian dollars, exclude GST unless stated, and may change. A binding
        price is only provided in a written quote.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this site — text, graphics, logos and code — belongs to Scikit or its licensors. You may view and
        share it for personal or internal business use, but may not reproduce it commercially without our written
        permission.
      </p>

      <h2>Links to other sites</h2>
      <p>We may link to third-party websites. We&apos;re not responsible for their content or privacy practices.</p>

      <h2>Liability</h2>
      <p>
        To the extent permitted by law, we&apos;re not liable for any loss arising from use of this website. Nothing in
        these terms excludes rights you have under the Australian Consumer Law that cannot be excluded.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Victoria, Australia, and you submit to the non-exclusive jurisdiction of
        its courts.
      </p>

      <h2>Contact</h2>
      <p>{site.email ? `Questions? Email ${site.email}.` : "Questions? Use our contact page."}</p>
    </LegalPage>
  );
}
