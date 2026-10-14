"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface BlogHeroProps {
  title: ReactNode;
  children?: ReactNode;
  /** Visual size of the title; the handwritten face for the index, serif for posts. */
  variant?: "hand" | "serif";
  cue?: boolean;
}

/**
 * Full-height intro over the 3D stage. As it scrolls away the title rises faster
 * than the body, its letter-spacing opens up, and the block blurs out.
 */
export function BlogHero({ title, children, variant = "hand", cue = true }: BlogHeroProps) {
  const ref = useRef<HTMLElement>(null);
  // 0 at the top of the page, 1 once the hero has scrolled away
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const filter = useTransform(scrollYProgress, [0.05, 0.45], ["blur(0px)", "blur(16px)"]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.45], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -96]);
  const bodyY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const spacing = useTransform(scrollYProgress, [0, 1], ["0.01em", variant === "hand" ? "0.42em" : "0.08em"]);

  return (
    <section
      ref={ref}
      className="flex min-h-[100svh] flex-col items-center justify-end overflow-x-clip px-6 pb-[6vh] text-center"
    >
      <motion.div style={{ filter, opacity }}>
        <div className="blog-intro">
          <motion.h1
            style={{ y: titleY, letterSpacing: spacing }}
            className={
              variant === "hand"
                ? "font-hand text-[clamp(2.75rem,8vw,6rem)] leading-none drop-shadow-[0_2px_24px_rgb(10_14_22/0.25)]"
                : "mx-auto max-w-[18ch] font-serif text-[clamp(2.5rem,6.5vw,5.5rem)] font-semibold leading-[0.95] drop-shadow-[0_2px_24px_rgb(10_14_22/0.35)]"
            }
          >
            {title}
          </motion.h1>
          {children && (
            <motion.div style={{ y: bodyY }} className="mx-auto mt-5 max-w-[min(660px,88vw)]">
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>
      {cue && (
        <div
          aria-hidden="true"
          className="mt-[3vh] flex flex-col items-center gap-2.5 text-[10px] uppercase tracking-[0.32em] text-[rgb(244_241_234/0.6)]"
        >
          <span>Scroll</span>
          <span className="relative h-11 w-px overflow-hidden bg-gradient-to-b from-[rgb(244_241_234/0.28)] to-[rgb(244_241_234/0.04)]">
            <span className="blog-scroll-dot absolute left-1/2 top-0 -ml-[1.5px] h-[9px] w-[3px] rounded-sm bg-peach shadow-[0_0_6px_rgb(255_217_179/0.8)]" />
          </span>
        </div>
      )}
    </section>
  );
}
