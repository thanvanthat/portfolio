import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/lib/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { Pipeline } from "@/components/ui/Pipeline";
import { RevealText } from "@/components/ui/RevealText";
import { ProjectArt } from "@/components/visuals/ProjectArt";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { CaseHeroVisual } from "./CaseHeroVisual";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectMeta } from "./ProjectMeta";
import { ScreenGallery } from "./ScreenGallery";

interface CaseStudyProps {
  project: Project;
  next: Project;
}

function Chapter({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-bone/10 py-14 lg:grid-cols-12 lg:py-20" aria-label={title}>
      <h2 className="label flex gap-3 text-ash lg:col-span-3">
        <span className="text-bone">{index}</span>
        <span>{title}</span>
      </h2>
      <div className="lg:col-span-8 lg:col-start-5">{children}</div>
    </section>
  );
}

/** Immersive case study layout shared by every project page. */
export function CaseStudy({ project, next }: CaseStudyProps) {
  const { accent, base, glow } = project.atmosphere;
  const style = { "--accent": accent } as CSSProperties;

  return (
    <article style={{ ...style, background: base }} className="relative">
      {/* Title block */}
      <header className="relative overflow-clip gutter pb-16 pt-32 lg:pb-24 lg:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(60% 60% at 80% 0%, ${glow}66, transparent 70%)` }}
        />
        <div className="relative">
          <div className="label flex flex-wrap items-center justify-between gap-4 text-ash">
            <Link href="/#projects" className="inline-flex items-center gap-2 transition-colors hover-fine:text-bone">
              <ArrowLeft className="size-3.5" aria-hidden="true" /> All projects
            </Link>
            <span>
              Project <span className="text-bone">{project.number}</span> — {project.type}
            </span>
          </div>
          <p className="display mt-12 text-[clamp(5rem,16vw,14rem)] leading-none" style={{ color: accent }} aria-hidden="true">
            {project.number}
          </p>
          <RevealText
            as="h1"
            immediate
            delay={0.4}
            lines={[project.title]}
            className="display text-[clamp(3.5rem,12vw,13rem)] text-bone"
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="display-wide max-w-[24ch] text-[clamp(1.5rem,3vw,2.5rem)] text-bone/85">{project.statement}</p>
              <ProjectLinks project={project} size="lg" className="mt-10" />
            </div>
            <ProjectMeta project={project} compact className="lg:col-span-5" />
          </div>
        </div>
      </header>

      <CaseHeroVisual project={project} />

      {project.highlights && (
        <dl className="gutter grid grid-cols-2 border-b border-bone/10 lg:grid-cols-4">
          {project.highlights.map((h, i) => (
            <div key={h.label} className="border-bone/10 py-10 pr-6 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
              <dt className="label text-ash">{h.label}</dt>
              <dd className="display mt-3 text-[clamp(3rem,6vw,5.5rem)]" style={{ color: i === 0 ? accent : undefined }}>
                {h.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="gutter pb-10">
        <Chapter index="01" title="Overview">
          <p className="text-[clamp(1.35rem,2.4vw,2rem)] leading-snug text-bone">{project.overview}</p>
        </Chapter>

        <Chapter index="02" title="Problem">
          <p className="text-lg leading-relaxed text-bone/80 sm:text-xl">{project.problem}</p>
        </Chapter>

        <Chapter index="03" title="Concept">
          <p className="text-lg leading-relaxed text-bone/80 sm:text-xl">{project.concept}</p>
        </Chapter>

        <Chapter index="04" title="My Role">
          <p className="display-wide text-[clamp(1.35rem,2.4vw,2rem)] text-bone">{project.role}</p>
          <ul className="mt-8 grid gap-x-10 md:grid-cols-2">
            {project.responsibilities.map((r, i) => (
              <li key={r} className="flex gap-4 border-t border-bone/10 py-4 text-bone/85">
                <span className="label pt-1 text-ash">{String(i + 1).padStart(2, "0")}</span>
                {r}
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter index="05" title="Technology">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {project.technologies.map((t, i) => (
              <li key={t} className="display text-[clamp(2rem,4.5vw,4rem)] text-bone">
                {t}
                {i < project.technologies.length - 1 && <span className="pl-5 text-bone/20">/</span>}
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter index="06" title="System Design">
          <Pipeline vertical steps={project.system} accent={accent} ariaLabel={`${project.title} system design`} />
        </Chapter>

        <Chapter index="07" title="Development Process">
          <ol className="grid gap-px bg-bone/10 md:grid-cols-3">
            {project.process.map((step, i) => (
              <li key={step.heading} className="flex min-h-56 flex-col justify-between gap-8 p-6" style={{ background: base }}>
                <span className="label text-ash">Phase 0{i + 1}</span>
                <div>
                  <h3 className="display-wide text-2xl text-bone">{step.heading}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/70">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter index="08" title="Result / Status">
          <p className="label inline-flex items-center gap-2 text-bone">
            <span className="size-2 rounded-full" style={{ background: accent }} />
            {project.status}
          </p>
          <p className="mt-6 text-[clamp(1.35rem,2.4vw,2rem)] leading-snug text-bone">{project.result}</p>
          {project.note && (
            <p className="mt-8 max-w-[60ch] border-l pl-4 text-sm leading-relaxed text-ash" style={{ borderColor: accent }}>
              {project.note}
            </p>
          )}
        </Chapter>
      </div>

      {/* Gallery */}
      {project.screens?.length ? (
        <section aria-label="Product screens" className="pb-24">
          <div className="gutter label mb-8 text-ash">
            <span className="text-bone">09</span> Product Screens
          </div>
          <ScreenGallery project={project} />
        </section>
      ) : (
        <section aria-label="Visual gallery" className="pb-24">
          <div className="gutter label mb-8 flex justify-between text-ash">
            <span>
              <span className="text-bone">09</span> Visual Gallery
            </span>
            <span className="lg:hidden">Swipe →</span>
          </div>
          <div
            data-cursor="drag"
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto gutter lg:grid lg:grid-cols-12 lg:overflow-visible"
          >
            {(project.gallery ?? []).map((g, i) => (
              <FadeIn
                key={g.caption}
                delay={i * 0.1}
                className={
                  i === 0
                    ? "w-[85vw] shrink-0 snap-center lg:col-span-7 lg:w-auto"
                    : i === 1
                      ? "w-[85vw] shrink-0 snap-center lg:col-span-5 lg:mt-24 lg:w-auto"
                      : "w-[85vw] shrink-0 snap-center lg:col-span-8 lg:col-start-3 lg:w-auto"
                }
              >
                <figure>
                  <div className="aspect-[4/3] overflow-hidden lg:aspect-[16/10]">
                    <ProjectVisual
                      project={project}
                      variant={g.variant}
                      className="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="label mt-3 flex justify-between text-ash">
                    <span>{g.caption}</span>
                    <span>0{i + 1}</span>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
          <p className="gutter label mt-6 text-ash">Key art is generated for this portfolio.</p>
        </section>
      )}

      {/* Next project */}
      <Link
        href={`/projects/${next.slug}`}
        data-cursor="view"
        data-cursor-label="Next →"
        className="group relative block overflow-hidden border-t border-bone/10"
        style={{ background: next.atmosphere.base }}
      >
        <div className="absolute inset-0 opacity-30 transition-[opacity,transform] duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-60">
          <ProjectArt project={next} />
        </div>
        <div className="relative gutter py-24 lg:py-40">
          <p className="label text-ash">Next project — {next.number}</p>
          <p className="display mt-6 text-[clamp(3.5rem,12vw,12rem)] text-bone">{next.title}</p>
          <p className="mt-6 inline-flex items-center gap-3 text-lg text-bone/80">
            {next.statement}
            <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
          </p>
        </div>
      </Link>
    </article>
  );
}
