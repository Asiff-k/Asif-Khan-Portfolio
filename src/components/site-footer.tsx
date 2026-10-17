import Link from "next/link";
import { nav, site, socials } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="page-x grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-lg font-bold tracking-[-0.02em]">{site.name}</p>
          <p className="t-body-sm mt-2 max-w-sm text-ink-soft">
            {site.role}, based in {site.location}.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="t-stamp text-muted">Pages</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" className="t-body-sm hover:text-moss">
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-body-sm hover:text-moss">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="t-stamp text-muted">Elsewhere</p>
          <ul className="mt-4 space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="t-body-sm hover:text-moss">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="t-body-sm hover:text-moss">
                Email
              </a>
            </li>
            <li>
              <a href={site.cv.href} download className="t-body-sm hover:text-moss">
                {site.cv.label} ({site.cv.size})
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="page-x border-t border-rule py-5">
        <p className="t-stamp text-muted">© 2026 {site.name}</p>
      </div>
    </footer>
  );
}
