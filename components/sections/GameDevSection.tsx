"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gameProjects } from "@/data/projects";
import type { Project } from "@/lib/types";
import { GameProject } from "@/components/projects/GameProject";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Game Development: a pinned horizontal sequence on desktop (GSAP ScrollTrigger),
 * a vertical stack of full-bleed stories on smaller screens and for reduced motion.
 */
export function GameDevSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // GSAP is only needed for the desktop pinned sequence — load it lazily.
    import("@/lib/gsap").then(({ getGsap }) => {
      if (cancelled) return;
      const { gsap, ScrollTrigger } = getGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        // Inner parallax + title drift for each panel, synced to the horizontal tween
        gsap.utils.toArray<HTMLElement>(".game-panel", track).forEach((panel) => {
          const visual = panel.querySelector(".game-visual");
          const title = panel.querySelector(".game-title");
          if (visual) {
            gsap.fromTo(
              visual,
              { xPercent: 6 },
              {
                xPercent: -6,
                ease: "none",
                scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
              },
            );
          }
          if (title) {
            gsap.fromTo(
              title,
              { x: 120, opacity: 0.2 },
              {
                x: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 85%", end: "left 25%", scrub: true },
              },
            );
          }
        });
      });

      // Fonts and lazy content can shift layout; recalc once things settle.
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
      cleanup = () => {
        window.clearTimeout(t);
        mm.revert();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section id="game-dev" aria-labelledby="game-dev-heading" className="relative bg-coal">
      <div className="gutter pb-20 pt-32 lg:pb-28 lg:pt-44">
        <SectionLabel index="04" title="Game Development" />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <RevealText
            id="game-dev-heading"
            lines={["Game", "Development"]}
            className="display text-[clamp(4rem,15vw,16rem)] text-bone lg:col-span-12"
          />
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="display-wide text-2xl text-bone sm:text-3xl">From mechanics to worlds.</p>
            <p className="mt-4 max-w-[34ch] text-ash">
              Prototypes, playable slices and platforms — each one built to find out what makes an experience feel right.
            </p>
          </div>
        </div>
      </div>

      <div ref={pinRef} className="relative motion-safe:lg:h-[100svh] motion-safe:lg:overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col gap-px motion-safe:will-change-transform motion-safe:lg:h-full motion-safe:lg:flex-row motion-safe:lg:gap-0"
        >
          {gameProjects.map((project, i) => (
            <GameProject
              key={project.slug}
              project={project}
              index={i}
              total={gameProjects.length}
              onOpen={setOpen}
              className="w-full motion-reduce:lg:min-h-[85svh] motion-safe:lg:h-full motion-safe:lg:w-[86vw] motion-safe:lg:border-r motion-safe:lg:border-black"
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden gutter pb-6 motion-safe:lg:block"
          aria-hidden="true"
        >
          <div className="flex items-center gap-4">
            <span className="label text-ash">Scroll</span>
            <span className="relative h-px flex-1 bg-bone/15">
              <span ref={progressRef} className="absolute inset-0 origin-left scale-x-0 bg-bone" />
            </span>
            <span className="label text-ash">{String(gameProjects.length).padStart(2, "0")} projects</span>
          </div>
        </div>
      </div>

      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
