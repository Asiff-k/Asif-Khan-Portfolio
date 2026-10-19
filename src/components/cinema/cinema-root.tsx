"use client";

import { Cursor } from "./cursor";
import { SceneDirector } from "./scene-director";
import { SmoothScroll } from "./smooth-scroll";

/** Client-side motion systems shared by every page. */
export function CinemaRoot() {
  return (
    <>
      <SmoothScroll />
      <SceneDirector />
      <Cursor />
    </>
  );
}
