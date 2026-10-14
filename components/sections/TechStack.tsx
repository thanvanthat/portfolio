"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { skillGroups } from "@/data/content";
import { cn, easeOutExpo } from "@/lib/utils";

/**
 * Technologies as an orbital ecosystem: choose a domain and its tools
 * settle into orbit around the core.
 */
export function TechStack() {
  const [activeId, setActiveId] = useState(skillGroups[0]!.id);
  const active = skillGroups.find((g) => g.id === activeId) ?? skillGroups[0]!;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-5" role="tablist" aria-label="Technology domains" aria-orientation="vertical">
        {skillGroups.map((g, i) => {
          const selected = g.id === activeId;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={selected}
              aria-controls="stack-panel"
              onClick={() => setActiveId(g.id)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActiveId(g.id)}
              className="group flex w-full items-baseline justify-between gap-4 border-t border-bone/10 py-4 text-left last:border-b"
            >
              <span className="flex items-baseline gap-4">
                <span className="label text-ash">0{i + 1}</span>
                <span
                  className={cn(
                    "display text-[clamp(2.25rem,5vw,4.25rem)] transition-colors duration-500",
                    selected ? "text-bone" : "text-bone/50 group-hover:text-bone/75",
                  )}
                >
                  {g.title}
                </span>
              </span>
              <span className={cn("label transition-colors", selected ? "text-ai" : "text-ash")}>{g.items.length}</span>
            </button>
          );
        })}
      </div>

      <div
        id="stack-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
        className="relative mx-auto aspect-square w-full max-w-[36rem] lg:col-span-6 lg:col-start-7"
      >
        {/* Rings */}
        {[1, 0.72, 0.44].map((s, i) => (
          <div
            key={s}
            aria-hidden="true"
            className="absolute rounded-full border border-bone/10"
            style={{ inset: `${((1 - s) / 2) * 100}%`, borderStyle: i === 1 ? "dashed" : "solid" }}
          />
        ))}
        {/* Core */}
        <div className="absolute inset-[36%] grid place-items-center rounded-full border border-ai/40 bg-ai/[0.04] text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <p className="label text-ai">{active.caption}</p>
              <p className="display mt-1 text-2xl text-bone sm:text-3xl">{active.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Orbiting items */}
        <div className="absolute inset-0" style={{ animation: "spin 80s linear infinite" }}>
          <AnimatePresence>
            {active.items.map((item, i) => {
              const n = active.items.length;
              const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
              const radius = i % 2 === 0 ? 50 : 36;
              return (
                <motion.div
                  key={`${active.id}-${item}`}
                  className="absolute"
                  initial={{ left: "50%", top: "50%", opacity: 0 }}
                  animate={{
                    left: `${50 + Math.cos(angle) * radius}%`,
                    top: `${50 + Math.sin(angle) * radius}%`,
                    opacity: 1,
                  }}
                  exit={{ left: "50%", top: "50%", opacity: 0 }}
                  transition={{ duration: 0.9, ease: easeOutExpo, delay: i * 0.05 }}
                >
                  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div style={{ animation: "spin 80s linear infinite reverse" }}>
                      <span className="label block whitespace-nowrap border border-bone/15 bg-ink px-3 py-2 text-[0.625rem] text-bone sm:text-[0.7rem]">
                        {item}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
