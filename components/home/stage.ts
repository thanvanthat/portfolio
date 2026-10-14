/**
 * Scroll → scene state for the homepage.
 *
 * The page is HTML in front of one fixed 3D scene. The scene never reads React
 * state; it calls `readStage()` every frame, which measures the DOM anchors and
 * returns a continuous stage value:
 *
 *   -1  hero            0..n-1  journey chapters
 *    n  works gallery   n+1     outro
 *
 * Integer values are "dwell" points where the camera rests on a shot.
 */

export interface StageState {
  /** Continuous stage, see above. */
  s: number;
  /** Index of the project the gallery is showing. */
  work: number;
  /** 0 → 1 while the works gallery covers the screen. */
  works: number;
}

export const pointer = { x: 0, y: 0 };

const NODE_LINE = 0.35; // reference line, from the top of the viewport
const DWELL = 0.32; // share of each scroll segment the camera holds still

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function dwell(t: number) {
  if (t < DWELL) return 0;
  if (t > 1 - DWELL) return 1;
  return smooth((t - DWELL) / (1 - 2 * DWELL));
}

/** The active project index is pushed here by the gallery as it scrolls. */
export const gallery = { work: 0 };

export function readStage(out: StageState): StageState {
  const vh = window.innerHeight;
  const line = window.scrollY + vh * NODE_LINE;
  const top = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

  const chapters = Array.from(document.querySelectorAll("[data-stage]"));
  const works = document.getElementById("works");
  const outro = document.getElementById("contact");
  const n = chapters.length;

  out.work = gallery.work;
  out.works = 0;
  if (!n) {
    out.s = -1;
    return out;
  }

  const tops = chapters.map(top);
  if (line <= tops[0]!) {
    const span = Math.max(1, tops[0]! - vh * NODE_LINE);
    out.s = -1 + dwell(clamp(window.scrollY / span, 0, 1));
  } else {
    out.s = n - 1;
    for (let i = 0; i < n - 1; i++) {
      if (line <= tops[i + 1]!) {
        out.s = i + dwell((line - tops[i]!) / Math.max(1, tops[i + 1]! - tops[i]!));
        break;
      }
    }
  }

  if (works) {
    const rect = works.getBoundingClientRect();
    if (rect.top < vh) {
      const p = clamp(1 - rect.top / vh, 0, 1);
      out.works = p;
      out.s = n - 1 + smooth(p);
    }
  }
  if (outro) {
    const rect = outro.getBoundingClientRect();
    if (rect.top < vh) {
      const p = clamp(1 - rect.top / vh, 0, 1);
      out.s = n + smooth(p);
      out.works = 1 - p;
    }
  }
  return out;
}
