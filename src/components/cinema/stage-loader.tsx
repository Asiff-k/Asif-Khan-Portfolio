"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-media";

// three.js, R3F and the shaders live only in this lazy chunk.
const Stage = dynamic(() => import("./stage"), { ssr: false });

/**
 * Mounts the particle stage on the home page after first paint, once the
 * browser is idle. Reduced motion gets a static poster instead.
 */
export function StageLoader() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (pathname !== "/" || reduce) return;
    let idle = 0;
    const raf = requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(() => setGo(true), { timeout: 2000 });
      } else {
        idle = window.setTimeout(() => setGo(true), 300);
      }
    });
    return () => {
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
