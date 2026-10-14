"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { timeline } from "@/data/content";
import { easeOutExpo } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Trajectory timeline: a spine that draws itself as chapters scroll past. */
export function ExperienceSection() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section aria-labelledby="trajectory-heading" className="gutter relative bg-ink py-32 lg:py-44">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <SectionLabel index="02" title="Trajectory" />
          <RevealText
            id="trajectory-heading"
            lines={["Four", "chapters,", "one thread."]}
            className="display mt-8 text-[clamp(3rem,7vw,6.5rem)] text-bone"
          />
          <p className="mt-6 max-w-[34ch] text-ash">
            From fundamentals to worlds to intelligence — and now the space where they meet.
          </p>
        </div>

        <ol ref={ref} className="relative lg:col-span-7 lg:col-start-6">
          <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-bone/10" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : scaleY }}
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-ai"
          />
          {timeline.map((entry, i) => (
            <motion.li
              key={entry.title}
              className="relative pb-16 pl-12 last:pb-0 lg:pb-24"
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1, ease: easeOutExpo }}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 grid size-[15px] place-items-center border border-bone/30 bg-ink"
              >
                <span className="size-[5px] bg-ai" />
              </span>
              <div className="label flex items-center gap-3 text-ash">
                <span className="text-bone">Chapter {entry.chapter}</span>
                <span className="h-px w-8 bg-bone/20" />
                <span>
                  0{i + 1}/0{timeline.length}
                </span>
              </div>
              <h3 className="display-wide mt-4 text-[clamp(2rem,4.5vw,3.75rem)] text-bone">{entry.title}</h3>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-bone/70 sm:text-lg">{entry.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {entry.tags.map((t) => (
                  <li key={t} className="label border border-bone/15 px-3 py-1.5 text-ash">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
