import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow, PageTitle, Stop } from "@/components/site/primitives";

export default function NotFound() {
  return (
    <section className="container-site flex flex-col items-start gap-6 pt-24 pb-32">
      <Eyebrow>404</Eyebrow>
      <PageTitle>
        This page doesn&apos;t exist<Stop />
      </PageTitle>
      <p className="m-0 max-w-[520px] text-lg leading-[1.6] text-body">
        The link may be old or mistyped. Head back to the home page, or tell us what you were looking for.
      </p>
      <div className="flex flex-wrap gap-3.5">
        <Link href="/" className={buttonVariants({ variant: "brand", size: "md" })}>
          Go to the home page
        </Link>
        <Link href="/contact" className={buttonVariants({ variant: "pill", size: "md" })}>
          Contact us
        </Link>
      </div>
    </section>
  );
}
