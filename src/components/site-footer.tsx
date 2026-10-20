import Link from "next/link";
import { contacts, nav, site } from "@/content/site";
import { FooterName } from "./cinema/footer-name";
import { ArrowUpRight, DownloadIcon } from "./icons";
import { ContactIcon } from "./logo-mark";

/**
 * The one contact block on the site, at the bottom of every page: a heading,
 * a short note and a grid of clean rounded cards, one per way to reach Asif,
 * each with its full-colour icon. Every link appears once. "#contact" links
 * point here.
 */
export function SiteFooter() {
  return (
    <footer id="contact" aria-labelledby="contact-title">
      <div className="page-x py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="pill-badge" data-reveal="fade">
            Contact
          </p>
          <h2 id="contact-title" data-reveal="heading" className="t-display-lg mt-5">
            Let&apos;s talk.
          </h2>
          <p className="t-body-lg mt-5 text-fg-soft" data-reveal="fade">
            I&apos;m a CSE student who builds web apps and designs interfaces and graphics. If you&apos;d like to talk
            about my work or a project, I&apos;d be glad to hear from you.
          </p>
          <p className="mt-3 text-[0.9375rem] text-fg-soft md:text-base md:text-base">Sylhet, Bangladesh · GMT+6</p>
        </div>

        <ul data-reveal-group className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {contacts.map((c) => {
            const external = "external" in c && c.external;
            const download = "download" in c && c.download;
            const wide = c.label === "Email" || c.label === "Phone and WhatsApp";
            return (
              <li key={c.label} data-reveal="item" className={wide ? "sm:col-span-2" : ""}>
                <div className="card card-lift group relative flex h-full flex-wrap items-center gap-4 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f4f4f1]">
                    <ContactIcon contact={c} size="sm" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.875rem] font-medium text-fg-soft md:text-[0.9375rem]">{c.label}</span>
                    <a
                      href={c.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...(download ? { download: true } : {})}
                      className="mt-0.5 block font-medium break-words after:absolute after:inset-0 after:rounded-card after:content-['']"
                    >
                      {c.value}
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </span>
                  {"also" in c ? (
                    <a
                      href={c.also.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary relative z-10 !gap-2 !px-3.5 !py-2 !text-[0.8125rem] max-[400px]:ml-[3.75rem]"
                    >
                      <ContactIcon contact={c.also} />
                      {c.also.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : download ? (
                    <DownloadIcon className="shrink-0 text-fg-muted" />
                  ) : (
                    <ArrowUpRight className="shrink-0 text-fg-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <nav aria-label="Footer" className="page-x border-t border-line py-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/" className="text-[0.875rem] hover:text-accent">
              Home
            </Link>
          </li>
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-[0.875rem] hover:text-accent">
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
        <p className="text-[0.875rem] font-medium text-fg-soft md:text-[0.9375rem]">© 2026 {site.name}</p>
      </div>
    </footer>
  );
}
