"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutExpo } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function FadeIn({ children, className, delay = 0, y = 24 }: FadeInProps) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: easeOutExpo, delay }}
    >
      {children}
    </motion.div>
  );
}
