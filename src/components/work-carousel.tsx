"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "./icons";

export type CarouselItem = { href: string; title: string; line: string; kind: string; image: string; alt: string };

/**
 * Curved carousel for Selected work: the active card stands upright and large
 * in the centre, neighbours tilt and drop along an arc, with a dotted arc line
 * behind. It loops endlessly. Drag or swipe (with momentum and a soft snap),
 * arrow buttons, or the Left/Right keys move it. Position is a float eased every frame, so motion is
 * continuous. Reduced motion jumps straight to the card.
 */
// Server-rendered starting place of card i (same maths as layout, at position 0).
function initialStyle(i: number, n: number): React.CSSProperties {
  let o = i % n;
  if (o > n / 2) o -= n;
  const a = Math.abs(o);
  return {
    transform: `translate3d(calc(-50% + ${o * 440}px), ${a * a * 34 + a * 18}px, 0) rotate(${o * 9}deg) scale(${1 - Math.min(a, 3) * 0.1})`,
    opacity: a > 2.6 ? 0 : Math.min(1, 1.15 - a * 0.18),
    zIndex: 100 - Math.round(a * 10),
    visibility: a > 2.9 ? "hidden" : "visible",
  };
}

export function WorkCarousel({ items }: { items: CarouselItem[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const pos = useRef(0);
  const target = useRef(0);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const drag = useRef<{ x: number; start: number; t: number; v: number; moved: boolean } | null>(null);

  const layout = useCallback(() => {
    const w = stage.current?.clientWidth ?? 1200;
    const spacing = w < 640 ? w * 0.8 : Math.min(w * 0.36, 440);
    cards.current.forEach((el, i) => {
      if (!el) return;
      // Endless loop: each card sits at its nearest offset from the current position.
      let o = (((i - pos.current) % n) + n) % n;
      if (o > n / 2) o -= n;
      const a = Math.abs(o);
      const x = o * spacing;
      const y = a * a * 34 + a * 18;
      const r = o * 9;
      const s = 1 - Math.min(a, 3) * 0.1;
      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      el.style.opacity = a > 2.6 ? "0" : String(Math.min(1, 1.15 - a * 0.18));
      el.style.zIndex = String(100 - Math.round(a * 10));
      el.style.visibility = a > 2.9 ? "hidden" : "visible";
    });
  }, [n]);

  const run = useCallback(() => {
    if (raf.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!drag.current) {
        const k = reduced ? 1 : 1 - Math.exp(-dt / 0.14);
        pos.current += (target.current - pos.current) * k;
      }
      layout();
      if (drag.current || Math.abs(target.current - pos.current) > 0.001) {
        raf.current = requestAnimationFrame(step);
      } else {
        pos.current = target.current;
        layout();
        raf.current = 0;
      }
    };
    raf.current = requestAnimationFrame(step);
  }, [layout]);

  // i is any integer position; the active card is i modulo n.
  const go = useCallback(
    (i: number) => {
      target.current = i;
      setActive(((i % n) + n) % n);
      run();
    },
    [n, run],
  );
  // Move to card i by the shortest way round.
  const goToCard = (i: number) => {
    const cur = Math.round(target.current);
    let d = (((i - cur) % n) + n) % n;
    if (d > n / 2) d -= n;
    go(cur + d);
  };

  useEffect(() => {
    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf.current);
    };
  }, [layout]);

  const spacing = () => {
    const w = stage.current?.clientWidth ?? 1200;
    return w < 640 ? w * 0.8 : Math.min(w * 0.36, 440);
  };

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, start: pos.current, t: performance.now(), v: 0, moved: false };
    run();
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      // Capture only once it is a real drag, so a plain click still reaches the card's link.
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    const now = performance.now();
    const p = d.start - dx / spacing();
    d.v = (p - pos.current) / Math.max(0.001, (now - d.t) / 1000);
    d.t = now;
    pos.current = p;
  }
  function onPointerUp() {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    // Momentum: carry on in the flick direction, then snap to a card.
    go(Math.round(pos.current + Math.max(-1.5, Math.min(1.5, d.v * 0.18))));
  }
  // A drag must not count as a click on the card's link.
  function onClickCapture(e: React.MouseEvent) {
    if (justDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  const justDragged = useRef(false);
  useEffect(() => {
    const up = () => {
      justDragged.current = !!drag.current?.moved;
      setTimeout(() => (justDragged.current = false), 0);
    };
    window.addEventListener("pointerup", up, true);
    return () => window.removeEventListener("pointerup", up, true);
  }, []);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(Math.round(target.current) + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(Math.round(target.current) - 1);
        }
      }}
    >
      <div
        ref={stage}
        className="relative -mx-5 h-[clamp(470px,62vw,640px)] cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing md:-mx-10 min-[75rem]:-mx-16"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        data-cursor="Drag"
      >
        {/* Dotted arc behind the cards. */}
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-[22%] h-[80%] w-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path d="M-40 360 Q500 -60 1040 360" fill="none" stroke="#121316" strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="0.5 11" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {items.map((it, i) => (
          <article
            key={it.href}
            ref={(el) => {
              cards.current[i] = el;
            }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}: ${it.title}`}
            className="absolute top-6 left-1/2 w-[min(78vw,400px)] origin-bottom will-change-transform"
            style={initialStyle(i, n)}
          >
            <div className="card overflow-hidden p-3">
              <div className="aspect-[16/11] overflow-hidden rounded-tile bg-[#f0f0ed]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.alt} draggable={false} loading="lazy" decoding="async" className="size-full object-cover object-top" />
              </div>
              <div className="px-2 pt-4 pb-2">
                <p className="text-[0.75rem] font-medium tracking-wide text-[#5d5e62] uppercase">{it.kind}</p>
                <h3 className="font-display mt-1 text-[1.375rem] leading-tight font-medium tracking-[-0.02em]">{it.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-[0.9375rem] text-[#3d3e42]">{it.line}</p>
                <Link
                  href={it.href}
                  tabIndex={i === active ? 0 : -1}
                  className="btn-secondary mt-4 !py-2 !text-[0.875rem]"
                  onFocus={() => goToCard(i)}
                >
                  View project <ArrowRight />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(Math.round(target.current) - 1)} aria-label="Previous project" className="btn-secondary !p-3">
          <ArrowLeft />
        </button>
        <p className="min-w-16 text-center font-mono text-[0.8125rem] text-[#5d5e62]" aria-live="polite">
          {active + 1} / {n}
        </p>
        <button type="button" onClick={() => go(Math.round(target.current) + 1)} aria-label="Next project" className="btn-primary !p-3">
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
