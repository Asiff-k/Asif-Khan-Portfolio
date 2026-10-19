"use client";

import { useEffect, useRef } from "react";
import { ease, gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * Oversized name across the bottom of the footer. Letters are split on the
 * server (no DOM changes on hydration) and rise out of a mask, one after
 * another, when the footer scrolls in. Decorative: the name is already in the
 * footer as text. Visible as-is without JavaScript and with reduced motion.
 */
export function FooterName({ name }: { name: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
    gsap.set(letters, { yPercent: 110 });
    const t = ScrollTrigger.create({
      trigger: el,
      start: "top 95%",
      once: true,
      onEnter: () => gsap.to(letters, { yPercent: 0, duration: 1.2, stagger: 0.06, ease: ease.enter }),
    });
    return () => {
      t.kill();
      gsap.set(letters, { clearProps: "transform" });
    };
  }, [reduce]);

  return (
    <p
      ref={ref}
      aria-hidden
      className="font-display flex flex-wrap gap-x-[0.22em] text-[clamp(3.5rem,19vw,8rem)] leading-[0.82] font-extrabold tracking-[-0.045em] uppercase select-none md:flex-nowrap md:justify-between md:text-[clamp(3rem,8.6vw,11rem)]"
    >
      {name.split(" ").map((word) => (
        <span key={word} className="inline-flex overflow-hidden pb-[0.06em]">
          {[...word].map((ch, i) => (
            <span key={i} data-letter className="inline-block">
              {ch}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
