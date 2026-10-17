"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Lightbox, type LightboxItem } from "./lightbox";

export type ShotEntry = LightboxItem & { tall?: boolean; mobile?: boolean };

export function ProjectShots({ shots, title }: { shots: ShotEntry[]; title: string }) {
  const viewable = shots.filter((s) => !s.tall);
  const [open, setOpen] = useState<number | null>(null);
  const thumbs = useRef(new Map<number, HTMLButtonElement>());
  const getOrigin = useCallback((i: number) => thumbs.current.get(i) ?? null, []);
  function onClosed() {
    if (open !== null) thumbs.current.get(open)?.focus({ preventScroll: true });
    setOpen(null);
  }

  return (
    <>
      <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
        {shots.map((shot) => {
          if (shot.tall) {
            return (
              <li key={shot.src} className="md:col-span-2">
                <figure>
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`${shot.title}, scrollable`}
                    className="h-[70vh] max-h-[52rem] overflow-y-auto overscroll-contain border border-rule bg-stone-deep"
                  >
                    <Image
                      src={shot.src}
                      width={shot.width}
                      height={shot.height}
                      alt={`${title}: ${shot.title}`}
                      sizes="(min-width: 75rem) 1100px, 100vw"
                      unoptimized
                      className="block h-auto w-full"
                    />
                  </div>
                  <figcaption className="t-stamp mt-3 text-muted">{shot.title} · scroll to see the whole page</figcaption>
                </figure>
              </li>
            );
          }
          const i = viewable.indexOf(shot);
          const first = i === 0;
          return (
            <li key={shot.src} className={first && !shot.mobile ? "md:col-span-2" : shot.mobile ? "max-w-xs" : ""}>
              <figure>
                <button
                  ref={(el) => {
                    if (el) thumbs.current.set(i, el);
                    else thumbs.current.delete(i);
                  }}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Enlarge: ${shot.title}`}
                  className="group pressable block w-full border border-rule bg-stone-deep hover:border-ink"
                  style={{ opacity: open === i ? 0 : 1 }}
                >
                  <Image
                    src={shot.src}
                    width={shot.width}
                    height={shot.height}
                    alt={`${title}: ${shot.title}`}
                    sizes={first ? "(min-width: 75rem) 1100px, 100vw" : "(min-width: 48rem) 50vw, 100vw"}
                    placeholder="blur"
                    blurDataURL={shot.blurDataURL}
                    preload={first}
                    className="block h-auto w-full"
                  />
                </button>
                <figcaption className="t-stamp mt-3 text-muted">{shot.title}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      {open !== null && (
        <Lightbox
          items={viewable}
          index={open}
          onIndexChange={setOpen}
          onClosed={onClosed}
          getOrigin={getOrigin}
          label={`${title} screenshots`}
        />
      )}
    </>
  );
}
