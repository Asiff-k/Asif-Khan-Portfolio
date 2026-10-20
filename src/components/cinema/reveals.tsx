"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ease, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { onIdle } from "@/lib/idle";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * Entrances for the whole page, applied by data attributes:
 * - [data-reveal="heading"]: lines rise out of a mask (yPercent 110 -> 0).
 * - [data-reveal="image"]: clip-path opens from the bottom while the image
 *   settles from scale 1.12 to 1, like a slow camera dolly.
 * - [data-reveal="item"]: masked rise for cards and timeline entries.
 * - [data-draw]: an SVG line drawn by scroll (stroke-dashoffset scrub).
 * - [data-reveal="fade"]: fades up from an 8px blur to sharp; neighbours that
 *   enter together are staggered.
 * Headings and items also go from blurred to sharp as they rise.
 * Content is visible without JavaScript; nothing runs for reduced motion.
 *
 * Setup waits for an idle moment after hydration, reads every position in one
 * pass before writing any style (no forced layouts in between), leaves alone
 * whatever is already on screen, and splits a heading into lines only when it
 * is about to scroll in.
 */
export function Reveals() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const cleanups: Array<() => void> = [];

    const cancel = onIdle(() => {
      const fold = window.innerHeight;
      const below = (el: Element) => el.getBoundingClientRect().top > fold;

      // Read pass.
      const headings = [...document.querySelectorAll<HTMLElement>('[data-reveal="heading"]')].filter(below);
      const images = [...document.querySelectorAll<HTMLElement>('[data-reveal="image"]')].filter(below);
      const groups = [...document.querySelectorAll<HTMLElement>("[data-reveal-group]")]
        .map((group) => ({ group, items: [...group.querySelectorAll<HTMLElement>('[data-reveal="item"]')] }))
        .filter((g) => g.items.length && below(g.group));
      const paths = [...document.querySelectorAll<SVGPathElement>("[data-draw]")];
      const fades = [...document.querySelectorAll<HTMLElement>('[data-reveal="fade"]')].filter(below);

      // Write pass: initial states.
      for (const el of images) {
        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
        const img = el.querySelector("img");
        if (img) gsap.set(img, { scale: 1.12 });
      }
      for (const { items } of groups) gsap.set(items, { y: 24, opacity: 0, filter: "blur(8px)" });
      gsap.set(fades, { y: 20, opacity: 0, filter: "blur(8px)" });
      for (const path of paths) gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });

      // Triggers.
      for (const el of headings) {
        let split: SplitText | null = null;
        const t = ScrollTrigger.create({
          trigger: el,
          // Split as the heading's top reaches the bottom edge, while it is still out of view.
          start: "top bottom",
          once: true,
          onEnter: () => {
            split = SplitText.create(el, { type: "lines", mask: "lines" });
            gsap.fromTo(
              split.lines,
              { yPercent: 110, filter: "blur(8px)" },
              {
                yPercent: 0,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: 0.08,
                ease: ease.enter,
                delay: 0.1,
                onComplete: () => split?.revert(),
              },
            );
          },
        });
        cleanups.push(() => {
          t.kill();
          split?.revert();
        });
      }

      for (const el of images) {
        const img = el.querySelector("img");
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
      }

      for (const { group, items } of groups) {
        const t = ScrollTrigger.create({
          trigger: group,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(items, {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.1,
              stagger: 0.09,
              ease: ease.enter,
              onComplete: () => gsap.set(items, { clearProps: "filter" }),
            }),
        });
        cleanups.push(() => {
          t.kill();
          gsap.set(items, { clearProps: "transform,opacity,filter" });
        });
      }

      // Fades: batched so elements entering together stagger.
      if (fades.length) {
        const batch = ScrollTrigger.batch(fades, {
          start: "top 90%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              stagger: 0.08,
              ease: ease.enter,
              onComplete: () => gsap.set(els, { clearProps: "filter" }),
            }),
        });
        cleanups.push(() => {
          batch.forEach((t) => t.kill());
          gsap.set(fades, { clearProps: "transform,opacity,filter" });
        });
      }

      for (const path of paths) {
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
      }
    });

    return () => {
      cancel();
      cleanups.forEach((c) => c());
    };
  }, [pathname, reduce]);

  return null;
}
