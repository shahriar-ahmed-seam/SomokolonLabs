"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Restrained, professional scroll reveal: short fade + small rise, once only,
// transform/opacity only (GPU-composited). Respects reduced motion via CSS.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.5, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
