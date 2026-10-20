"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

type Sticker = { text: string; color: string; rotate: number; at: number; className: string };

/**
 * Large statement where each word turns from light grey to near-black as it
 * scrolls through the middle of the screen, with two small tilted sticker
 * labels that pop in along the way. Words are split on the server, so the
 * text is complete without JavaScript (and fully dark with reduced motion).
 */
export function AboutStatement({ text, stickers }: { text: string; stickers: Sticker[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const ws = el.querySelectorAll<HTMLElement>("[data-word]");
    const tags = el.querySelectorAll<HTMLElement>("[data-sticker]");
    gsap.set(ws, { color: "#c9c9c5" });
    gsap.set(tags, { scale: 0, opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
    });
    tl.to(ws, { color: "#121316", stagger: 0.12, duration: 0.6, ease: "none" }, 0);
    tags.forEach((t) => {
      const at = Number(t.dataset.at) * ws.length * 0.12;
      tl.to(t, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" }, at);
    });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([...ws, ...tags], { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  }, [reduce]);

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl py-6 text-center">
      <p className="font-display text-[clamp(1.6rem,1.05rem+2.3vw,3rem)] leading-[1.18] font-medium tracking-[-0.025em] text-[#121316] [text-shadow:none]">
        {words.map((w, i) => (
          <span key={i} data-word>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
      {stickers.map((s) => (
        <span
          key={s.text}
          data-sticker
          data-at={s.at}
          aria-hidden
          className={`absolute inline-flex rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap text-white shadow-[0_8px_20px_rgb(18_19_22/0.18)] ${s.className}`}
          style={{ background: s.color, rotate: `${s.rotate}deg` }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
