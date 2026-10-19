"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { stage, type FormationKey } from "./stage-controller";

// Section -> formation transitions, scrubbed as each section scrolls in:
// Hero NAME, Skills/Work FIELD, Design CAN, AI data SPHERE, Experience FIELD
// (a reading section, so the particles step back), Contact ORB.
const beats: { selector: string; from: FormationKey; to: FormationKey }[] = [
  { selector: "section[aria-labelledby=skills-title]", from: "name", to: "field" },
  { selector: "#design", from: "field", to: "can" },
  { selector: "#ai-data", from: "can", to: "sphere" },
  { selector: "#experience", from: "sphere", to: "field" },
  { selector: "#contact", from: "field", to: "orb" },
];

export function ScrollWorld() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (pathname !== "/" || reduce) return;
    const active = beats
      .map((b) => ({ ...b, el: document.querySelector(b.selector) }))
      .filter((b): b is (typeof beats)[number] & { el: Element } => b.el !== null);
    if (!active.length) return;

    // The particles always show the latest beat that has started, so a fast
    // jump across several sections (or a reload mid-page) lands on the right
    // formation instead of whichever trigger fired last.
    // Filled as triggers are created: create() can fire onUpdate straight
    // away when the page loads mid-scroll (e.g. /#design).
    const triggers: ScrollTrigger[] = [];
    for (const { el } of active) {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "top 15%",
          onUpdate: () => apply(),
          onToggle: () => apply(),
        }),
      );
    }
    function apply() {
      if (triggers.length < active.length) return;
      for (let i = triggers.length - 1; i >= 0; i--) {
        const t = triggers[i];
        if (t.progress > 0 || t.isActive) {
          stage.scrub(active[i].from, active[i].to, t.progress);
          return;
        }
      }
      // Above the first beat: hold the hero formation, unless the hero morph
      // is still assembling it.
      if (window.scrollY > 4) stage.scrub(active[0].from, active[0].to, 0);
    }
    const offReady = stage.onReady(() => {
      if (triggers.some((t) => t.progress > 0)) apply();
    });
    if (stage.ready() && triggers.some((t) => t.progress > 0)) apply();

    return () => {
      offReady();
      triggers.forEach((t) => t.kill());
    };
  }, [pathname, reduce]);

  return null;
}
