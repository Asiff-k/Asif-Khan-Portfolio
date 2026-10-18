"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

/** Drives Lenis from the GSAP ticker and feeds its scroll to ScrollTrigger. */
function GsapBridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);
  return null;
}

/**
 * Lenis smooth scrolling for wheel input. Touch scrolling stays native.
 * Turned off entirely for reduced motion.
 */
export function SmoothScroll() {
  const reduce = usePrefersReducedMotion();
  if (reduce) return null;
  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, autoRaf: false, smoothWheel: true, syncTouch: false, anchors: { offset: -72 } }}
    >
      <GsapBridge />
    </ReactLenis>
  );
}
