"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/data/content";
import { easeOutExpo } from "@/lib/utils";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { usePrefersReducedMotion } from "@/lib/hooks";

export function ProcessSection() {
  const reduce = usePrefersReducedMotion();
  return (
    <section aria-labelledby="process-heading" className="gutter relative border-t border-bone/10 bg-coal py-32 lg:py-44">
      <SectionLabel index="08" title="Process" />
      <RevealText
        id="process-heading"
        lines={["Question.", "Prototype.", "Systems. Polish."]}
        className="display mt-8 text-[clamp(3rem,9vw,9rem)] text-bone"
      />
      <ol className="mt-20 grid gap-px bg-bone/10 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
        {processSteps.map((step, i) => (
          <motion.li
            key={step.label}
            className="group relative flex min-h-[18rem] flex-col justify-between overflow-hidden bg-coal p-6 lg:min-h-[24rem] lg:p-8"
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease: easeOutExpo, delay: i * 0.1 }}
          >
            <span
              aria-hidden="true"
              className="display-wide pointer-events-none absolute -right-4 -top-6 text-[9rem] text-bone/[0.04] transition-colors duration-700 group-hover:text-bone/[0.08]"
            >
              {i + 1}
            </span>
            <span className="label text-ash">Step 0{i + 1}</span>
            <div>
              <h3 className="display text-5xl text-bone lg:text-6xl">{step.label}</h3>
              <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-bone/65 sm:text-base">{step.detail}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
