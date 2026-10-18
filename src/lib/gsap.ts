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

export { gsap, ScrollTrigger, SplitText };
