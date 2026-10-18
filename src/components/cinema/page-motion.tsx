"use client";

import { HeroIntro } from "./intro";

/**
 * Motion that changes page DOM (split headings, reveals, scroll mapping).
 * Rendered inside the page, not the layout, so its effects run only after the
 * page content has hydrated; splitting text earlier causes a hydration mismatch.
 */
export function PageMotion() {
  return (
    <>
      <HeroIntro />
    </>
  );
}
