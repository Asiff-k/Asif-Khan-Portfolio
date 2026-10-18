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
          }),
      });
      cleanups.push(() => {
        t.kill();
        gsap.set(items, { clearProps: "transform,opacity,clipPath" });
      });
    });

    ScrollTrigger.refresh();
    return () => cleanups.forEach((c) => c());
  }, [pathname, reduce]);

  return null;
}
