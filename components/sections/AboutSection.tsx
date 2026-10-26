"use client";

import { motion } from "framer-motion";
import { aboutIntro, aboutStatements } from "@/data/content";
import { easeOutExpo } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { Marquee } from "@/components/ui/Marquee";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WordReveal } from "@/components/ui/WordReveal";
import { usePrefersReducedMotion } from "@/lib/hooks";

export function AboutSection() {
  const reduce = usePrefersReducedMotion();

  return (
    <section id="about" aria-labelledby="about-heading" className="relative bg-ink pt-32 lg:pt-48">
      <div className="gutter">
        <SectionLabel index="01" title="About" />

        <div id="about-heading" className="mt-10 lg:mt-16">
          <WordReveal
            lines={["I build", "digital worlds", "and intelligent", "systems."]}
            className="display text-[clamp(3.5rem,12.5vw,13rem)] text-bone"
          />
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4 lg:col-start-2">
            <p className="label text-ash">Currently</p>
            <p className="mt-3 text-sm leading-relaxed text-bone/70">
              CSE student · Shipped Gilli, Snakes & Ladders 3D, FreshCO AI and GrantPilot AI · Prototyping in Unreal Engine 5
            </p>
          </FadeIn>
          <FadeIn className="lg:col-span-6" delay={0.1}>
            <p className="text-xl leading-snug text-bone sm:text-2xl lg:text-[1.75rem]">{aboutIntro}</p>
          </FadeIn>
        </div>
      </div>

      {/* Large statement list */}
      <ul className="mt-24 border-t border-bone/10 lg:mt-36" aria-label="Focus areas">
        {aboutStatements.map((s, i) => (
          <motion.li
            key={s}
            className="group relative overflow-hidden border-b border-bone/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.06 }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-[var(--ease-cine)] hover-fine:group-hover:scale-y-100"
            />
            <div className="gutter relative flex items-baseline justify-between gap-6 py-4 transition-colors duration-500 hover-fine:group-hover:text-ink lg:py-6">
              <motion.span
                className="display text-[clamp(2.5rem,8vw,7.5rem)]"
                initial={{ x: reduce ? 0 : -40 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: easeOutExpo, delay: i * 0.06 }}
              >
                {s}
              </motion.span>
              <span className="label shrink-0 text-ash transition-colors duration-500 hover-fine:group-hover:text-ink">
                / 0{i + 1}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      <Marquee
        items={[
          "Unreal Engine",
          "Blueprints",
          "C++",
          "C#",
          "Python",
          "Computer Vision",
          "CNN",
          "Generative AI",
          "Interactive Experiences",
        ]}
        className="display-wide py-10 text-[clamp(1.5rem,3vw,2.5rem)] text-bone/45"
        duration={50}
      />
    </section>
  );
}
