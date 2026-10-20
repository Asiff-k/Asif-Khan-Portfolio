"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-media";

// three.js, R3F and the shaders live only in this lazy chunk.
const Stage = dynamic(() => import("./stage"), { ssr: false });

/**
 * Mounts the particle stage on the home page after first paint. Mouse devices
 * load it once the browser is idle. Touch devices wait for the first scroll
 * or touch: evaluating three.js costs a phone several hundred milliseconds of
 * main thread, which would otherwise land while the page is still becoming
 * interactive. Reduced motion gets a static poster instead.
 */
export function StageLoader() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (pathname !== "/" || reduce) return;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let idle = 0;
    let raf = 0;
    const start = () => {
      raf = requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === "function") {
          idle = window.requestIdleCallback(() => setGo(true), { timeout: 2000 });
        } else {
          idle = window.setTimeout(() => setGo(true), 300);
        }
      });
    };
    const events = ["scroll", "touchstart", "pointerdown", "keydown"] as const;
    const onFirst = () => {
      events.forEach((e) => window.removeEventListener(e, onFirst));
      start();
    };
    if (!touch || window.scrollY > 0) start();
    else events.forEach((e) => window.addEventListener(e, onFirst, { passive: true, once: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, onFirst));
      cancelAnimationFrame(raf);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [pathname, reduce]);

  if (pathname !== "/") return null;
  if (reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[url(/images/cinema-poster.webp)] bg-cover bg-center opacity-60"
      />
    );
  }
  return go ? <Stage /> : null;
}
