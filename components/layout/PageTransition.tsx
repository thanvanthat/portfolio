"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeCine, easeOutExpo } from "@/lib/utils";

/**
 * Route entry transition: a panel wipes off the screen while content fades in.
 * Content only animates opacity so no transform breaks sticky/pinned descendants.
 * Server and client render the same tree; reduced motion hides the wipe in CSS.
 * Used from app/template.tsx so it replays on every navigation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="page-wipe pointer-events-none fixed inset-0 z-[110] bg-graphite motion-reduce:hidden"
        initial={{ clipPath: "inset(0 0 0% 0)" }}
        animate={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.8, ease: easeCine }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
