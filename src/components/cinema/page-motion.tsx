"use client";

import { useEffect } from "react";
import { Reveals } from "./reveals";
import { ScrollWorld } from "./scroll-world";
import { stage } from "./stage-controller";

/**
 * Motion that changes page DOM (reveals, scroll mapping). Rendered inside the
 * page, not the layout, so its effects run only after the page content has
 * hydrated. The particles gather from a loose cloud into the quiet field.
 */
export function PageMotion() {
  useEffect(() => {
    stage.morph("field", 2.6);
  }, []);
  return (
    <>
      <Reveals />
      <ScrollWorld />
    </>
  );
}
