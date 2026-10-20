"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, refreshWhenSettled, ScrollTrigger } from "@/lib/gsap";
import { paletteFor, sceneStore, type SceneName } from "@/lib/scene";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * House lights. Sections marked data-scene="light" | "dark" switch the page
 * palette as they reach the middle of the viewport, over 0.8s.
 *
 * Tweening the palette variables on <html> restyles and repaints the whole
 * page on every frame (about 100ms a frame on an Intel HD 520 laptop), so the
 * palette switches once, at the midpoint, and a fixed layer
 * (.scene-backdrop) carries the fade with opacity only: for the first half it
 * shows the incoming colour fading in over the old page background, for the
 * second half the outgoing colour fading out over the new one. The blend is
 * continuous, and at rest the layer is transparent, so the page background is
 * always the real scene colour (contrast checkers read it correctly).
 */
export function SceneDirector() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const sections = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
    const layer = document.querySelector<HTMLElement>(".scene-backdrop");
    const vignette = document.querySelector<HTMLElement>(".cinema-vignette");
    let fade: gsap.core.Tween | null = null;
    let finish: (() => void) | null = null;

    const apply = (scene: SceneName, instant = false) => {
      // Tweening root variables restyles the whole page every frame, so never
      // tween to the scene that is already showing (the first trigger fires
      // on load for the scene the page starts in).
      if (!instant && root.dataset.scene === scene) return;
      // A change of scene during a fade: land the previous one first.
      fade?.kill();
      finish?.();
      const from = root.dataset.scene === "dark" ? "dark" : "light";
      sceneStore.set(scene);
      root.dataset.scene = scene;
      const palette = () => {
        for (const [k, v] of Object.entries(paletteFor(scene))) root.style.setProperty(k, String(v));
      };
      const colour = (s: SceneName) => String(paletteFor(s)["--scene-bg"]);
      const now = instant || reduce;
      if (vignette) gsap.to(vignette, { opacity: scene === "dark" ? 1 : 0, duration: now ? 0 : 0.8, ease: "power2.inOut", overwrite: true });
      if (now || !layer) {
        palette();
        if (layer) layer.style.opacity = "0";
        return;
      }
      let switched = false;
      const p = { v: 0 };
      layer.style.background = colour(scene);
      finish = () => {
        if (!switched) palette();
        layer.style.opacity = "0";
        finish = null;
      };
      fade = gsap.to(p, {
        v: 1,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (!switched && p.v >= 0.5) {
            switched = true;
            palette();
            layer.style.background = colour(from);
          }
          layer.style.opacity = String(switched ? 1 - p.v : p.v);
        },
        onComplete: () => finish?.(),
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
    const refresh = () => refreshWhenSettled();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      fade?.kill();
      finish?.();
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", refresh);
    };
  }, [pathname, reduce]);

  return null;
}
