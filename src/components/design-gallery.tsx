"use client";

import Image from "next/image";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { Lightbox, type LightboxItem } from "./lightbox";

export type GalleryEntry = LightboxItem & { category: string };

type Props = {
  entries: GalleryEntry[];
  categories: readonly string[];
};

const ALL = "All";

export function DesignGallery({ entries, categories }: Props) {
  const [filter, setFilter] = useState<string>(ALL);
  const [open, setOpen] = useState<number | null>(null);
  const thumbs = useRef(new Map<number, HTMLButtonElement>());
  const groupId = useId();

  const visible = useMemo(
    () => (filter === ALL ? entries : entries.filter((e) => e.category === filter)),
    [entries, filter],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>([[ALL, entries.length]]);
    for (const e of entries) map.set(e.category, (map.get(e.category) ?? 0) + 1);
    return map;
  }, [entries]);

  const getOrigin = useCallback((i: number) => thumbs.current.get(i) ?? null, []);

  function onClosed() {
    if (open !== null) thumbs.current.get(open)?.focus({ preventScroll: true });
    setOpen(null);
  }

  return (
    <div>
      <div
        role="group"
        aria-labelledby={`${groupId}-label`}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
      >
        <span id={`${groupId}-label`} className="sr-only">
          Filter by category
        </span>
        {[ALL, ...categories].map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c)}
              className="t-label pressable shrink-0 border border-line bg-surface px-3 py-2 text-accent hover:border-accent aria-pressed:border-line-strong aria-pressed:bg-fg aria-pressed:text-bg"
            >
              {c} <span className="opacity-70">{counts.get(c) ?? 0}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "piece" : "pieces"}
      </p>

      <ul className="mt-8 columns-2 gap-4 md:columns-3 md:gap-6 xl:columns-4">
        {visible.map((e, i) => (
          <li key={e.src} className="mb-4 break-inside-avoid md:mb-6">
            <button
              ref={(el) => {
                if (el) thumbs.current.set(i, el);
                else thumbs.current.delete(i);
              }}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open ${e.title}`}
              data-cursor="Open"
              className="group pressable block w-full text-left"
            >
              <span
                className="block border border-line bg-surface transition-[border-color] duration-150 group-hover:border-line-strong"
                style={{ opacity: open === i ? 0 : 1 }}
              >
                <Image
                  src={e.src}
                  width={e.width}
                  height={e.height}
                  alt=""
                  sizes="(min-width: 75rem) 22vw, (min-width: 48rem) 30vw, 46vw"
                  placeholder="blur"
                  blurDataURL={e.blurDataURL}
                  className="block h-auto w-full"
                />
              </span>
              <span className="t-stamp mt-2 block text-fg-muted group-hover:text-fg">{e.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox
          items={visible}
          index={open}
          onIndexChange={setOpen}
          onClosed={onClosed}
          getOrigin={getOrigin}
          label="Design gallery"
        />
      )}
    </div>
  );
}
