"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { aiPipeline, researchThreads } from "@/data/content";
import { AIProject } from "@/components/projects/AIProject";
import { NeuralField } from "@/components/visuals/NeuralField";
import { FadeIn } from "@/components/ui/FadeIn";
import { Pipeline } from "@/components/ui/Pipeline";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { usePrefersReducedMotion } from "@/lib/hooks";

export function AISection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <section id="ai" aria-labelledby="ai-heading" className="relative overflow-clip bg-[#07090c]">
      <div ref={ref} className="relative gutter pb-24 pt-32 lg:pt-44">
        <motion.div style={{ y }} className="pointer-events-none absolute inset-0 -z-0 opacity-70" aria-hidden="true">
          <NeuralField animated={!reduce} />
        </motion.div>

        <div className="relative">
          <SectionLabel index="06" title="Artificial Intelligence" />
          <RevealText
            id="ai-heading"
            lines={["Artificial", "Intelligence"]}
            className="display mt-8 text-[clamp(3.6rem,13.5vw,15rem)] text-bone"
          />
          <FadeIn className="mt-8 grid gap-6 lg:grid-cols-12">
            <p className="display-wide text-2xl text-ai sm:text-3xl lg:col-span-6">
              Teaching systems to understand, adapt and assist.
            </p>
            <p className="max-w-[44ch] text-ash lg:col-span-4 lg:col-start-9">
              I work with computer vision, CNNs, object detection and generative AI — applied to real problems and to games. Every
              system follows the same shape.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="relative gutter pb-24">
        <div className="border-t border-bone/10 pt-10">
          <p className="label mb-10 text-ash">How an AI feature flows</p>
          <Pipeline steps={aiPipeline} accent="#9fd4ff" ariaLabel="AI system pipeline" />
        </div>
      </div>

      <div className="relative gutter pb-32 lg:pb-44">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="label text-ash">AI projects & threads</p>
          </div>
          <div className="border-b border-bone/10 lg:col-span-9">
            {researchThreads.map((t, i) => (
              <AIProject key={t.title} thread={t} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
