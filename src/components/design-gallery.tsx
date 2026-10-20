import { getImageProps } from "next/image";
import { GalleryController } from "./gallery-controller";
import type { LightboxItem } from "./lightbox";

export type GalleryEntry = LightboxItem & { category: string };

/**
 * The design grid. Thumbnails are rendered on the server as plain images (no
 * hydration per piece); GalleryController adds the filters, the live count and
 * the lightbox around them.
 */
export function DesignGallery({ entries, categories }: { entries: GalleryEntry[]; categories: readonly string[] }) {
  return (
    <GalleryController entries={entries} categories={categories}>
      {entries.map((e, i) => {
        const { props } = getImageProps({
          src: e.src,
          width: e.width,
          height: e.height,
          alt: "",
          sizes: "(min-width: 75rem) 22vw, (min-width: 48rem) 30vw, 46vw",
          className: "block h-auto w-full",
        });
        return (
          <li key={e.src} data-category={e.category} className="mb-5 break-inside-avoid md:mb-6">
            <button
              type="button"
              data-index={i}
              aria-label={`Open ${e.title}`}
              data-cursor="Open"
              className="group pressable block w-full text-left"
            >
              <span className="block overflow-hidden rounded-tile bg-surface shadow-[0_1px_2px_rgb(18_19_22/0.04),0_10px_28px_rgb(18_19_22/0.06)]">
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img {...props} />
              </span>
              <span className="mt-2.5 block px-1 text-[0.875rem] text-fg-soft group-hover:text-fg">{e.title}</span>
            </button>
          </li>
        );
      })}
    </GalleryController>
  );
}
