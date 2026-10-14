import { getProject } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { LiveProjectFeature } from "./LiveProjectFeature";

const BANDS = [
  { label: "Spoiled", range: "0–24", from: 0, to: 25, color: "#c9453a" },
  { label: "Overripe", range: "25–44", from: 25, to: 45, color: "#e0893a" },
  { label: "Nearly spoiled", range: "45–79", from: 45, to: 80, color: "#e2b53e" },
  { label: "Fresh", range: "80–100", from: 80, to: 100, color: "#7fb043" },
];

const FORMULA = `penalty = W_defect   · defect_coverage
        + W_brown    · browning_index
        + W_discolor · discoloration
        + W_texture  · (1 − texture_uniformity)
        + W_colour   · (1 − colour_consistency)

score   = round(100 · (1 − clamp(penalty, 0, 1)))`;

/** How Fresora turns pixels into a score: the real formula and status bands. */
function FresoraScore({ accent }: { accent: string }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <FadeIn className="min-w-0 lg:col-span-5">
        <p className="label text-ash">Signature · An explainable score</p>
        <h3 className="display-wide mt-4 text-[clamp(1.75rem,3vw,2.75rem)] text-bone">No black box. Every point is measured.</h3>
        <p className="mt-5 max-w-[46ch] text-bone/75">
          OpenCV measures five visible signals. Weights differ by food family and always sum to 1. If a signal can’t be measured,
          its weight moves to the others. Meat, seafood and dairy are capped at 72, because a photo can’t prove they’re safe.
        </p>
      </FadeIn>
      <FadeIn className="min-w-0 lg:col-span-7" delay={0.1}>
        <div className="border border-bone/10 bg-black/30">
          <div className="label flex items-center justify-between border-b border-bone/10 px-5 py-3 text-ash">
            <span>backend/app/freshness.py</span>
            <span style={{ color: accent }}>opencv-heuristic-v1</span>
          </div>
          <pre
            tabIndex={0}
            role="region"
            aria-label="Freshness scoring formula"
            className="overflow-x-auto px-5 py-6 font-mono text-[0.78rem] leading-relaxed text-bone/85 sm:text-sm"
          >
            {FORMULA}
          </pre>
          <div className="border-t border-bone/10 px-5 py-5">
            <div className="flex h-3 w-full overflow-hidden">
              {BANDS.map((b) => (
                <span key={b.label} style={{ width: `${b.to - b.from}%`, background: b.color }} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {BANDS.map((b) => (
                <div key={b.label}>
                  <p className="label" style={{ color: b.color }}>
                    {b.label}
                  </p>
                  <p className="font-mono text-xs text-ash">{b.range}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export function FresoraFeature() {
  const project = getProject("fresora");
  if (!project) return null;
  return (
    <LiveProjectFeature
      project={project}
      index="06.1"
      kicker="Live product · Computer vision"
      pipelineLabel="Scan → rescue"
      signature={<FresoraScore accent={project.atmosphere.accent} />}
    />
  );
}
