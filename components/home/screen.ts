/**
 * Draws the arcade cabinet's CRT screen and marquee into canvases that the
 * scene uses as glowing textures. Pure 2D canvas, redrawn only when needed.
 */

export const SCREEN_W = 512;
export const SCREEN_H = 384;

export interface ScreenChapter {
  numeral: string;
  title: string;
  tags: string[];
}

export interface ScreenWork {
  number: string;
  title: string;
  accent: string;
  base: string;
  cover?: string;
}

export type ScreenMode =
  | { kind: "eyes"; lookX: number; lookY: number; blink: number; tick: number }
  | { kind: "chapter"; index: number; tick: number }
  | { kind: "work"; index: number }
  | { kind: "outro"; tick: number };

let PIXEL = "ui-monospace, monospace";

/** next/font hashes family names, so the scene passes the resolved mono stack in. */
export function setScreenFont(family: string) {
  if (family.trim()) PIXEL = `${family}, ui-monospace, monospace`;
}
const covers = new Map<string, HTMLImageElement>();

/** Starts loading every cover once; `onLoad` asks for a redraw. */
export function preloadCovers(works: ScreenWork[], onLoad: () => void) {
  for (const w of works) {
    if (!w.cover || covers.has(w.cover)) continue;
    const img = new Image();
    img.decoding = "async";
    img.onload = onLoad;
    img.src = w.cover;
    covers.set(w.cover, img);
  }
}

function crt(ctx: CanvasRenderingContext2D, bg = "#0b1712") {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
}

/** Scanlines and a soft vignette, drawn last over every mode. */
function glass(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let y = 0; y < SCREEN_H; y += 4) ctx.fillRect(0, y, SCREEN_W, 2);
  const g = ctx.createRadialGradient(SCREEN_W / 2, SCREEN_H / 2, SCREEN_H * 0.3, SCREEN_W / 2, SCREEN_H / 2, SCREEN_W * 0.7);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
}

function text(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: CanvasTextAlign = "center",
  weight = 500,
) {
  ctx.font = `${weight} ${size}px ${PIXEL}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
}

/** Two big pixel eyes whose pupils follow the cursor. */
function eyes(ctx: CanvasRenderingContext2D, m: Extract<ScreenMode, { kind: "eyes" }>) {
  crt(ctx);
  const green = "#b9f5c8";
  const cy = SCREEN_H * 0.44;
  for (const cx of [SCREEN_W * 0.33, SCREEN_W * 0.67]) {
    const h = 128 * (1 - m.blink * 0.94);
    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.roundRect(cx - 52, cy - h / 2, 104, h, Math.min(40, h / 2));
    ctx.fill();
    if (m.blink < 0.6) {
      ctx.fillStyle = "#0b1712";
      const px = cx + m.lookX * 26;
      const py = cy - m.lookY * 30 * (1 - m.blink);
      ctx.fillRect(px - 18, py - 18, 36, 36);
    }
  }
  if (Math.floor(m.tick * 1.6) % 2 === 0) text(ctx, "PRESS START", SCREEN_W / 2, SCREEN_H * 0.82, 26, green, "center", 700);
}

function chapter(ctx: CanvasRenderingContext2D, c: ScreenChapter, index: number, total: number, tick: number) {
  crt(ctx);
  const green = "#b9f5c8";
  text(ctx, `LEVEL ${index + 1}/${total}`, 28, 36, 18, "rgba(185,245,200,0.7)", "left");
  text(ctx, c.numeral, SCREEN_W / 2, SCREEN_H * 0.4, 120, green, "center", 700);
  text(ctx, c.title.toUpperCase(), SCREEN_W / 2, SCREEN_H * 0.68, 34, green, "center", 700);
  const tags = c.tags.slice(0, 3).join(" · ").toUpperCase();
  text(ctx, tags, SCREEN_W / 2, SCREEN_H * 0.82, 15, "rgba(185,245,200,0.7)");
  // A progress bar that fills while the level is on screen
  const w = SCREEN_W - 56;
  ctx.fillStyle = "rgba(185,245,200,0.18)";
  ctx.fillRect(28, SCREEN_H - 30, w, 6);
  ctx.fillStyle = green;
  ctx.fillRect(28, SCREEN_H - 30, w * ((tick * 0.25) % 1), 6);
}

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const r = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const iw = img.naturalWidth * r;
  const ih = img.naturalHeight * r;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

function work(ctx: CanvasRenderingContext2D, w: ScreenWork) {
  crt(ctx, w.base);
  const img = w.cover ? covers.get(w.cover) : undefined;
  if (img?.complete && img.naturalWidth) {
    cover(ctx, img, 0, 0, SCREEN_W, SCREEN_H);
  } else {
    const g = ctx.createLinearGradient(0, 0, SCREEN_W, SCREEN_H);
    g.addColorStop(0, w.base);
    g.addColorStop(1, w.accent);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    text(ctx, w.title.toUpperCase(), SCREEN_W / 2, SCREEN_H / 2, 34, "#f4f1ea", "center", 700);
  }
  ctx.fillStyle = "rgba(8,10,12,0.78)";
  ctx.fillRect(0, SCREEN_H - 52, SCREEN_W, 52);
  text(ctx, w.number, 22, SCREEN_H - 26, 20, w.accent, "left", 700);
  text(ctx, w.title.toUpperCase(), 70, SCREEN_H - 26, 20, "#f4f1ea", "left", 700);
}

function outro(ctx: CanvasRenderingContext2D, tick: number) {
  crt(ctx);
  const green = "#b9f5c8";
  text(ctx, "THANKS FOR", SCREEN_W / 2, SCREEN_H * 0.36, 44, green, "center", 700);
  text(ctx, "PLAYING", SCREEN_W / 2, SCREEN_H * 0.52, 44, green, "center", 700);
  if (Math.floor(tick * 1.6) % 2 === 0) text(ctx, "INSERT COIN TO CONTINUE", SCREEN_W / 2, SCREEN_H * 0.78, 20, green);
}

export function drawScreen(ctx: CanvasRenderingContext2D, mode: ScreenMode, chapters: ScreenChapter[], works: ScreenWork[]) {
  ctx.save();
  if (mode.kind === "eyes") eyes(ctx, mode);
  else if (mode.kind === "chapter") chapter(ctx, chapters[mode.index]!, mode.index, chapters.length, mode.tick);
  else if (mode.kind === "work") work(ctx, works[mode.index]!);
  else outro(ctx, mode.tick);
  glass(ctx);
  ctx.restore();
}

export function drawMarquee(ctx: CanvasRenderingContext2D, name: string, sub: string) {
  const { width: w, height: h } = ctx.canvas;
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "#ff8a4c");
  g.addColorStop(0.5, "#ffd166");
  g.addColorStop(1, "#ff8a4c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.font = `800 ${h * 0.42}px ${PIXEL}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#2a1408";
  ctx.fillText(name.toUpperCase(), w / 2, h * 0.42);
  ctx.font = `600 ${h * 0.16}px ${PIXEL}`;
  ctx.fillText(sub.toUpperCase(), w / 2, h * 0.8);
}
