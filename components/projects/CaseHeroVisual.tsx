"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/types";
import { ProjectArt } from "@/components/visuals/ProjectArt";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Full-bleed hero visual that un-clips and settles as it scrolls into view. */
export function CaseHeroVisual({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inset = useTransform(scrollYProgress, [0, 0.45], reduce ? ["0%", "0%"] : ["6%", "0%"]);
  const clipPath = useTransform(inset, (v) => `inset(0 ${v} 0 ${v})`);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.15, 1]);

  return (
    <div ref={ref} className="relative h-[60svh] overflow-hidden lg:h-[100svh]">
      <motion.div style={{ clipPath }} className="absolute inset-0 overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0 will-change-transform">
          <ProjectArt project={project} animated priority />
        </motion.div>
      </motion.div>
    </div>
  );
}
