"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { cn } from "@/lib/utils";
import { gallery } from "./stage";

function Card({ project, index }: { project: Project; index: number }) {
  const screen = project.screens?.[0];
  const live = project.links?.find((l) => l.kind === "live");
  const phone = project.device === "phone";
  return (
    <article
      data-work={index}
      className="works-card flex w-full shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-[#f7f2e8]/15 bg-[#11151c]/80 backdrop-blur-md md:h-[min(78vh,40rem)] md:w-[min(54rem,78vw)] md:flex-row"
    >
      <div
        className="relative aspect-[16/10] w-full md:aspect-auto md:h-full md:w-[56%]"
        style={{ background: project.atmosphere.base }}
      >
        {screen ? (
          <Image
            src={screen.src}
            alt={screen.alt}
            fill
            sizes="(min-width: 768px) 30rem, 100vw"
            className={cn(phone ? "object-contain p-6" : "object-cover object-top")}
          />
        ) : (
          <ProjectVisual project={project} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-9">
        <div className="flex items-baseline justify-between gap-4">
          <span className="label" style={{ color: project.atmosphere.accent }}>
            {project.number}
          </span>
          <span className="label text-[#f7f2e8]/60">{project.status}</span>
        </div>
        <h3 className="font-serif-up mt-4 text-[clamp(2rem,3.2vw,3rem)] leading-[1.02] text-[#f7f2e8]">{project.title}</h3>
        <p className="mt-2 text-sm text-[#f7f2e8]/60">
          {project.type} · {project.engine}
        </p>
        <p className="mt-5 text-[0.98rem] leading-relaxed text-[#f7f2e8]/85">{project.statement}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((t) => (
            <li key={t} className="label rounded-full border border-[#f7f2e8]/20 px-3 py-1.5 text-[#f7f2e8]/75">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <Link
            href={`/projects/${project.slug}`}
            className="label inline-flex items-center gap-2 rounded-full bg-[#f7f2e8] px-5 py-3 text-[#11151c] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Case study <span aria-hidden="true">→</span>
          </Link>
          {live && (
            <a
              href={live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label inline-flex items-center gap-2 rounded-full border border-[#f7f2e8]/30 px-5 py-3 text-[#f7f2e8] transition-colors duration-300 hover:border-[#f7f2e8]"
            >
              {live.label} <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Selected works. On wide screens the section pins and scrolling slides the
 * cards sideways while the cabinet screen shows the project in view; on small
 * screens the cards simply stack.
 */
export function WorksGallery({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t || window.innerWidth < 768) return setTravel(0);
      setTravel(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  const pick = (i: number) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, i));
    gallery.work = clamped;
    setActive(clamped);
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (travel > 0) pick(Math.round(p * (projects.length - 1)));
  });

  // Stacked layout: the card nearest the middle of the viewport drives the screen
  useLayoutEffect(() => {
    if (travel > 0) return;
    const cards = Array.from(section.current?.querySelectorAll<HTMLElement>("[data-work]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) pick(Number((e.target as HTMLElement).dataset.work));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travel]);

  return (
    <section
      id="works"
      ref={section}
      aria-labelledby="works-title"
      className="relative"
      style={travel > 0 ? { height: `calc(100vh + ${travel}px)` } : undefined}
    >
      <div className={cn(travel > 0 && "sticky top-0 flex h-screen flex-col justify-center overflow-hidden")}>
        <div className="flex items-end justify-between gap-6 px-6 pb-8 pt-24 md:px-12 md:pt-0">
          <h2 id="works-title" className="font-hand text-[clamp(2.6rem,6vw,5rem)] leading-none text-[#f7f2e8]">
            Selected works
          </h2>
          <p className="label hidden text-[#f7f2e8]/70 md:block" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {projects[active]?.title}
          </p>
        </div>
        <motion.div
          ref={track}
          style={travel > 0 ? { x } : undefined}
          className="flex flex-col gap-6 px-6 md:w-max md:flex-row md:gap-8 md:px-12 md:pr-[11vw]"
        >
          {projects.map((p, i) => (
            <Card key={p.slug} project={p} index={i} />
          ))}
        </motion.div>
        {travel > 0 && (
          <div aria-hidden="true" className="mx-12 mt-8 h-px bg-[#f7f2e8]/15">
            <motion.div className="h-px origin-left bg-[#f7f2e8]" style={{ scaleX: scrollYProgress }} />
          </div>
        )}
      </div>
    </section>
  );
}
