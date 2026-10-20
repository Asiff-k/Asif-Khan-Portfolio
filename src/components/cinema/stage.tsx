"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { setConsoleFunction } from "three";
import { getDeviceTier } from "@/lib/use-media";
import { Particles } from "./particles";

// R3F 9 creates a THREE.Clock internally, which three.js deprecated in r183.
// Drop only that notice; every other three.js message is passed through.
setConsoleFunction((type: string, message: string, ...params: unknown[]) => {
  if (type === "warn" && message.startsWith("THREE.Clock: This module has been deprecated")) return;
  const log = (console as unknown as Record<string, (...a: unknown[]) => void>)[type] ?? console.log;
  log(message, ...params);
});

/**
 * The one WebGL canvas in the app, fixed behind the content. Loaded lazily
 * (see StageLoader) so three.js never touches the initial bundle.
 */
export default function Stage() {
  const [tier] = useState(getDeviceTier);
  const [running, setRunning] = useState(true);

  // Paragraph halos (globals.css) only matter while the particles are on screen.
  useEffect(() => {
    document.documentElement.classList.add("has-stage");
    return () => document.documentElement.classList.remove("has-stage");
  }, []);

  // Pause rendering when the tab is hidden.
  useEffect(() => {
    const onVis = () => setRunning(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={tier.dpr}
        frameloop={running ? "always" : "never"}
        camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: false }}
      >
        <Particles count={tier.particles} />
      </Canvas>
    </div>
  );
}
