"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

export type SkillSticker = {
  text: string;
  color: string;
  /** Tilt in degrees, between -8 and 8. */
  tilt: number;
  /** The phrase in the statement whose reveal makes this sticker pop in. */
  cue: string;
  /** Desktop placement in the side gutters: which side, and how far down (0 to 1). */
  side: "left" | "right";
  at: number;
};

/**
 * Large statement where each word turns from light grey to near-black as it
 * scrolls through the middle of the screen. Skill stickers (a real list, read
 * once by screen readers) pop in when the reveal reaches their phrase and go
 * back when you scroll up. On desktop they sit in the gutters left and right of
 * the paragraph, so they never cover a word; under 1024px they wrap in a row
 * below it. Words are split on the server, so the text is complete without
 * JavaScript; with reduced motion the text is dark and every sticker shows.
 * The particle field fades out behind this section (data-particles-quiet).
 */
export function AboutStatement({ text, stickers }: { text: string; stickers: SkillSticker[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const ws = [...el.querySelectorAll<HTMLElement>("[data-word]")];
    const items = [...el.querySelectorAll<HTMLElement>("[data-sticker]")];
    const lower = text.toLowerCase();
    // Word index at which each sticker's phrase is fully revealed.
    const cues = stickers.map((s) => {
      const i = lower.indexOf(s.cue.toLowerCase());
      const end = i < 0 ? lower.length : i + s.cue.length;
      return lower.slice(0, end).split(" ").length - 1;
    });

    gsap.set(ws, { color: "#c9c9c5" });
    const pops = items.map((it) =>
      gsap.fromTo(it, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", paused: true }),
    );
    const shown = items.map(() => false);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "bottom 45%",
        scrub: 0.6,
        onUpdate: () => {
          // Words darken one after another; a word counts as revealed once it is
          // more than half dark.
          const revealed = tl.progress() * (ws.length + 4) - 2;
          cues.forEach((c, i) => {
            const on = revealed >= c;
            if (on && !shown[i]) pops[i].play();
            if (!on && shown[i]) pops[i].reverse();
            shown[i] = on;
          });
        },
      },
    });
    tl.to(ws, { color: "#121316", stagger: 0.12, duration: 0.6, ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      pops.forEach((p) => p.kill());
      gsap.set([...ws, ...items], { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  }, [reduce, stickers, text]);

  return (
    <div ref={ref} data-particles-quiet className="relative">
      <p className="font-display relative mx-auto max-w-4xl text-center text-[clamp(1.6rem,1.05rem+2.3vw,3rem)] leading-[1.18] font-medium tracking-[-0.025em] text-[#121316] [text-shadow:none] lg:max-w-[min(56rem,calc(100%-27rem))]">
        {words.map((w, i) => (
          <span key={i} data-word>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
      <ul
        aria-label="Skills"
        className="mt-12 flex flex-wrap justify-center gap-x-5 gap-y-7 px-2 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block"
      >
        {stickers.map((s) => (
          <li
            key={s.text}
            data-sticker
            className={`lg:pointer-events-auto lg:absolute ${s.side === "left" ? "lg:left-0" : "lg:right-0"}`}
            style={{ ["--at" as string]: `${s.at * 100}%` } as React.CSSProperties}
          >
            <span
              className="sticker font-display inline-flex rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap text-white shadow-[0_8px_20px_rgba(18,19,22,0.18)] lg:text-[15px]"
              style={{ background: s.color, ["--tilt" as string]: `${s.tilt}deg` } as React.CSSProperties}
            >
              {s.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
