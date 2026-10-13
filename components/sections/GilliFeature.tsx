import { getProject } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { LiveProjectFeature } from "./LiveProjectFeature";

const OUTS = [
  { label: "Three misses", detail: "Three swings in a row that miss the gilli." },
  { label: "Caught", detail: "A fielder catches the gilli before it lands." },
  { label: "Danda hit", detail: "A fielder's throw hits the danda laid across the pit." },
];

/** How Gilli scores: the real rule, worked through on a hit from an actual match. */
function GilliScore({ accent }: { accent: string }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <FadeIn className="min-w-0 lg:col-span-5">
        <p className="label text-ash">Signature · Physics is the referee</p>
        <h3 className="display-wide mt-4 text-[clamp(1.75rem,3vw,2.75rem)] text-bone">Every point is measured.</h3>
        <p className="mt-5 max-w-[46ch] text-bone/75">
          The engine simulates the gilli until it stops, measures the distance from the pit and counts it in danda lengths. Nobody
          judges a hit by eye, so the computer and online players all play by exactly the same rules.
        </p>
        <ul className="mt-8 space-y-3">
          {OUTS.map((o) => (
            <li key={o.label} className="grid grid-cols-[8rem_1fr] gap-4 border-t border-bone/10 pt-3 text-sm">
              <span className="label pt-0.5" style={{ color: accent }}>
                Out · {o.label}
              </span>
              <span className="text-bone/70">{o.detail}</span>
            </li>
          ))}
        </ul>
      </FadeIn>
      <FadeIn className="min-w-0 lg:col-span-7" delay={0.1}>
        <div className="border border-bone/10 bg-black/30">
          <div className="label flex items-center justify-between border-b border-bone/10 px-5 py-3 text-ash">
            <span>Gilli.Core · MatchRules</span>
            <span style={{ color: accent }}>danda = 0.75 m</span>
          </div>
          <pre
            tabIndex={0}
            role="region"
            aria-label="Gilli scoring rule"
            className="overflow-x-auto px-5 py-6 font-mono text-[0.78rem] leading-relaxed text-bone/85 sm:text-sm"
          >
            {`points = floor(distance ÷ 0.75 m) + 1 bonus`}
          </pre>
          <div className="border-t border-bone/10 px-5 py-6">
            <p className="label text-ash">From a real match</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
              <p className="display text-[clamp(3.5rem,8vw,6rem)] leading-none" style={{ color: accent }}>
                Safe! +33
              </p>
              <p className="font-mono text-sm text-bone/80">
                24.42 m ÷ 0.75 = 32 dandas
                <br />
                32 + 1 bonus = 33 points
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export function GilliFeature() {
  const project = getProject("gilli");
  if (!project) return null;
  return (
    <LiveProjectFeature
      project={project}
      index="04.1"
      kicker="Live game · Physics & multiplayer"
      pipelineLabel="One strike, start to finish"
      signature={<GilliScore accent={project.atmosphere.accent} />}
    />
  );
}
