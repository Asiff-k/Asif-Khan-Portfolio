"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { stage, type FormationKey } from "./stage-controller";

// Section -> formation transitions. Each scrubs over about 80vh as the
// section scrolls in: Hero NAME, Skills/Work FIELD, Design CAN, AI data SPHERE,
// Contact ORB.
const beats: { selector: string; from: FormationKey; to: FormationKey }[] = [
  { selector: "section[aria-labelledby=skills-title]", from: "name", to: "field" },
  { selector: "#design", from: "field", to: "can" },
  { selector: "#ai-data", from: "can", to: "sphere" },
  { selector: "#contact", from: "sphere", to: "orb" },
];

export function ScrollWorld() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (pathname !== "/" || reduce) return;
    const triggers = beats
      .map(({ selector, from, to }) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "+=80%",
          scrub: true,
          onUpdate: (self) => stage.scrub(from, to, self.progress),
          // Hold the end state while the section is on screen.
          onLeave: () => stage.scrub(from, to, 1),
          onLeaveBack: () => stage.scrub(from, to, 0),
        });
      })
      .filter((t) => t !== null);
    return () => triggers.forEach((t) => t.kill());
  }, [pathname, reduce]);

  return null;
}
