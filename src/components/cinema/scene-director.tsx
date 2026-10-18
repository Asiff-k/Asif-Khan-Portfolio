"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { palettes, sceneStore, type SceneName } from "@/lib/scene";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * House lights. Sections marked data-scene="light" | "dark" switch the page
 * palette as they reach the middle of the viewport. One tween moves the
 * backdrop, text and rules together, so text always matches its background.
 */
export function SceneDirector() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const sections = [...document.querySelectorAll<HTMLElement>("[data-scene]")];

    const apply = (scene: SceneName, instant = false) => {
      sceneStore.set(scene);
      root.dataset.scene = scene;
      gsap.to(root, {
        ...palettes[scene],
        duration: instant || reduce ? 0 : 0.8,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    if (sections.length === 0) {
      apply("light", true);
      return;
    }

    const first = sections[0].dataset.scene as SceneName;
    apply(first, true);

    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) apply(el.dataset.scene as SceneName);
        },
      }),
    );
    // Images and fonts change section heights after load.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", refresh);
    };
  }, [pathname, reduce]);

  return null;
}
