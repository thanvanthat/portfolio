"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Handwritten title over the cabinet; it blurs and spreads apart as you scroll away. */
export function HomeHero({ title, body }: { title: string; body: string }) {
  const ref = useRef<HTMLElement>(null);
  // 0 at the top of the page, 1 once the hero has scrolled out
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(16px)"]);
  const titleY = useTransform(scrollYProgress, [0, 0.6], [0, -96]);
  const bodyY = useTransform(scrollYProgress, [0, 0.6], [0, -52]);
  const spacing = useTransform(scrollYProgress, [0, 0.6], ["0.01em", "0.4em"]);
  const cue = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="home-title"
      className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-[14vh] text-center"
    >
      {/* Soft shade under the copy so it reads against the light end of the sky */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(180deg,rgb(16_20_18/0)_0%,rgb(16_20_18/0.42)_70%,rgb(16_20_18/0.55)_100%)]"
        style={{ opacity }}
      />
      <motion.div style={{ opacity, filter: blur }} className="relative max-w-[44rem]">
        <motion.h1
          id="home-title"
          className="font-hand text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.95] text-[#f7f2e8] [text-shadow:0_2px_24px_rgb(20_24_20/0.35)]"
          style={{ y: titleY, letterSpacing: spacing }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="font-serif-up mx-auto mt-5 max-w-[38rem] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-[#f7f2e8] [text-shadow:0_1px_14px_rgb(20_24_20/0.45)]"
          style={{ y: bodyY }}
        >
          {body}
        </motion.p>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity: cue }}
      >
        <span className="label text-[#f7f2e8]/80">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-[#f7f2e8]/30">
          <span className="scroll-dot absolute left-0 top-0 h-3 w-px bg-[#f7f2e8]" />
        </span>
      </motion.div>
    </section>
  );
}
