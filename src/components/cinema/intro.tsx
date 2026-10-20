"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { stage } from "./stage-controller";

/**
 * Marks the page as running JavaScript (html.js, used to swap client-only
 * views in without leaving no-JS visitors an empty box), and decides before
 * first paint whether the letterbox intro plays: home page,
 * first visit this session, wide screen, motion allowed. Runs as an inline
 * script so the headline is never hidden when JavaScript is off.
 */
export const introScript = `try{var d=document.documentElement;d.classList.add("js");if(location.pathname==="/"&&!sessionStorage.getItem("intro-seen")&&matchMedia("(min-width: 768px)").matches&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro")}}catch(e){}`;

/** Letterbox bars retract, then the hero headline rises line by line (at most 2s). */
export function HeroIntro() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const root = document.documentElement;
    if (!root.classList.contains("intro")) {
      stage.morph("name", 2.6);
      return;
    }
    const title = document.querySelector<HTMLElement>("[data-hero-title]");
    const bars = document.querySelectorAll<HTMLElement>(".intro-bar");
    if (!title) {
      root.classList.remove("intro");
      return;
    }
    const split = SplitText.create(title, { type: "lines", mask: "lines" });
    gsap.set(split.lines, { yPercent: 110 });
    root.classList.replace("intro", "intro-playing");
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}

    const tl = gsap.timeline({
      onComplete() {
        root.classList.remove("intro-playing");
        split.revert();
      },
    });
    tl.call(() => stage.morph("name", 2.6), [], 0.1)
      .to(bars[0], { scaleY: 0, transformOrigin: "50% 0%", duration: 1.2, ease: "expo.out" }, 0.1)
      .to(bars[1], { scaleY: 0, transformOrigin: "50% 100%", duration: 1.2, ease: "expo.out" }, 0.1)
      .to(split.lines, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.5);

    return () => {
      tl.kill();
      split.revert();
      root.classList.remove("intro", "intro-playing");
    };
  }, [pathname]);

  return null;
}
