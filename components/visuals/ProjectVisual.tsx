import { useId, type ReactElement } from "react";
import type { Project, ProjectAtmosphere, ProjectVisualKey } from "@/lib/types";
import { cn, r2, seeded } from "@/lib/utils";

interface ProjectVisualProps {
  project: Pick<Project, "visual" | "atmosphere" | "title">;
  variant?: number;
  className?: string;
  /** Adds slow ambient CSS motion to parts of the artwork. */
  animated?: boolean;
}

const W = 1600;
const H = 1000;

interface SceneProps {
  a: ProjectAtmosphere;
  id: string;
  variant: number;
  animated: boolean;
}

/**
 * Procedural key art for each project, rendered as lightweight SVG so the
 * portfolio ships without heavy image payloads. Deterministic per variant.
 */
export function ProjectVisual({ project, variant = 0, className, animated = false }: ProjectVisualProps) {
  const id = useId().replace(/:/g, "");
  const Scene = scenes[project.visual];
  const a = project.atmosphere;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      role="img"
      aria-label={`${project.title} key art`}
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor={a.glow} stopOpacity="0.9" />
          <stop offset="60%" stopColor={a.base} stopOpacity="1" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a.accent} />
          <stop offset="100%" stopColor={a.glow} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <Scene a={a} id={id} variant={variant} animated={animated} />
      <rect width={W} height={H} fill={`url(#${id}-fade)`} opacity="0.55" />
    </svg>
  );
}

/* ---------------------------------------------------------------- BrainVerse */

function BrainVerseScene({ a, variant, animated }: SceneProps) {
  const rand = seeded(11 + variant * 7);
  const cx = variant === 1 ? 1050 : 800;
  const cy = 470;
  const nodes = Array.from({ length: 70 }, () => {
    const angle = rand() * Math.PI * 2;
    const r = Math.pow(rand(), 0.6) * 330;
    return { x: r2(cx + Math.cos(angle) * r * 1.35), y: r2(cy + Math.sin(angle) * r * 0.9), s: r2(1.5 + rand() * 3.5) };
  });
  const edges: [number, number][] = [];
  nodes.forEach((n, i) => {
    nodes.forEach((m, j) => {
      if (j <= i) return;
      const d = Math.hypot(n.x - m.x, n.y - m.y);
      if (d < 120 && rand() > 0.35) edges.push([i, j]);
    });
  });

  return (
    <g>
      {[160, 260, 380, 520].map((r, i) => (
        <ellipse
          key={r}
          cx={cx}
          cy={cy}
          rx={r * 1.35}
          ry={r * 0.9}
          fill="none"
          stroke={a.accent}
          strokeOpacity={0.12 - i * 0.02}
        />
      ))}
      <g stroke={a.accent} strokeOpacity="0.28" strokeWidth="1">
        {edges.map(([i, j]) => (
          <line key={`${i}-${j}`} x1={nodes[i]!.x} y1={nodes[i]!.y} x2={nodes[j]!.x} y2={nodes[j]!.y} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.s}
          fill={i % 9 === 0 ? a.accent : "#ecebe6"}
          opacity={i % 9 === 0 ? 1 : 0.55}
          style={animated && i % 9 === 0 ? { animation: `pulse-dot ${2 + (i % 5) * 0.4}s ${i * 0.1}s infinite` } : undefined}
        />
      ))}
      {/* Memory grid mock */}
      <g transform={variant === 1 ? "translate(170 300)" : "translate(1180 610)"}>
        {Array.from({ length: 16 }, (_, i) => {
          const x = (i % 4) * 58;
          const y = Math.floor(i / 4) * 58;
          const lit = [1, 6, 11, 12].includes(i);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="48"
              height="48"
              fill={lit ? a.accent : "transparent"}
              fillOpacity={lit ? 0.85 : 0}
              stroke="#ecebe6"
              strokeOpacity="0.25"
            />
          );
        })}
        <text x="0" y="-18" fill="#ecebe6" opacity="0.6" fontFamily="monospace" fontSize="14" letterSpacing="3">
          LEVEL 07 · ADAPTIVE
        </text>
      </g>
      {/* Difficulty curve */}
      <g transform="translate(140 800)" opacity={variant === 2 ? 1 : 0.7}>
        <polyline
          points="0,80 80,70 160,74 240,50 320,58 400,30 480,36 560,14 640,20"
          fill="none"
          stroke={a.accent}
          strokeWidth="2"
        />
        <line x1="0" y1="96" x2="640" y2="96" stroke="#ecebe6" strokeOpacity="0.2" />
        <text x="0" y="124" fill="#ecebe6" opacity="0.5" fontFamily="monospace" fontSize="13" letterSpacing="3">
          DIFFICULTY ↔ PERFORMANCE
        </text>
      </g>
    </g>
  );
}

/* ------------------------------------------------------------- FreshCO AI */

function FreshcoScene({ a, variant, animated }: SceneProps) {
  const items = [
    { x: 520, y: 520, r: 120, label: "APPLE", conf: "0.94", c: "#c9453a" },
    { x: 820, y: 470, r: 100, label: "TOMATO", conf: "0.91", c: "#d8543a" },
    { x: 1080, y: 560, r: 130, label: "ORANGE", conf: "0.88", c: "#e08a2e" },
    { x: 700, y: 700, r: 90, label: "LIME", conf: "0.86", c: "#7fb043" },
  ];
  const offset = variant === 1 ? 70 : 0;
  return (
    <g transform={variant === 2 ? "translate(-520 -330) scale(1.6)" : undefined}>
      {Array.from({ length: 17 }, (_, i) => (
        <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={H} stroke="#ecebe6" strokeOpacity="0.04" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 100} x2={W} y2={i * 100} stroke="#ecebe6" strokeOpacity="0.04" />
      ))}
      {items.map((it, i) => (
        <g key={it.label} transform={`translate(${offset * (i % 2 ? -1 : 1)} 0)`}>
          <circle cx={it.x} cy={it.y} r={it.r} fill={it.c} opacity="0.85" />
          <circle cx={it.x - it.r * 0.35} cy={it.y - it.r * 0.35} r={it.r * 0.28} fill="#fff" opacity="0.12" />
          <path
            d={`M${it.x} ${it.y - it.r} q 18 -40 50 -46`}
            stroke="#5f7d2d"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x={it.x - it.r - 18}
            y={it.y - it.r - 18}
            width={(it.r + 18) * 2}
            height={(it.r + 18) * 2}
            fill="none"
            stroke={a.accent}
            strokeWidth="2"
          />
          <rect x={it.x - it.r - 18} y={it.y - it.r - 48} width="190" height="30" fill={a.accent} />
          <text x={it.x - it.r - 8} y={it.y - it.r - 28} fill="#0a0f0a" fontFamily="monospace" fontSize="14" letterSpacing="2">
            {it.label} · {it.conf}
          </text>
        </g>
      ))}
      <g opacity="0.9">
        <rect
          x="0"
          y="0"
          width={W}
          height="4"
          fill={a.accent}
          style={animated ? { animation: "scan 4.5s linear infinite" } : { transform: "translateY(380px)" }}
        />
      </g>
      {/* Viewfinder corners */}
      {[
        [220, 180, 1, 1],
        [1380, 180, -1, 1],
        [220, 860, 1, -1],
        [1380, 860, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <path
          key={i}
          d={`M${x} ${y! + 60 * sy!} V${y} H${x! + 60 * sx!}`}
          stroke="#ecebe6"
          strokeOpacity="0.7"
          strokeWidth="2"
          fill="none"
        />
      ))}
      <text x="240" y="160" fill="#ecebe6" opacity="0.6" fontFamily="monospace" fontSize="14" letterSpacing="3">
        DETECT · CLASSIFY · ESTIMATE
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------- Echo Protocol */

function EchoScene({ a, variant, animated }: SceneProps) {
  const vx = variant === 1 ? 980 : 800;
  const vy = 470;
  const frames = [0.9, 0.7, 0.52, 0.38, 0.27, 0.19];
  return (
    <g>
      {/* Corridor frames in one-point perspective */}
      {frames.map((s, i) => {
        const w = W * s;
        const h = H * s * 1.05;
        return (
          <rect
            key={i}
            x={vx - w / 2}
            y={vy - h / 2}
            width={w}
            height={h}
            fill="none"
            stroke={i === 2 ? a.accent : "#ecebe6"}
            strokeOpacity={i === 2 ? 0.8 : 0.12 + i * 0.03}
            strokeWidth={i === 2 ? 3 : 1.5}
          />
        );
      })}
      {[
        [0, 0],
        [W, 0],
        [0, H],
        [W, H],
      ].map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={vx} y2={vy} stroke="#ecebe6" strokeOpacity="0.1" />
      ))}
      {/* Emergency light strip */}
      <rect
        x={vx - W * 0.26}
        y={vy - H * 0.29}
        width={W * 0.52}
        height="6"
        fill={a.accent}
        opacity="0.9"
        style={animated ? { animation: "pulse-dot 1.6s infinite" } : undefined}
      />
      {/* Exit doorway glow */}
      <rect x={vx - 60} y={vy - 90} width="120" height="190" fill={a.accent} opacity="0.35" />
      <rect x={vx - 42} y={vy - 76} width="84" height="176" fill="#ffd2bf" opacity="0.6" />
      {/* Character silhouette */}
      <g transform={`translate(${vx - 10} ${vy + 150}) scale(${variant === 2 ? 0.8 : 1.25})`} fill="#050505">
        <circle cx="0" cy="-230" r="26" />
        <path d="M-40 -200 Q0 -215 40 -200 L52 -80 L34 -76 L30 -40 L40 80 L14 80 L2 -20 L-6 80 L-32 80 L-24 -40 L-34 -76 L-52 -80 Z" />
      </g>
      {/* Floor reflection */}
      <rect x={vx - 300} y={vy + 250} width="600" height="2" fill={a.accent} opacity="0.35" />
      <text x="140" y="140" fill="#ecebe6" opacity="0.55" fontFamily="monospace" fontSize="14" letterSpacing="3">
        SECTOR 04 · CONTAINMENT BREACH
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------- Eco Dash */

function EcoDashScene({ a, variant, animated }: SceneProps) {
  const hy = 520;
  const vx = 800;
  const rand = seeded(5 + variant);
  return (
    <g>
      <circle cx={variant === 1 ? 1180 : 800} cy={hy - 40} r="150" fill={a.accent} opacity="0.2" />
      <circle cx={variant === 1 ? 1180 : 800} cy={hy - 40} r="90" fill={a.accent} opacity="0.35" />
      {/* Hills */}
      <path d={`M0 ${hy} Q 300 ${hy - 90} 600 ${hy} T 1200 ${hy} T 1600 ${hy - 30} V ${hy} H0 Z`} fill={a.glow} opacity="0.9" />
      {/* Wind turbines */}
      {[260, 420, 1250, 1420].map((x, i) => (
        <g key={x} transform={`translate(${x} ${hy - 30 - (i % 2) * 30})`}>
          <line x1="0" y1="0" x2="0" y2="-160" stroke="#ecebe6" strokeOpacity="0.6" strokeWidth="3" />
          <g
            transform="translate(0 -160)"
            style={
              animated
                ? { animation: `spin ${6 + i}s linear infinite`, transformBox: "fill-box", transformOrigin: "center" }
                : undefined
            }
          >
            {[0, 120, 240].map((deg) => (
              <line
                key={deg}
                x1="0"
                y1="0"
                x2="0"
                y2="-70"
                stroke="#ecebe6"
                strokeOpacity="0.7"
                strokeWidth="3"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>
        </g>
      ))}
      {/* Ground + lanes */}
      <rect x="0" y={hy} width={W} height={H - hy} fill="#040806" />
      {[-1.5, -0.5, 0.5, 1.5].map((l) => (
        <line key={l} x1={vx + l * 12} y1={hy} x2={vx + l * 700} y2={H} stroke={a.accent} strokeOpacity="0.45" strokeWidth="2" />
      ))}
      {Array.from({ length: 9 }, (_, i) => {
        const t = Math.pow(i / 9, 2);
        const y = hy + t * (H - hy);
        return <line key={i} x1="0" y1={r2(y)} x2={W} y2={r2(y)} stroke="#ecebe6" strokeOpacity={r2(0.04 + t * 0.08)} />;
      })}
      {/* Collectibles */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = 0.15 + i * 0.12;
        const lane = Math.floor(rand() * 3) - 1;
        const y = hy + t * t * (H - hy) + 10;
        const x = vx + lane * t * 700;
        return <circle key={i} cx={r2(x)} cy={r2(y - 24 * t)} r={r2(6 + t * 18)} fill={a.accent} opacity={r2(0.5 + t * 0.4)} />;
      })}
      {/* Runner */}
      <g transform={`translate(${vx} ${H - 120}) scale(1.1)`} fill="#ecebe6">
        <circle cx="0" cy="-120" r="18" />
        <path d="M-18 -98 L18 -98 L26 -30 L44 10 L28 14 L10 -20 L0 30 L-20 30 L-10 -30 L-30 -60 L-20 -64 Z" />
      </g>
      <text x="140" y="140" fill="#ecebe6" opacity="0.55" fontFamily="monospace" fontSize="14" letterSpacing="3">
        RUN 128 · WORLD RECOVERY 64%
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------- Event platform */

function EventPlatformScene({ a, variant }: SceneProps) {
  const rows = ["REGISTER", "SCHEDULE", "BUILD", "SHOWCASE"];
  return (
    <g>
      <g transform={variant === 1 ? "translate(-120 0)" : undefined}>
        <text x="120" y="420" fill="#ecebe6" fontFamily="sans-serif" fontWeight="900" fontSize="260" letterSpacing="-8">
          GAME
        </text>
        <text
          x="120"
          y="660"
          fill="none"
          stroke={a.accent}
          strokeWidth="3"
          fontFamily="sans-serif"
          fontWeight="900"
          fontSize="260"
          letterSpacing="-8"
        >
          JAM
        </text>
      </g>
      <g transform="translate(980 220)">
        {rows.map((r, i) => (
          <g key={r} transform={`translate(0 ${i * 120})`}>
            <line x1="0" y1="0" x2="480" y2="0" stroke="#ecebe6" strokeOpacity="0.25" />
            <text
              x="0"
              y="60"
              fill="#ecebe6"
              opacity={i === variant ? 1 : 0.55}
              fontFamily="monospace"
              fontSize="26"
              letterSpacing="4"
            >
              0{i + 1} — {r}
            </text>
            {i === variant && <rect x="440" y="36" width="40" height="30" fill={a.accent} />}
          </g>
        ))}
      </g>
      <g transform="translate(120 760)">
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={i}
            x={i * 150}
            y="0"
            width="130"
            height="90"
            fill={i % 3 === 0 ? a.accent : "#ecebe6"}
            opacity={i % 3 === 0 ? 0.7 : 0.08}
          />
        ))}
      </g>
    </g>
  );
}

const scenes: Record<ProjectVisualKey, (props: SceneProps) => ReactElement> = {
  brainverse: BrainVerseScene,
  gilli: EcoDashScene,
  snakes: EventPlatformScene,
  freshco: FreshcoScene,
  grantpilot: EventPlatformScene,
  echo: EchoScene,
  ecodash: EcoDashScene,
  eventplatform: EventPlatformScene,
};
