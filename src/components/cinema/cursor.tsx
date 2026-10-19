"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/use-media";

/**
 * Mouse-only cursor: an 8px dot that trails the pointer and grows into a 64px
 * circle with a label over elements marked data-cursor ("View", "Drag",
 * "Open"). The dot uses mix-blend-mode difference so it shows on light and
 * dark scenes; the labelled circle is solid scene ink or stone. The system
 * cursor stays visible; this only adds to it.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduce) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let first = true;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (first) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        first = false;
      }
      x(e.clientX);
      y(e.clientY);
      el.dataset.visible = "";
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      const text = target?.getAttribute("data-cursor") ?? "";
      if (text) {
        el.dataset.label = text;
        if (label.current) label.current.textContent = text;
      } else {
        delete el.dataset.label;
      }
    };
    const hide = () => delete el.dataset.visible;

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [fine, reduce]);

  if (!fine || reduce) return null;
  return (
    <div ref={ref} className="cursor" aria-hidden>
      <span ref={label} />
    </div>
  );
}
