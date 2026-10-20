"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register once on the client. All GSAP plugins ship in the public package.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Motion language: weighted entrances, smooth scrubs, nothing bouncy.
export const ease = {
  enter: "expo.out",
  enterSoft: "power4.out",
  scrub: "power2.inOut",
} as const;

let lastScroll = 0;
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true, capture: true });
}

/**
 * ScrollTrigger.refresh() puts the scroll position back where it was when the
 * refresh started, which cancels a smooth scroll in progress (an anchor jump
 * would stop short). Refresh now if the page is still, otherwise once
 * scrolling ends.
 */
export function refreshWhenSettled() {
  if (performance.now() - lastScroll > 200) {
    ScrollTrigger.refresh();
    return;
  }
  const onEnd = () => {
    ScrollTrigger.removeEventListener("scrollEnd", onEnd);
    ScrollTrigger.refresh();
  };
  ScrollTrigger.addEventListener("scrollEnd", onEnd);
}

export { gsap, ScrollTrigger, SplitText };
