import Link from "next/link";
import { contacts, nav, site, socials } from "@/content/site";
import { FooterName } from "./cinema/footer-name";
import { ArrowUpRight, DownloadIcon } from "./icons";

const phone = contacts.find((c) => c.label === "Phone and WhatsApp");
const cv = contacts.find((c) => c.label === "CV");

/**
 * The one contact area on the site, at the bottom of every page. Minimal on
 * white: the heading with a slowly turning line figure, a hairline that draws
 * across as it scrolls in, then three plain columns (about, write or call,
 * elsewhere). Every link appears once. "#contact" links point here.
 */
export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-line" aria-labelledby="contact-title">
      <div className="page-x pt-24 md:pt-32">
        <div className="flex items-end justify-between gap-10">
          <div>
            <p className="t-stamp text-fg-muted">Contact</p>
            <h2 id="contact-title" data-reveal="heading" className="t-display-lg mt-4">
              Let&apos;s talk.
            </h2>
          </div>
          <ContactMark />
        </div>
        <span aria-hidden className="contact-line mt-10 block h-px w-full bg-fg md:mt-14" />

        <div className="grid gap-12 py-12 md:grid-cols-12 md:gap-10 md:py-16">
          <p className="t-body-lg text-fg-soft md:col-span-5">
            I&apos;m a CSE student who builds web apps, designs interfaces and graphics, and works with AI tools every
            day. If you&apos;d like to talk about my work or a project, I&apos;d be glad to hear from you.
          </p>

          <div className="md:col-span-4 md:col-start-7">
            <p className="t-stamp text-fg-muted">Write or call</p>
            <a
              href={`mailto:${site.email}`}
              className="group mt-4 inline-flex max-w-full items-center gap-2 border-b border-line pb-1.5 transition-colors duration-150 hover:border-fg"
            >
              <span className="t-title break-all">{site.email}</span>
              <ArrowUpRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {phone && (
              <p className="mt-5 flex flex-wrap text-base items-baseline gap-x-3 gap-y-1">
                <a href={phone.href} className="hover:text-accent">
                  {phone.value}
                </a>
                <span aria-hidden className="text-fg-muted">
                  ·
                </span>
                <a href={phone.also.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            )}
            <p className="t-stamp mt-5 text-fg-muted">Sylhet, Bangladesh · GMT+6</p>
          </div>

          <div className="md:col-span-2 md:col-start-11">
            <p className="t-stamp text-fg-muted">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 hover:text-accent"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
              {cv && (
                <li>
                  <a href={cv.href} download className="group inline-flex items-center gap-1.5 hover:text-accent">
                    Download CV
                    <DownloadIcon className="size-3.5" />
                    <span className="sr-only"> ({site.cv.size})</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
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

/** A thin square-in-square line figure that turns slowly (static with reduced motion). */
function ContactMark() {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className="contact-mark hidden size-24 shrink-0 text-fg md:block lg:size-28">
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        <rect x={20} y={20} width={80} height={80} />
        <rect x={20} y={20} width={80} height={80} transform="rotate(45 60 60)" />
        <circle cx={60} cy={60} r={28} />
      </g>
      <rect x={58} y={58} width={4} height={4} fill="currentColor" />
    </svg>
  );
}
