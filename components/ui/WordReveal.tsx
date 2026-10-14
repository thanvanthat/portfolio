"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  lines: string[];
  className?: string;
}

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const reduce = usePrefersReducedMotion();
  const opacity = useTransform(progress, range, [reduce ? 1 : 0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block will-change-[opacity]">
      {word}&nbsp;
    </motion.span>
  );
}

/** Scroll-scrubbed headline: words brighten as the reader scrolls through. */
export function WordReveal({ lines, className }: WordRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = lines.flatMap((line, li) => line.split(" ").map((w, wi) => ({ w, li, key: `${li}-${wi}` })));
  const total = words.length;

  return (
    <h2 ref={ref} className={cn(className)} aria-label={lines.join(" ")}>
      <span aria-hidden="true">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {words
              .map((item, index) => ({ ...item, index }))
              .filter((item) => item.li === li)
              .map(({ w, key, index }) => (
                <Word key={key} word={w} progress={scrollYProgress} range={[index / total, (index + 1) / total]} />
              ))}
          </span>
        ))}
      </span>
    </h2>
  );
}
