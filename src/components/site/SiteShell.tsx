"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ScrollProgress } from "./motion";

/**
 * Client boundary for the whole site. MotionConfig with reducedMotion="user"
 * tells every motion component to drop transform animations when the OS asks
 * for reduced motion. overflow-x-clip (not hidden) contains the wide
 * decorative layers without creating a scroll container, so position: sticky
 * still works for the pinned sections.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <div className="flex min-h-svh flex-col overflow-x-clip">{children}</div>
    </MotionConfig>
  );
}
