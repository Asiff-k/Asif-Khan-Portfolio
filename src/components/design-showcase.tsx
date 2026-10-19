"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useFinePointer, useIsNarrow, usePrefersReducedMotion } from "@/lib/use-media";
import { DesignGallery, type GalleryEntry } from "./design-gallery";

// Loaded only when the section comes near, so @use-gesture stays out of the first load.
const DomeGallery = dynamic(() => import("./vendor/dome-gallery"), { ssr: false });

const optimized = (src: string, width: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

type View = "dome" | "grid";

/**
 * Design section: a draggable 3D dome, pinned at full viewport, for mouse users
 * at 768px and up; the filterable grid on touch, narrow screens and with
 * reduced motion. A button under the dome switches between the two. Until the
 * visitor picks, CSS decides which one shows, so nothing jumps on hydration.
 *
 * TODO(asset): before/after process pairs for daisyUI diff sliders
 * (public/design/process/<name>-raw.jpg and <name>-final.jpg). None exist yet,
 * so the sliders are not rendered.
 */
export function DesignShowcase({ entries, categories }: { entries: GalleryEntry[]; categories: readonly string[] }) {
  const [choice, setChoice] = useState<View | null>(null);
  const [near, setNear] = useState(false);
  const slot = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const narrow = useIsNarrow();
  const domeByDefault = fine && !narrow && !reduce;
  const view: View = choice ?? (domeByDefault ? "dome" : "grid");
  const mountDome = near && view === "dome";
  const pin = mountDome && domeByDefault;

  // Before a choice, CSS shows the dome slot only where the dome is the default.
  const cssView = choice ?? (reduce ? "grid" : null);
  const slotClass = cssView === "dome" ? "" : cssView === "grid" ? "hidden" : "fm-only";
  const gridClass = cssView === "grid" ? "" : cssView === "dome" ? "hidden" : "fm-fallback";

  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hold the dome in place for half a screen of scrolling (desktop only), then
  // re-measure every scroll trigger, since the page height has changed.
  useEffect(() => {
    const el = slot.current;
    let t: ScrollTrigger | undefined;
    if (pin && el) {
      t = ScrollTrigger.create({ trigger: el, pin: true, start: "top 64px", end: "+=50%" });
      ScrollTrigger.sort();
    }
    ScrollTrigger.refresh();
    return () => {
      t?.kill();
      ScrollTrigger.refresh();
    };
  }, [pin, view]);

  return (
    <div>
      {/* The pin wraps the slot in a spacer; this div keeps React's tree stable around it. */}
      <div className={slotClass}>
        <div
          ref={slot}
          data-cursor="Drag"
          className="relative -mx-5 h-[calc(100svh-4rem)] min-h-[520px] md:-mx-10 min-[75rem]:-mx-16"
        >
          {mountDome && (
            <DomeGallery
              images={entries.map((e) => ({ src: optimized(e.src, 640), full: optimized(e.src, 1080), alt: e.title }))}
              label="Design pieces on a 3D dome. Arrow keys turn it, Enter opens the piece in front, Escape closes it."
              fit={0.6}
              grayscale={false}
              overlayBlurColor="#181a1d"
              imageBorderRadius="0px"
              openedImageBorderRadius="0px"
              openedImageWidth="min(80vw, 420px)"
              openedImageHeight="min(80vh, 560px)"
              dragDampening={2}
              maxVerticalRotationDeg={5}
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={() => setChoice(view === "dome" ? "grid" : "dome")}
          className="t-label pressable border border-line-strong px-4 py-3 hover:bg-fg hover:text-on-fg"
        >
          {view === "dome" ? "Show all pieces as a grid" : "View as a 3D dome"}
        </button>
        {view === "dome" && (
          <span className="t-stamp text-fg-muted">Drag or use the arrow keys to turn. Click or press Enter to open a piece.</span>
        )}
      </div>

      <div className={`${gridClass} mt-8`}>
        <DesignGallery entries={entries} categories={categories} />
      </div>
    </div>
  );
}
