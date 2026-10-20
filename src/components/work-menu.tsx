"use client";

import dynamic from "next/dynamic";
import type { FlowingMenuItem } from "@/components/vendor/flowing-menu";
import { useFinePointer, useIsNarrow } from "@/lib/use-media";

// Client-only and loaded only for mouse users at 768px and up; phones never
// download or hydrate it and keep the plain project list.
const FlowingMenu = dynamic(() => import("@/components/vendor/flowing-menu"), { ssr: false });

export function WorkMenu({ items }: { items: FlowingMenuItem[] }) {
  const fine = useFinePointer();
  const narrow = useIsNarrow();
  if (!fine || narrow) return null;
  return (
    <FlowingMenu
      items={items}
      ariaLabel="Selected work"
      speed={50}
      bandRadius={0}
      align="left"
      showIndex
      showArrow
      dimInactive
      imageShape="rounded"
      intro={false}
      bgColor="transparent"
      textColor="var(--scene-fg)"
      marqueeBgColor="#0a0a0a"
      marqueeTextColor="#ffffff"
      borderColor="var(--scene-line)"
    />
  );
}
