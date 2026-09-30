import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { addressLine, site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy | Scikit",
  description:
    "How Scikit collects, uses, stores and protects personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.",
  path: "/privacy",
});

// DRAFT: have this reviewed before launch. Not legal advice.
export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacy" title="Privacy policy" updated={site.legalUpdated}>
      <p>
        Scikit{site.abn && ` (ABN ${site.abn})`} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This policy
        explains how we handle personal information in line with the <em>Privacy Act 1988</em> (Cth) and the Australian
        Privacy Principles (APPs).
      </p>

      <h2>1. What we collect</h2>
      <ul>
        <li><strong>Contact details:</strong> name, business name, email, phone number, address</li>
        <li><strong>Enquiry details:</strong> information you provide about your business and project</li>
        <li><strong>Billing details:</strong> invoicing information (card payments are processed by our payment provider; we don&apos;t store card numbers)</li>
        <li><strong>Website usage data:</strong> pages visited, device and browser type, approximate location and referral source, collected via cookies and analytics tools</li>
        <li><strong>Client system data:</strong> when we build or support your systems, we may have access to data held in them. We handle it only to deliver our services and under your instructions.</li>
      </ul>

      <h2>2. How we collect it</h2>
      <p>
        Directly from you (forms, email, phone, meetings), through our website (cookies and analytics), and from your
        systems when you engage us to work on them.
      </p>

      <h2>3. Why we collect it</h2>
      <p>
        To respond to enquiries, provide and support our services, send invoices, improve our website, meet legal
        obligations, and — only with your consent — send occasional updates. You can unsubscribe at any time.
      </p>

      <h2>4. Disclosure</h2>
      <p>
        We don&apos;t sell personal information. We may share it with trusted service providers who help us run our
        business (for example hosting, email, accounting, payment and analytics providers), with professional advisers, or
        where required by law.
      </p>

      <h2>5. Overseas disclosure</h2>
      <p>
        Some of our service providers may store data outside Australia (for example in the United States or the European
        Union). Where this happens, we take reasonable steps to ensure the information is handled consistently with the
        APPs.
      </p>

      <h2>6. Security</h2>
      <p>
        We protect personal information with measures including encryption, multi-factor authentication, access controls
        and regular backups. If a data breach is likely to cause serious harm, we will notify affected individuals and the
        Office of the Australian Information Commissioner (OAIC) as required by the Notifiable Data Breaches scheme.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Our website uses cookies for basic functionality and analytics. We use Google Analytics to understand how people
        use the site (pages visited, device, approximate location and referral source); it does not receive the details
        you type into our forms. You can disable cookies in your browser, though some features may not work properly, or
        opt out of Google Analytics with Google&apos;s{" "}
        <a href="https://tools.google.com/dlpage/gaoptout">browser add-on</a>.
      </p>

      <h2>8. Access and correction</h2>
      <p>
        You can ask to access or correct the personal information we hold about you by contacting us. We&apos;ll respond
        within a reasonable time, usually 30 days.
      </p>

      <h2>9. Complaints</h2>
      <p>
        If you have a privacy concern, contact us first{site.email && ` at ${site.email}`}. If you&apos;re not satisfied with our response,
        you can contact the OAIC at <a href="https://www.oaic.gov.au">oaic.gov.au</a> or on 1300 363 992.
      </p>

      <h2>10. Contact</h2>
      <p>
        Scikit
        <br />
        {addressLine}
        {(site.email || site.phone) && (
          <>
            <br />
            {[site.email, site.phone].filter(Boolean).join(" · ")}
          </>
        )}
      </p>
    </LegalPage>
  );
}
