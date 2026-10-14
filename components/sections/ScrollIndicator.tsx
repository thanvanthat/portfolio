"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

export function ScrollIndicator({ target = "#about" }: { target?: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <a
      href={target}
      className="label group flex items-center gap-4 text-ash transition-colors hover-fine:text-bone"
      aria-label="Scroll to next section"
    >
      <span className="relative block h-10 w-px overflow-hidden bg-bone/15">
        <motion.span
          className="absolute left-0 top-0 block h-1/2 w-px bg-bone"
          animate={reduce ? undefined : { y: ["-100%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: [0.76, 0, 0.24, 1] }}
        />
      </span>
      Scroll
    </a>
  );
}
