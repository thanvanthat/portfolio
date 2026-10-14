"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "show" | "input" | "result";

interface RoundStats {
  correct: boolean;
  msPerTile: number;
}

const ACCENT = "#b7a4ff";

const gridFor = (level: number) => (level < 3 ? 3 : level < 6 ? 4 : 5);
const countFor = (level: number) => Math.min(3 + level, gridFor(level) ** 2 - 3);
const flashFor = (level: number) => Math.max(650, 1300 - level * 80);

function pick(n: number, total: number) {
  const set = new Set<number>();
  while (set.size < n) set.add(Math.floor(Math.random() * total));
  return set;
}

/**
 * A playable slice of the BrainVerse idea: a pattern-memory round whose
 * grid size, pattern length and flash time adapt to how the player performs.
 * The adaptation here is a simplified rule set for demonstration.
 */
export function AdaptiveMemoryGame() {
  const [level, setLevel] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [targets, setTargets] = useState<Set<number>>(new Set());
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);
  const [history, setHistory] = useState<RoundStats[]>([]);
  const [decision, setDecision] = useState("Press start. The system will read how you play.");
  const startedAt = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  const size = gridFor(level);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const startRound = useCallback((lvl: number) => {
    const s = gridFor(lvl);
    setTargets(pick(countFor(lvl), s * s));
    setPicked(new Set());
    setWrong(null);
    setPhase("show");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhase("input");
      startedAt.current = performance.now();
    }, flashFor(lvl));
  }, []);

  const finish = (correct: boolean, tilesDone: number, now: number) => {
    const ms = (now - startedAt.current) / Math.max(1, tilesDone);
    const next = correct ? level + (ms < 550 ? 2 : 1) : Math.max(0, level - 1);
    setHistory((h) => [...h.slice(-7), { correct, msPerTile: ms }]);
    setDecision(
      correct
        ? ms < 550
          ? `Fast and accurate (${Math.round(ms)} ms/tile) → skipping ahead to level ${next + 1}.`
          : `Accurate (${Math.round(ms)} ms/tile) → raising difficulty to level ${next + 1}.`
        : `Missed a tile → easing back to level ${next + 1} to keep you in flow.`,
    );
    setPhase("result");
    setLevel(next);
    timer.current = window.setTimeout(() => startRound(next), 1400);
  };

  const onTile = (i: number, now: number) => {
    if (phase !== "input" || picked.has(i)) return;
    if (!targets.has(i)) {
      setWrong(i);
      finish(false, picked.size + 1, now);
      return;
    }
    const nextPicked = new Set(picked).add(i);
    setPicked(nextPicked);
    if (nextPicked.size === targets.size) finish(true, nextPicked.size, now);
  };

  const accuracy = history.length ? Math.round((history.filter((h) => h.correct).length / history.length) * 100) : 0;
  const avgMs = history.length ? Math.round(history.reduce((a, h) => a + h.msPerTile, 0) / history.length) : 0;

  return (
    <div className="grid gap-px bg-bone/10 lg:grid-cols-[1fr_1.1fr]">
      {/* Game board */}
      <div className="flex flex-col items-center justify-center gap-6 bg-[#0f0c1c] p-6 sm:p-10">
        <div className="label flex w-full max-w-[20rem] justify-between text-ash">
          <span>Pattern memory</span>
          <span>
            {phase === "show" ? "Memorise" : phase === "input" ? "Your turn" : phase === "result" ? "Adapting…" : "Ready"}
          </span>
        </div>
        <div
          className="grid w-full max-w-[20rem] gap-2"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          role="group"
          aria-label={`Pattern memory grid, ${size} by ${size}`}
        >
          {Array.from({ length: size * size }, (_, i) => {
            const lit = (phase === "show" && targets.has(i)) || picked.has(i);
            const missed = phase === "result" && targets.has(i) && !picked.has(i);
            return (
              <motion.button
                key={`${size}-${i}`}
                type="button"
                layout
                onClick={(e) => onTile(i, e.timeStamp)}
                disabled={phase !== "input"}
                aria-label={`Tile ${i + 1}`}
                className={cn(
                  "aspect-square border transition-colors duration-200",
                  wrong === i ? "border-[#ff6a6a] bg-[#ff6a6a]/60" : "border-bone/15",
                  phase === "input" && "hover-fine:border-bone/50",
                )}
                style={{
                  background: lit ? ACCENT : missed ? `${ACCENT}33` : undefined,
                  boxShadow: lit ? `0 0 24px ${ACCENT}55` : undefined,
                }}
                whileTap={{ scale: 0.94 }}
              />
            );
          })}
        </div>
        {phase === "idle" && (
          <button
            type="button"
            onClick={() => startRound(level)}
            className="label min-h-12 bg-bone px-6 py-3 text-ink"
            data-cursor="explore"
            data-cursor-label="Play"
          >
            Start demo
          </button>
        )}
      </div>

      {/* Analysis HUD */}
      <div className="flex flex-col justify-between gap-8 bg-[#0d0b16] p-6 sm:p-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            ["Level", String(level + 1).padStart(2, "0")],
            ["Accuracy", history.length ? `${accuracy}%` : "—"],
            ["ms / tile", history.length ? String(avgMs) : "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="label text-ash">{k}</p>
              <p className="display mt-2 text-4xl tabular-nums text-bone sm:text-5xl">{v}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="label text-ash">Difficulty</p>
          <div className="mt-3 flex gap-1" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="h-2 flex-1 transition-colors duration-500"
                style={{ background: i <= Math.min(9, level) ? ACCENT : "rgb(236 235 230 / 0.08)" }}
              />
            ))}
          </div>
          <div className="mt-6 flex h-14 items-end gap-1.5" aria-hidden="true">
            {history.map((h, i) => (
              <span
                key={i}
                className="w-full"
                style={{
                  height: `${Math.max(12, 100 - Math.min(100, h.msPerTile / 12))}%`,
                  background: h.correct ? ACCENT : "#ff6a6a",
                  opacity: 0.4 + (i / history.length) * 0.6,
                }}
              />
            ))}
          </div>
        </div>

        <div aria-live="polite">
          <p className="label text-ash">AI decision</p>
          <p className="mt-2 text-lg leading-snug text-bone">{decision}</p>
          <p className="label mt-6 text-ash">Interactive demo · simplified adaptive rules</p>
        </div>
      </div>
    </div>
  );
}
