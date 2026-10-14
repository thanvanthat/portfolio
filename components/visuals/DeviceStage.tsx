"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BrowserFrame, PhoneFrame } from "./DeviceFrame";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface DeviceStageProps {
  project: Project;
  className?: string;
}

/**
 * Real product screens staged in depth. Each device drifts at its own
 * speed as the section scrolls, so the composition separates into layers.
 */
export function DeviceStage({ project, className }: DeviceStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const r = (a: number, b: number) => (reduce ? [0, 0] : [a, b]);
  const yBack = useTransform(scrollYProgress, [0, 1], r(80, -80));
  const yFront = useTransform(scrollYProgress, [0, 1], r(140, -140));
  const yMid = useTransform(scrollYProgress, [0, 1], r(40, -40));
  const tilt = useTransform(scrollYProgress, [0, 1], r(-14, -4));

  const screens = project.screens ?? [];
  if (!screens.length) return null;
  const s = (i: number) => screens[i % screens.length]!;
  const live = project.links?.find((l) => l.kind === "live");
  const { glow, accent } = project.atmosphere;

  return (
    <div ref={ref} className={cn("relative", className)} aria-hidden="true">
      <div
        className="pointer-events-none absolute inset-[-10%] -z-10 opacity-80"
        style={{ background: `radial-gradient(50% 50% at 50% 50%, ${glow}aa, transparent 70%)` }}
      />
      {project.device === "phone" ? (
        <div className="relative mx-auto flex aspect-[5/4] max-w-[56rem] items-center justify-center">
          <motion.div style={{ y: yBack }} className="absolute left-[4%] top-[12%] w-[26%] -rotate-[9deg] opacity-90">
            <PhoneFrame screen={s(1)} sizes="(min-width:1024px) 230px, 26vw" />
          </motion.div>
          <motion.div style={{ y: yBack }} className="absolute right-[4%] top-[12%] w-[26%] rotate-[9deg] opacity-90">
            <PhoneFrame screen={s(3)} sizes="(min-width:1024px) 230px, 26vw" />
          </motion.div>
          <motion.div style={{ y: yMid }} className="absolute left-[22%] top-[4%] w-[27%] -rotate-[3deg]">
            <PhoneFrame screen={s(2)} sizes="(min-width:1024px) 240px, 27vw" />
          </motion.div>
          <motion.div style={{ y: yMid }} className="absolute right-[22%] top-[4%] w-[27%] rotate-[3deg]">
            <PhoneFrame screen={s(4)} sizes="(min-width:1024px) 240px, 27vw" />
          </motion.div>
          <motion.div style={{ y: yFront }} className="relative z-10 w-[32%]">
            <PhoneFrame screen={s(0)} sizes="(min-width:1024px) 290px, 32vw" />
            <span
              className="label absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6rem]"
              style={{ color: accent }}
            >
              ● Live app
            </span>
          </motion.div>
        </div>
      ) : (
        <div className="relative mx-auto aspect-[16/11] max-w-[72rem] [perspective:2000px]">
          <motion.div
            style={{ y: yBack, rotateY: tilt }}
            className="absolute right-0 top-0 w-[70%] opacity-55 [transform-style:preserve-3d]"
          >
            <BrowserFrame screen={s(1)} url={live?.href} sizes="(min-width:1024px) 50vw, 70vw" />
          </motion.div>
          <motion.div style={{ y: yMid, rotateY: tilt }} className="absolute bottom-[6%] left-0 z-10 w-[78%]">
            <BrowserFrame screen={s(0)} url={live?.href} sizes="(min-width:1024px) 56vw, 80vw" />
          </motion.div>
          <motion.div style={{ y: yFront }} className="absolute bottom-0 right-[3%] z-20 w-[34%]">
            <BrowserFrame screen={s(3)} sizes="(min-width:1024px) 24vw, 34vw" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
