"use client";

import CurvedLoop from "@/components/vendor/curved-loop";
import { useIsNarrow } from "@/lib/use-media";

/**
 * Opening band for the AI data scene. Decorative: the parent marks it
 * aria-hidden and renders the same tools as a visually hidden list.
 * fontSize is in SVG units (the band is 1440 units wide and scales with the
 * screen), so phones get a larger value to land near 30px on screen.
 */
export function ToolLoop({ tools }: { tools: string[] }) {
  const narrow = useIsNarrow();
  return (
    <CurvedLoop
      marqueeText={tools.join(" ✦ ")}
      separator="✦"
      shape="arc"
      curveAmount={180}
      speed={1.5}
      fontSize={narrow ? 120 : 72}
      fontWeight={800}
      color="#0a0a0a"
      separatorColor="#8a8a8a"
      pauseOnHover
      scrollBoost={0.2}
      edgeFade={0.25}
      className="font-display"
    />
  );
}
