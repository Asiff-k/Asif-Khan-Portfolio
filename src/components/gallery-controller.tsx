"use client";

import dynamic from "next/dynamic";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { GalleryEntry } from "./design-gallery";

// The lightbox (and the motion library behind its gestures) loads on first use,
// prefetched when the pointer or keyboard focus reaches the thumbnails.
const Lightbox = dynamic(() => import("./lightbox").then((m) => m.Lightbox), { ssr: false });
const prefetchLightbox = () => void import("./lightbox");

const ALL = "All";

/**
 * Filters, live count and lightbox for the server-rendered design grid.
 * Filtering sets data-filter on the list and CSS hides the other categories;
 * one delegated click handler opens the lightbox.
 */
export function GalleryController({
  entries,
  categories,
  children,
}: {
  entries: GalleryEntry[];
  categories: readonly string[];
  children: React.ReactNode;
}) {
  const [filter, setFilter] = useState<string>(ALL);
  const [open, setOpen] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const groupId = useId();

  // Entries shown under the current filter, with their index in the full list.
  const visible = useMemo(
    () => entries.map((e, i) => ({ e, i })).filter(({ e }) => filter === ALL || e.category === filter),
    [entries, filter],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>([[ALL, entries.length]]);
    for (const e of entries) map.set(e.category, (map.get(e.category) ?? 0) + 1);
    return map;
  }, [entries]);

  const thumb = useCallback(
    (v: number) => list.current?.querySelector<HTMLElement>(`[data-index="${visible[v]?.i}"]`) ?? null,
    [visible],
  );

  function onListClick(ev: React.MouseEvent<HTMLUListElement>) {
    const button = (ev.target as Element).closest<HTMLElement>("[data-index]");
    if (!button) return;
    const v = visible.findIndex(({ i }) => i === Number(button.dataset.index));
    if (v >= 0) setOpen(v);
  }

  function onClosed() {
    if (open !== null) thumb(open)?.focus({ preventScroll: true });
    setOpen(null);
  }

  // One rule per category, plus hiding the thumbnail that the lightbox grew from.
  const css =
    categories
      .map((c) => `.gallery-list[data-filter="${c}"] > li:not([data-category="${c}"]) { display: none; }`)
      .join("\n") +
    (open !== null ? `\n.gallery-list [data-index="${visible[open]?.i}"] > span:first-child { opacity: 0; }` : "");

  return (
    <div>
      <style>{css}</style>
      <div
        role="group"
        aria-labelledby={`${groupId}-label`}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
      >
        <span id={`${groupId}-label`} className="sr-only">
          Filter by category
        </span>
        {[ALL, ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className="chip shrink-0"
          >
            {c} <span className="tabular-nums">{counts.get(c) ?? 0}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "piece" : "pieces"}
      </p>

      <ul
        ref={list}
        data-filter={filter}
        className="gallery-list mt-8 columns-2 gap-4 md:columns-3 md:gap-6 xl:columns-4"
        onClick={onListClick}
        onPointerEnter={prefetchLightbox}
        onTouchStart={prefetchLightbox}
        onFocus={prefetchLightbox}
      >
        {children}
      </ul>

      {open !== null && (
        <Lightbox
          items={visible.map(({ e }) => e)}
          index={open}
          onIndexChange={setOpen}
          onClosed={onClosed}
          getOrigin={thumb}
          label="Design gallery"
        />
      )}
    </div>
  );
}
