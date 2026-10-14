"use client";

import { motion } from "framer-motion";
import { getProject } from "@/data/projects";
import { easeOutExpo } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { LiveProjectFeature } from "./LiveProjectFeature";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Values from a real qualification run in the app (AI-Powered Drone Surveillance System). */
const FIT = [
  { label: "Technical fit", value: 70 },
  { label: "Sector fit", value: 100 },
  { label: "Capability fit", value: 63 },
  { label: "Experience fit", value: 100 },
  { label: "Eligibility fit", value: 88 },
];

function GrantPilotFit({ accent }: { accent: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <FadeIn className="min-w-0 lg:col-span-5">
        <p className="label text-ash">Signature · Explainable qualification</p>
        <h3 className="display-wide mt-4 text-[clamp(1.75rem,3vw,2.75rem)] text-bone">A score that shows its reasons.</h3>
        <p className="mt-5 max-w-[46ch] text-bone/75">
          Every opportunity is scored on five weighted dimensions. Each result comes with eligibility checks, capability gaps,
          risks and a Pursue / Review / Skip call, and the proposal and compliance workspaces build on it.
        </p>
        <p className="label mt-6 text-ash">From a real run · AI-Powered Drone Surveillance System, Ministry of Defence</p>
      </FadeIn>
      <FadeIn className="min-w-0 lg:col-span-7" delay={0.1}>
        <div className="border border-bone/10 bg-black/25 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-bone/10 pb-6">
            <div>
              <p className="label text-ash">Overall match</p>
              <p className="display mt-2 text-[clamp(4rem,8vw,6.5rem)] leading-none" style={{ color: accent }}>
                82%
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="label border border-[#4caf50]/50 px-3 py-1.5 text-[#8fd694]">Eligibility · Pass</span>
              <span className="label px-3 py-1.5 text-ink" style={{ background: accent }}>
                Pursue
              </span>
            </div>
          </div>
          <ul className="mt-6 space-y-5">
            {FIT.map((f, i) => (
              <li key={f.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-bone/80">{f.label}</span>
                  <span className="font-mono text-bone">{f.value}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-bone/10">
                  <motion.div
                    className="h-full"
                    style={{ background: f.value >= 80 ? "#4caf50" : accent }}
                    initial={{ width: reduce ? `${f.value}%` : 0 }}
                    whileInView={{ width: `${f.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.2 + i * 0.1 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}

export function GrantPilotFeature() {
  const project = getProject("grantpilot-ai");
  if (!project) return null;
  return (
    <LiveProjectFeature
      project={project}
      index="06.2"
      kicker="Live product · AI decision support"
      titleLines={["GrantPilot", "AI"]}
      pipelineLabel="Opportunity → review-ready bid"
      signature={<GrantPilotFit accent={project.atmosphere.accent} />}
    />
  );
}
