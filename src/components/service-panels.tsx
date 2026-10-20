import Link from "next/link";
import { ArrowRight } from "./icons";
import { LogoMark } from "./logo-mark";
import { MediaImage } from "./media-image";
import type { LogoKey } from "@/content/logos.generated";
import type { MediaKey } from "@/content/media.generated";

export type Panel = {
  title: string;
  /** One short line, shown large. */
  line: string;
  /** Supporting detail, shown smaller on the right. */
  detail: string;
  color: string;
  /** Darken (not lighten) the inner panel, for colours where white text needs more contrast. */
  innerDark?: boolean;
  button: { label: string; href: string };
  links: { label: string; href: string }[];
  images?: { image: MediaKey; alt: string; href?: string; tall?: boolean }[];
  cards?: { title: string; meta: string; logo?: LogoKey }[];
};

/**
 * "What I do" as stacked service panels: each category is a wide rounded panel
 * that sticks below the header and is covered by the next one as you scroll.
 * Big title left, "/01" right, a lighter inner panel with the copy, a pill
 * button and a row of image cards (Asif's own work only).
 */
export function ServicePanels({ panels }: { panels: Panel[] }) {
  return (
    <ol className="relative">
      {panels.map((p, i) => (
        <li
          key={p.title}
          data-area={p.title}
          className="no-halo panel-sticky relative mb-8 overflow-hidden rounded-[28px] text-white shadow-[0_-10px_40px_rgb(18_19_22/0.12)] md:mb-12"
          style={{ background: p.color, top: `calc(5rem + ${i * 1.25}rem)` }}
        >
          <div className="flex items-start justify-between gap-6 px-6 pt-7 md:px-10 md:pt-10">
            <h3 className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em]">
              {p.title}
            </h3>
            <span aria-hidden className="font-display text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-medium tracking-[-0.03em]">
              /{String(i + 1).padStart(2, "0")}
            </span>
          </div>

          <div className={`m-3 mt-6 rounded-[22px] p-5 md:m-4 md:mt-8 md:p-7 ${p.innerDark ? "bg-black/25" : "bg-white/10"}`}>
            <div className="grid gap-6 md:grid-cols-12 md:items-start">
              <p className="text-[1.0625rem] leading-snug font-medium md:col-span-4">
                <span aria-hidden className="mr-2 inline-block size-1.5 translate-y-[-3px] rounded-full bg-white" />
                {p.line}
              </p>
              <div className="flex md:col-span-3 md:justify-center">
                <Link
                  href={p.button.href}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[0.9375rem] font-medium text-[#121316] shadow-[0_10px_24px_rgb(0_0_0/0.18)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {p.button.label}
                  <ArrowRight />
                </Link>
              </div>
              <div className="md:col-span-5">
                <p className={`text-[0.9375rem] leading-relaxed md:text-base text-white`}>{p.detail}</p>
                {p.links.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${p.title}: related work`}>
                    {p.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="inline-flex rounded-full border border-white/30 px-3 py-1.5 text-[0.8125rem] font-medium hover:border-white hover:bg-white/10"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {p.images && (
              <ul className="mt-6 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
                {p.images.map((img) => {
                  const frame = (
                    <span
                      className={`block overflow-hidden rounded-tile bg-white/10 ${img.tall ? "aspect-[3/4]" : "aspect-[16/11]"}`}
                    >
                      <MediaImage
                        image={img.image}
                        alt={img.alt}
                        sizes="(min-width: 48rem) 22vw, 70vw"
                        className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </span>
                  );
                  return (
                    <li key={img.image} className="w-[70vw] shrink-0 md:w-auto">
                      {img.href ? (
                        <Link href={img.href} className="group block">
                          {frame}
                        </Link>
                      ) : (
                        <div className="group">{frame}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {p.cards && (
              <ul className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
                {p.cards.map((c) => (
                  <li key={c.title} className="flex items-center gap-4 rounded-tile bg-white p-4 text-[#121316]">
                    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                      <LogoMark logo={c.logo} name={c.title} size="md" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{c.title}</span>
                      <span className="mt-0.5 block text-[0.875rem] text-[#2a2b30]">{c.meta}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
