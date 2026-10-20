"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  createVelocityTracker,
  project,
  rubberband,
  springDefault,
  springMomentum,
} from "@/lib/motion";
import { ArrowLeft, ArrowRight, CloseIcon } from "./icons";

export type LightboxItem = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  title: string;
  meta?: string;
};

type Props = {
  items: LightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
  /** Called once the close animation has finished. */
  onClosed: () => void;
  /** The thumbnail for an item, used to open from and close back into it. */
  getOrigin: (index: number) => HTMLElement | null;
  label: string;
};

type Box = { w: number; h: number; left: number; top: number };

function fitBox(item: LightboxItem, vw: number, vh: number): Box {
  const narrow = vw < 768;
  const padX = narrow ? 16 : 88;
  const top = 64;
  const bottom = narrow ? 112 : 88;
  const maxW = vw - padX * 2;
  const maxH = vh - top - bottom;
  // Never scale past the image's real size.
  const s = Math.min(maxW / item.width, maxH / item.height, 1);
  const w = Math.round(item.width * s);
  const h = Math.round(item.height * s);
  return { w, h, left: Math.round((vw - w) / 2), top: Math.round(top + (maxH - h) / 2) };
}

function useViewport() {
  const [size, setSize] = useState(() =>
    typeof window === "undefined" ? { w: 1280, h: 800 } : { w: window.innerWidth, h: window.innerHeight },
  );
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function visibleRect(el: HTMLElement | null) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
  return onScreen ? r : null;
}

export function Lightbox({ items, index, onIndexChange, onClosed, getOrigin, label }: Props) {
  const reduce = useReducedMotion();
  const viewport = useViewport();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Horizontal position of the prev/current/next strip.
  const trackX = useMotionValue(0);
  // Transform of the current image (open, close and vertical drag).
  const slideX = useMotionValue(0);
  const slideY = useMotionValue(0);
  const slideScale = useMotionValue(1);
  const slideOpacity = useMotionValue(1);
  const scrim = useMotionValue(0);

  const closing = useRef(false);
  const pendingShift = useRef(0);
  const pendingVelocity = useRef(0);

  const item = items[index];
  const box = fitBox(item, viewport.w, viewport.h);
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  // Open from the thumbnail.
  useLayoutEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const target = fitBox(items[index], vw, vh);
    const origin = visibleRect(getOrigin(index));
    if (reduce || !origin) {
      slideOpacity.set(0);
      animate(slideOpacity, 1, { duration: 0.18 });
      animate(scrim, 1, { duration: 0.18 });
      return;
    }
    slideX.set(origin.left + origin.width / 2 - (target.left + target.w / 2));
    slideY.set(origin.top + origin.height / 2 - (target.top + target.h / 2));
    slideScale.set(origin.width / target.w);
    animate(slideX, 0, springDefault);
    animate(slideY, 0, springDefault);
    animate(slideScale, 1, springDefault);
    animate(scrim, 1, springDefault);
    // Runs once on open; later index changes are handled by navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After moving to a neighbour, re-centre the strip so the motion is continuous.
  useLayoutEffect(() => {
    if (pendingShift.current === 0) return;
    trackX.set(trackX.get() + pendingShift.current);
    pendingShift.current = 0;
    if (reduce) {
      trackX.set(0);
      return;
    }
    const v = pendingVelocity.current;
    animate(trackX, 0, { ...(Math.abs(v) > 300 ? springMomentum : springDefault), velocity: v });
  }, [index, reduce, trackX]);

  const close = useCallback(
    (velocityY = 0) => {
      if (closing.current) return;
      closing.current = true;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const current = fitBox(items[index], vw, vh);
      const origin = visibleRect(getOrigin(index));
      animate(trackX, 0, springDefault);

      let done: Promise<unknown>;
      if (reduce) {
        done = Promise.all([
          animate(slideOpacity, 0, { duration: 0.15 }),
          animate(scrim, 0, { duration: 0.15 }),
        ]);
      } else if (origin) {
        const s = origin.width / current.w;
        done = Promise.all([
          animate(slideX, origin.left + origin.width / 2 - (current.left + current.w / 2), springDefault),
          animate(slideY, origin.top + origin.height / 2 - (current.top + current.h / 2), {
            ...springDefault,
            velocity: velocityY,
          }),
          animate(slideScale, s, springDefault),
          animate(scrim, 0, springDefault),
        ]);
      } else {
        done = Promise.all([
          animate(slideOpacity, 0, { duration: 0.2 }),
          animate(slideScale, 0.92, springDefault),
          animate(scrim, 0, springDefault),
        ]);
      }
      done.then(onClosed);
    },
    [getOrigin, index, items, onClosed, reduce, scrim, slideOpacity, slideScale, slideX, slideY, trackX],
  );

  const go = useCallback(
    (dir: 1 | -1, velocity = 0) => {
      if (closing.current) return;
      const allowed = dir === 1 ? index < items.length - 1 : index > 0;
      if (!allowed) {
        animate(trackX, 0, springMomentum);
        return;
      }
      pendingShift.current = dir * window.innerWidth;
      pendingVelocity.current = velocity;
      onIndexChange(index + dir);
    },
    [index, items.length, onIndexChange, trackX],
  );

  // Keyboard: arrows to move, Escape to close, Tab stays inside the dialog.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])")];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go]);

  // Lock page scroll and move focus into the dialog.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  // Pointer gestures: horizontal swipe between images, vertical drag to dismiss.
  const gesture = useRef({
    active: false,
    id: 0,
    startX: 0,
    startY: 0,
    axis: null as "x" | "y" | null,
    trackStart: 0,
    yStart: 0,
    moved: false,
    tracker: createVelocityTracker(),
  });

  function onPointerDown(e: React.PointerEvent) {
    if (closing.current || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const g = gesture.current;
    g.active = true;
    g.id = e.pointerId;
    g.startX = e.clientX;
    g.startY = e.clientY;
    g.axis = null;
    g.moved = false;
    // Grab from wherever things are right now, mid-animation included.
    trackX.stop();
    slideY.stop();
    slideScale.stop();
    scrim.stop();
    g.trackStart = trackX.get();
    g.yStart = slideY.get();
    g.tracker.reset();
    g.tracker.add(e.clientX, e.clientY, e.timeStamp);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const g = gesture.current;
    if (!g.active || e.pointerId !== g.id) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    g.tracker.add(e.clientX, e.clientY, e.timeStamp);
    if (!g.axis) {
      if (Math.hypot(dx, dy) < 10) return;
      g.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      g.moved = true;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (g.axis === "x") {
      const next = g.trackStart + dx;
      const pastEdge = (next > 0 && !hasPrev) || (next < 0 && !hasNext);
      trackX.set(pastEdge ? rubberband(next, vw) : next);
    } else {
      const y = g.yStart + dy;
      slideY.set(y);
      const progress = Math.min(Math.abs(y) / (vh * 0.5), 1);
      slideScale.set(1 - progress * 0.2);
      scrim.set(1 - progress * 0.75);
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    const g = gesture.current;
    if (!g.active || e.pointerId !== g.id) return;
    g.active = false;
    const v = g.tracker.velocity();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (g.axis === "x") {
      const landing = trackX.get() + project(v.x);
      if (landing < -vw * 0.25 && hasNext) go(1, v.x);
      else if (landing > vw * 0.25 && hasPrev) go(-1, v.x);
      else animate(trackX, 0, { ...(Math.abs(v.x) > 300 ? springMomentum : springDefault), velocity: v.x });
    } else if (g.axis === "y") {
      const landing = slideY.get() + project(v.y);
      if (Math.abs(landing) > vh * 0.22) {
        close(v.y);
      } else {
        const spring = Math.abs(v.y) > 300 ? springMomentum : springDefault;
        animate(slideY, 0, { ...spring, velocity: v.y });
        animate(slideScale, 1, springDefault);
        animate(scrim, 1, springDefault);
      }
    }
  }

  function onBackdropClick(e: React.MouseEvent) {
    if (gesture.current.moved) return;
    if ((e.target as HTMLElement).closest("[data-slide], button")) return;
    close();
  }

  const neighbours = [index - 1, index, index + 1].filter((i) => i >= 0 && i < items.length);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
      aria-label={label}
      className="fixed inset-0 z-50 touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onBackdropClick}
    >
      <motion.div aria-hidden className="absolute inset-0 bg-[rgba(255,255,255,0.97)]" style={{ opacity: scrim }} />

      <motion.div className="absolute inset-0" style={{ x: trackX }}>
        {neighbours.map((i) => {
          const it = items[i];
          const b = i === index ? box : fitBox(it, viewport.w, viewport.h);
          const offset = (i - index) * viewport.w;
          return (
            <Slide
              key={it.src}
              item={it}
              box={b}
              offset={offset}
              current={i === index}
              x={slideX}
              y={slideY}
              scale={slideScale}
              opacity={slideOpacity}
            />
          );
        })}
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-x-0 top-0 flex h-16 items-center justify-between page-x" style={{ opacity: scrim }}>
        <p className="t-stamp text-carbon-muted" aria-live="polite">
          {index + 1} / {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => close()}
          className="t-stamp pressable pointer-events-auto -mr-2 inline-flex items-center gap-2 px-2 py-3 text-carbon-text hover:text-mint"
        >
          <CloseIcon /> Close
        </button>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex min-h-20 items-center justify-between gap-4 page-x pb-4"
        style={{ opacity: scrim }}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!hasPrev}
          aria-label="Previous image"
          className="pressable pointer-events-auto inline-flex size-11 items-center justify-center border border-carbon-rule text-carbon-text hover:border-mint hover:text-mint disabled:opacity-30"
        >
          <ArrowLeft />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-medium text-carbon-text">{item.title}</p>
          {item.meta && <p className="t-stamp mt-1 text-carbon-muted">{item.meta}</p>}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={!hasNext}
          aria-label="Next image"
          className="pressable pointer-events-auto inline-flex size-11 items-center justify-center border border-carbon-rule text-carbon-text hover:border-mint hover:text-mint disabled:opacity-30"
        >
          <ArrowRight />
        </button>
      </motion.div>
    </div>
  );
}

function Slide({
  item,
  box,
  offset,
  current,
  x,
  y,
  scale,
  opacity,
}: {
  item: LightboxItem;
  box: Box;
  offset: number;
  current: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      data-slide
      className="absolute bg-carbon will-change-transform"
      style={{
        left: box.left + offset,
        top: box.top,
        width: box.w,
        height: box.h,
        ...(current ? { x, y, scale, opacity } : {}),
      }}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        sizes={`${box.w}px`}
        placeholder="blur"
        blurDataURL={item.blurDataURL}
        draggable={false}
        className="object-contain"
      />
    </motion.div>
  );
}
