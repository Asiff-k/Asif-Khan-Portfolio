"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ease, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * Entrances for the whole page, applied by data attributes:
 * - [data-reveal="heading"]: lines rise out of a mask (yPercent 110 -> 0).
 * - [data-reveal="image"]: clip-path opens from the bottom while the image
 *   settles from scale 1.12 to 1, like a slow camera dolly.
 * - [data-reveal="item"]: masked rise for cards and timeline entries.
 * - [data-draw]: an SVG line drawn by scroll (stroke-dashoffset scrub).
 * Content is visible without JavaScript; nothing runs for reduced motion.
 */
export function Reveals() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>('[data-reveal="heading"]').forEach((el) => {
      const split = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.set(split.lines, { yPercent: 110 });
      const t = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: ease.enter,
            onComplete: () => split.revert(),
          }),
      });
      cleanups.push(() => {
        t.kill();
        split.revert();
      });
    });

    document.querySelectorAll<HTMLElement>('[data-reveal="image"]').forEach((el) => {
      const img = el.querySelector("img");
      gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
      if (img) gsap.set(img, { scale: 1.12 });
      const t = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: ease.enterSoft });
          if (img) gsap.to(img, { scale: 1, duration: 1.4, ease: ease.enter });
        },
      });
      cleanups.push(() => {
        t.kill();
        gsap.set(el, { clearProps: "clipPath" });
        if (img) gsap.set(img, { clearProps: "scale" });
      });
    });

    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = group.querySelectorAll<HTMLElement>('[data-reveal="item"]');
      if (!items.length) return;
      gsap.set(items, { yPercent: 18, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" });
      const t = ScrollTrigger.create({
        trigger: group,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(items, {
            yPercent: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            stagger: 0.09,
            ease: ease.enter,
            // Drop the finished mask so tilted cards are not clipped at their edges.
            onComplete: () => gsap.set(items, { clearProps: "clipPath" }),
          }),
      });
      cleanups.push(() => {
        t.kill();
        gsap.set(items, { clearProps: "transform,opacity,clipPath" });
      });
    });

    // [data-draw]: an SVG stroke (pathLength 1) that draws as its section scrolls by.
    document.querySelectorAll<SVGPathElement>("[data-draw]").forEach((path) => {
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: ease.scrub,
        scrollTrigger: {
          trigger: path.closest("[data-draw-root]") ?? path,
          start: "top 75%",
          end: "bottom 60%",
          scrub: true,
        },
      });
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" });
      });
    });

    ScrollTrigger.refresh();
    return () => cleanups.forEach((c) => c());
  }, [pathname, reduce]);

  return null;
}
