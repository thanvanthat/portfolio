"use client";

import { motion } from "framer-motion";
import { cn, easeOutExpo } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface RevealTextProps {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  id?: string;
}

/** Masked line-by-line text reveal. Each line slides up from behind a clip. */
export function RevealText({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  immediate = false,
  id,
}: RevealTextProps) {
  const reduce = usePrefersReducedMotion();
  const trigger = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -12% 0px" } };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <motion.span className="block" initial="hidden" {...trigger} aria-hidden="true">
        {lines.map((line, i) => (
          <span key={`${line}-${i}`} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <motion.span
              className={cn("block will-change-transform", lineClassName)}
              variants={{
                hidden: { y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: reduce ? 0.3 : 1.1, ease: easeOutExpo, delay: delay + i * stagger },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
