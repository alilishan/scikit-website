import { Eyebrow, PageTitle, Stop } from "@/components/site/primitives";

/** Plain long-form layout for Privacy and Terms (not designed in the handoff). */
export function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="container-site flex flex-col gap-5 pt-20 pb-10">
        <Eyebrow>{eyebrow}</Eyebrow>
        <PageTitle>
          {title}
          <Stop />
        </PageTitle>
        <p className="m-0 text-sm text-label">Last updated: {updated}</p>
      </section>
      <article className="container-site pb-24">
        <div className="max-w-[720px] text-base leading-[1.7] text-body [&_a]:text-charcoal [&_a]:underline [&_h2]:display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:tracking-[-0.02em] [&_h2]:text-charcoal [&_li]:mb-1.5 [&_p]:mb-4 [&_strong]:text-charcoal [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </>
  );
}
