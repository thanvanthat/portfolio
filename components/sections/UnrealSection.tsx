"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { unrealCapabilities, unrealStages } from "@/data/content";
import { easeOutExpo } from "@/lib/utils";
import { BlueprintGraph } from "@/components/visuals/BlueprintGraph";
import { Marquee } from "@/components/ui/Marquee";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Unreal Engine: an interactive system breakdown. As each stage scrolls into
 * focus, the sticky Blueprint graph advances. Stages are also clickable.
 */
export function UnrealSection() {
  const [active, setActive] = useState(0);
  const stageRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    stageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = unrealStages[active]!;

  return (
    <section aria-labelledby="unreal-heading" className="relative overflow-clip bg-ink">
      <div className="gutter pt-32 lg:pt-44">
        <SectionLabel index="05" title="Engine" />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <RevealText
            id="unreal-heading"
            lines={["Unreal", "Engine"]}
            className="display text-[clamp(4rem,15vw,16rem)] text-bone lg:col-span-8"
          />
          <p className="max-w-[40ch] text-ash lg:col-span-4 lg:pb-4">
            Unreal Engine 5 is where most of my game work happens — from Blueprint logic and MetaHuman characters to materials,
            levels and UI. Here is how a prototype comes together.
          </p>
        </div>
      </div>

      <Marquee
        items={unrealCapabilities}
        className="label mt-16 border-y border-bone/10 py-4 text-sm text-ash"
        duration={30}
        separator="—"
      />

      <div className="gutter grid gap-12 py-20 lg:grid-cols-12 lg:py-0">
        {/* Sticky graph */}
        <div className="lg:sticky lg:top-0 lg:col-span-6 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:self-start">
          <div className="label flex items-center justify-between text-ash">
            <span>System breakdown</span>
            <span className="text-bone">
              {String(active + 1).padStart(2, "0")} / {String(unrealStages.length).padStart(2, "0")}
            </span>
          </div>
          <div className="relative mt-4 h-10 overflow-hidden sm:h-14" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={current.label}
                className="display absolute inset-0 text-[2.5rem] text-ai sm:text-[3.5rem]"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
              >
                {current.label}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-6 aspect-[580/790] max-h-[62svh] w-full border border-bone/10 bg-coal/60">
            <BlueprintGraph stages={unrealStages} active={active} />
          </div>
        </div>

        {/* Stage list */}
        <ol className="lg:col-span-5 lg:col-start-8 lg:py-[30svh]">
          {unrealStages.map((stage, i) => (
            <li
              key={stage.label}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              data-index={i}
              className="border-t border-bone/10 py-8 lg:flex lg:min-h-[55svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
            >
              <button
                type="button"
                onClick={() => stageRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className="block w-full text-left"
                aria-current={active === i ? "step" : undefined}
              >
                <span className="label text-ash">Stage {String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`display mt-3 block text-[clamp(2.75rem,6vw,5.5rem)] transition-colors duration-500 ${
                    active === i ? "text-bone" : "text-bone/50"
                  }`}
                >
                  {stage.label}
                </span>
                {i < unrealStages.length - 1 && (
                  <span aria-hidden="true" className="label mt-2 block text-ash">
                    ↓
                  </span>
                )}
              </button>
              <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-bone/70">{stage.detail}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {stage.tools.map((t) => (
                  <li key={t} className="label border border-bone/15 px-3 py-1.5 text-ash">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
