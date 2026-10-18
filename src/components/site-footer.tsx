import Link from "next/link";
import { contacts, nav, site } from "@/content/site";
import { ArrowUpRight, DownloadIcon } from "./icons";
import { ContactIcon } from "./logo-mark";

const elsewhere = ["GitHub", "LinkedIn", "Instagram", "Facebook", "Email", "CV"]
  .map((label) => contacts.find((c) => c.label === label))
  .filter((c) => c !== undefined);

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="page-x grid gap-12 py-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p className="font-display text-lg font-bold tracking-[-0.02em]">{site.name}</p>
          <p className="t-body-sm mt-2 max-w-sm text-fg-soft">
            Software, UI/UX and graphic design, with AI in the workflow. Based in {site.location}.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="t-stamp text-fg-muted">Pages</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" className="t-body-sm hover:text-accent">
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-body-sm hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="t-stamp text-fg-muted">Elsewhere</p>
          <ul className="mt-3 border-t border-line">
            {elsewhere.map((c) => {
              const external = "external" in c && c.external;
              const download = "download" in c && c.download;
              const label = c.label === "CV" ? "Download CV" : c.label;
              return (
                <li key={c.label} className="border-b border-line">
                  <a
                    href={c.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    {...(download ? { download: true } : {})}
                    className="group flex items-center gap-3 py-2.5 transition-colors duration-100 hover:text-accent focus-visible:text-accent"
                  >
                    <ContactIcon contact={c} />
                    <span className="t-body-sm flex-1">{label}</span>
                    {download ? (
                      <DownloadIcon className="text-fg-muted group-hover:text-accent" />
                    ) : (
                      <ArrowUpRight className="text-fg-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                    )}
                    {external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="page-x border-t border-line py-5">
        <p className="t-stamp text-fg-muted">© 2026 {site.name}</p>
      </div>
    </footer>
  );
}
