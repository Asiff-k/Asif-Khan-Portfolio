import Link from "next/link";
import { contacts, nav, site } from "@/content/site";
import { FooterName } from "./cinema/footer-name";
import { ArrowUpRight, DownloadIcon } from "./icons";
import { ContactIcon } from "./logo-mark";

// The email has its own large link above the list, so it is not repeated in it.
const reach = contacts.filter((c) => c.label !== "Email");

/**
 * The one contact area on the site, at the bottom of every page: email, the
 * ways to reach Asif (each listed once), page links and the oversized name.
 * "#contact" links in the header and hero point here.
 */
export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-line" aria-labelledby="contact-title">
      <div className="page-x grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="t-stamp text-accent">Contact</p>
          <h2 id="contact-title" data-reveal="heading" className="t-display-lg mt-4">
            Let&apos;s talk.
          </h2>
          <p className="t-body-lg mt-8 max-w-md text-fg-muted">
            I&apos;m a CSE student who builds web apps, designs interfaces and graphics, and works with AI tools every
            day. If you&apos;d like to talk about my work or a project, I&apos;d be glad to hear from you.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="group mt-10 inline-flex max-w-full items-center gap-3 border-b border-line pb-2 transition-colors duration-150 hover:border-accent"
          >
            <span className="t-title break-all group-hover:text-accent">{site.email}</span>
            <ArrowUpRight className="size-5 shrink-0 text-fg-muted group-hover:text-accent" />
          </a>
          <p className="t-stamp mt-4 text-fg-muted">Sylhet, Bangladesh · GMT+6</p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
          <p className="t-stamp text-fg-muted">Reach me on</p>
          <ul className="mt-3 border-t border-line">
            {reach.map((c) => (
              <li key={c.label} className="flex items-center gap-x-4 border-b border-line">
                <a
                  href={c.href}
                  {...("external" in c && c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...("download" in c && c.download ? { download: true } : {})}
                  className="group grid min-w-0 flex-1 grid-cols-[1.5rem_1fr_auto] items-center gap-x-4 py-3.5"
                >
                  <ContactIcon contact={c} />
                  <span className="min-w-0">
                    <span className="t-stamp block text-fg-muted">{c.label}</span>
                    <span className="mt-0.5 block break-words text-[0.9375rem] group-hover:text-accent">{c.value}</span>
                  </span>
                  {"download" in c && c.download ? (
                    <DownloadIcon className="text-fg-muted group-hover:text-accent" />
                  ) : (
                    <ArrowUpRight className="text-fg-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  )}
                  {"external" in c && c.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
                {"also" in c && (
                  <a
                    href={c.also.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group t-stamp pressable inline-flex shrink-0 items-center gap-2 border border-line px-3 py-2 hover:border-accent hover:text-accent"
                  >
                    <ContactIcon contact={c.also} />
                    {c.also.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <nav aria-label="Footer" className="page-x border-t border-line py-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/" className="t-stamp hover:text-accent">
              Home
            </Link>
          </li>
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="t-stamp hover:text-accent">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="page-x overflow-hidden pt-4 pb-8 md:pb-10">
        <FooterName name={site.name} />
      </div>
      <div className="page-x border-t border-line py-5">
        <p className="t-stamp text-fg-muted">© 2026 {site.name}</p>
      </div>
    </footer>
  );
}
