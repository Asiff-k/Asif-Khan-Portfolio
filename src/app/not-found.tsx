import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <main id="main" className="page-x py-24 md:py-36">
      <p className="t-stamp text-moss">404</p>
      <h1 className="t-display-lg mt-4">Page not found</h1>
      <p className="t-body-lg mt-6 max-w-lg text-ink-soft">
        This page doesn&apos;t exist. It may have moved, or the link may have a typo.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          <ArrowLeft /> Back to home
        </Link>
        <Link
          href="/#work"
          className="btn-secondary"
        >
          See my work
        </Link>
      </div>
    </main>
  );
}
