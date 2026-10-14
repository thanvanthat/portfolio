"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { PipelineStep } from "@/lib/types";
import { cn, easeOutExpo } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface PipelineProps {
  steps: PipelineStep[];
  accent?: string;
  className?: string;
  /** Force vertical layout at every breakpoint. */
  vertical?: boolean;
  ariaLabel: string;
}

/**
 * Animated system diagram. Horizontal on large screens, vertical on small ones.
 * Connectors draw in sequence and a signal pulse travels through them.
 */
export function Pipeline({ steps, accent = "#ecebe6", className, vertical = false, ariaLabel }: PipelineProps) {
  const reduce = usePrefersReducedMotion();
  const style = { "--accent": accent } as CSSProperties;

  return (
    <motion.ol
      aria-label={ariaLabel}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      className={cn("relative grid gap-0", vertical ? "grid-cols-1" : "grid-cols-1 lg:auto-cols-fr lg:grid-flow-col", className)}
    >
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <motion.li
            key={step.label}
            className={cn("relative flex gap-5 pb-10", !vertical && "lg:flex-col lg:gap-6 lg:pb-0 lg:pr-6")}
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo, delay: i * 0.14 } },
            }}
          >
            {/* Node + connector */}
            <div className={cn("relative flex flex-col items-center", !vertical && "lg:flex-row lg:items-center")}>
              <span
                className="relative z-10 grid size-3 shrink-0 place-items-center rounded-full border"
                style={{ borderColor: "var(--accent)" }}
              >
                <span className="size-1 rounded-full" style={{ background: "var(--accent)" }} />
              </span>
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative mt-1 w-px flex-1 overflow-hidden bg-bone/10",
                    !vertical && "lg:mt-0 lg:ml-1 lg:h-px lg:w-auto lg:flex-1",
                  )}
                >
                  <motion.span
                    className={cn("absolute inset-0 origin-top", !vertical && "lg:origin-left")}
                    style={{ background: "var(--accent)", opacity: 0.55 }}
                    variants={{
                      hidden: { scale: 0 },
                      show: { scale: 1, transition: { duration: 0.9, ease: easeOutExpo, delay: 0.2 + i * 0.14 } },
                    }}
                  />
                  {!reduce && (
                    <span
                      className={cn("pipeline-pulse", vertical && "pipeline-pulse--vertical")}
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                  )}
                </span>
              )}
            </div>

            <div className="min-w-0 pt-px">
              <span className="label text-ash">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-2 text-[clamp(1.6rem,3vw,2.4rem)] text-bone">{step.label}</h3>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed text-ash",
                  vertical ? "max-w-[44ch]" : "max-w-[44ch] lg:max-w-[22ch]",
                )}
              >
                {step.detail}
              </p>
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
