import { getProject } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { LiveProjectFeature } from "./LiveProjectFeature";

/** The snake bite, as the game's animation controller sequences it. */
const BITE = [
  { step: "Notice", detail: "The snake registers the character landing on its head square." },
  { step: "Turn", detail: "Its head and neck turn toward the character." },
  { step: "Rear back", detail: "The neck pulls back and the hinged jaw opens." },
  { step: "Strike", detail: "It strikes at the character's actual position, not the square's centre." },
  { step: "Impact", detail: "Camera shake, sparks, a bite sound and a recoil pose." },
  { step: "Retract", detail: "The snake returns to its idle coil." },
  { step: "Slide", detail: "The character slides down the snake's real body curve." },
  { step: "Land", detail: "They land on the tail square and the next turn begins." },
];

function SnakeBite({ accent }: { accent: string }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
      <FadeIn className="min-w-0 lg:col-span-5">
        <p className="label text-ash">Signature · The bite</p>
        <h3 className="display-wide mt-4 text-[clamp(1.75rem,3vw,2.75rem)] text-bone">The snakes actually bite.</h3>
        <p className="mt-5 max-w-[46ch] text-bone/75">
          Landing on a snake’s head plays a full sequence instead of a teleport. The rules engine decides the whole turn up front,
          then each stage waits for its animation to finish, so turns can never overlap or skip.
        </p>
        <p className="mt-6 font-mono text-sm text-bone/70">READY → ROLLING → MOVING → SNAKE_BITE | CLIMBING_LADDER → READY</p>
      </FadeIn>
      <FadeIn className="min-w-0 lg:col-span-7" delay={0.1}>
        <ol className="border border-bone/10 bg-black/30">
          {BITE.map((b, i) => (
            <li
              key={b.step}
              className="grid grid-cols-[3rem_8rem_1fr] items-baseline gap-4 border-b border-bone/10 px-5 py-4 last:border-b-0"
            >
              <span className="label text-ash">{String(i + 1).padStart(2, "0")}</span>
              <span className="label" style={{ color: accent }}>
                {b.step}
              </span>
              <span className="text-sm text-bone/75">{b.detail}</span>
            </li>
          ))}
        </ol>
      </FadeIn>
    </div>
  );
}

export function SnakesFeature() {
  const project = getProject("snakes-and-ladders-3d");
  if (!project) return null;
  return (
    <LiveProjectFeature
      project={project}
      index="04.2"
      kicker="Live game · 3D tabletop"
      titleLines={["Snakes &", "Ladders 3D"]}
      pipelineLabel="One turn, start to finish"
      signature={<SnakeBite accent={project.atmosphere.accent} />}
    />
  );
}
