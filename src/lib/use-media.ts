"use client";

import { useSyncExternalStore } from "react";

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const reduced = mediaStore("(prefers-reduced-motion: reduce)");
const finePointer = mediaStore("(hover: hover) and (pointer: fine)");
const narrow = mediaStore("(max-width: 767px)");

/** True when the visitor asked for less motion. Server render assumes motion is fine. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(reduced.subscribe, reduced.get, () => false);
}

/** True on a mouse or trackpad. Touch devices get no hover-only effects or custom cursor. */
export function useFinePointer() {
  return useSyncExternalStore(finePointer.subscribe, finePointer.get, () => false);
}

export function useIsNarrow() {
  return useSyncExternalStore(narrow.subscribe, narrow.get, () => false);
}

export type DeviceTier = { mobile: boolean; dpr: number; particles: number };

/** Rendering budget: DPR capped at 1.5 on desktop and 1 on mobile. */
export function getDeviceTier(): DeviceTier {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const mobile = coarse || small;
  const cores = navigator.hardwareConcurrency || 4;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
  const particles = mobile ? 5000 : cores <= 4 ? 10000 : 16000;
  return { mobile, dpr, particles };
}
