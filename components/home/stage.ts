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
}

export const pointer = { x: 0, y: 0 };

/** Per-frame values the scene shares between its parts (camera rig, screen, player). */
export const live = {
  /** Smoothed stage the camera is currently showing. */
  s: -1,
  /** Clock time of the last click on the cabinet ("press start"). */
  pressedAt: -100,
  /** prefers-reduced-motion: no idle bobbing, parallax or celebration loops. */
  reduced: false,
};

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

/** Anchor elements, looked up once per page instead of on every frame. */
let anchors: { chapters: Element[]; works: HTMLElement | null; outro: HTMLElement | null } | null = null;

export function resetStage() {
  anchors = null;
  gallery.work = 0;
}

function getAnchors() {
  if (!anchors || !anchors.chapters[0]?.isConnected) {
    anchors = {
      chapters: Array.from(document.querySelectorAll("[data-stage]")),
      works: document.getElementById("works"),
      outro: document.getElementById("contact"),
    };
  }
  return anchors;
}

export function readStage(out: StageState): StageState {
  const vh = window.innerHeight;
  const line = window.scrollY + vh * NODE_LINE;
  const top = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

  const { chapters, works, outro } = getAnchors();
  const n = chapters.length;

  out.work = gallery.work;
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
      out.s = n - 1 + smooth(p);
    }
  }
  if (outro) {
    const rect = outro.getBoundingClientRect();
    if (rect.top < vh) {
      const p = clamp(1 - rect.top / vh, 0, 1);
      out.s = n + smooth(p);
    }
  }
  return out;
}
