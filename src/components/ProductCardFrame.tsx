"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Client shell for ProductCard: records the pointer position as --mx / --my
 * so the CSS glow can follow it. Writes straight to the element's style, so
 * moving the mouse never re-renders React.
 */
export default function ProductCardFrame({
  className,
  style,
  children,
}: {
  className: string;
  style: CSSProperties;
  children: ReactNode;
}) {
  return (
    <article
      className={className}
      style={style}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </article>
  );
}
