import { seeded } from "@/lib/utils";

/**
 * Point clouds for the hero morph: a brain (AI), a game controller (games)
 * and a ringed planet (worlds). Each shape fills the same number of points
 * so particle i can travel from one shape to the next.
 *
 * Every function returns xyz positions plus a 0–1 "feature" weight per point
 * (buttons, cerebellum, the planet's ring) that the shader tints with the accent.
 */

export interface PointCloud {
  positions: Float32Array;
  feature: Float32Array;
}

const TAU = Math.PI * 2;

function cloud(count: number): PointCloud {
  return { positions: new Float32Array(count * 3), feature: new Float32Array(count) };
}

function set(c: PointCloud, i: number, x: number, y: number, z: number, f = 0) {
  c.positions[i * 3] = x;
  c.positions[i * 3 + 1] = y;
  c.positions[i * 3 + 2] = z;
  c.feature[i] = f;
}

/** Uniform direction on the unit sphere. */
function direction(rand: () => number) {
  const u = rand() * 2 - 1;
  const t = rand() * TAU;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), u, s * Math.sin(t)] as const;
}

/* ------------------------------------------------------------------ Brain */

export function brainPoints(count: number, seed = 11): PointCloud {
  const rand = seeded(seed);
  const c = cloud(count);
  let i = 0;

  // Cerebrum: two hemispheres with folded (gyri) surfaces, seen from the side.
  const cerebrum = Math.floor(count * 0.8);
  while (i < cerebrum) {
    const [dx, dy, dz] = direction(rand);
    if (dy < -0.55) continue; // flat underside
    const folds = Math.sin(dx * 9 + dy * 4) * Math.sin(dy * 11 - dz * 3) + 0.6 * Math.sin(dz * 13 + dx * 6) * Math.cos(dy * 7);
    // Prefer points on the ridges so the folds read as lines
    if (rand() > 0.35 + 0.65 * Math.abs(folds) * 0.8) continue;
    const r = 1 + folds * 0.055;
    let x = dx * 1.3 * r;
    const y = dy * 0.92 * r + 0.1;
    let z = dz * 1.0 * r;
    // Longitudinal fissure between the hemispheres
    z += Math.sign(dz) * 0.07;
    x -= dy < 0 ? dy * dy * 0.25 : 0;
    set(c, i++, x, y, z);
  }

  // Cerebellum: small ridged lobe at the back, lower
  const cerebellum = cerebrum + Math.floor(count * 0.13);
  while (i < cerebellum) {
    const [dx, dy, dz] = direction(rand);
    const ridge = Math.sin(dy * 40);
    if (rand() > 0.4 + 0.6 * Math.abs(ridge)) continue;
    set(c, i++, -0.82 + dx * 0.48, -0.52 + dy * 0.28, dz * 0.62, 1);
  }

  // Brain stem
  while (i < count) {
    const a = rand() * TAU;
    const h = rand();
    const rr = 0.13 * (1 - h * 0.25);
    set(c, i++, -0.3 - h * 0.18 + Math.cos(a) * rr, -0.5 - h * 0.6, Math.sin(a) * rr, 0.4);
  }
  return c;
}

/* ------------------------------------------------------------- Controller */

function roundedBox(px: number, py: number, bx: number, by: number, r: number) {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function ellipse(px: number, py: number, rx: number, ry: number) {
  // Approximate signed distance; good enough for sampling
  const k = Math.hypot(px / rx, py / ry);
  return (k - 1) * Math.min(rx, ry);
}

/** Signed distance to a gamepad silhouette in the XY plane (negative inside). */
function padSdf(x: number, y: number) {
  const body = roundedBox(x, y - 0.12, 1.02, 0.42, 0.38);
  const rotate = (px: number, py: number, a: number) => [
    px * Math.cos(a) - py * Math.sin(a),
    px * Math.sin(a) + py * Math.cos(a),
  ];
  const [lx, ly] = rotate(x + 0.78, y + 0.42, -0.45);
  const [rx, ry] = rotate(x - 0.78, y + 0.42, 0.45);
  const grips = Math.min(ellipse(lx!, ly!, 0.36, 0.62), ellipse(rx!, ry!, 0.36, 0.62));
  return Math.min(body, grips);
}

export function controllerPoints(count: number, seed = 23): PointCloud {
  const rand = seeded(seed);
  const c = cloud(count);
  const depth = 0.32;
  let i = 0;

  // Shell: front and back faces with rounded edges, denser near the outline
  const shell = Math.floor(count * 0.8);
  while (i < shell) {
    const x = rand() * 2.6 - 1.3;
    const y = rand() * 2.1 - 1.25;
    const d = padSdf(x, y);
    if (d > 0) continue;
    const edge = Math.min(1, -d / 0.22);
    if (rand() > 0.3 + 0.7 * (1 - edge) + 0.15) continue;
    const z = (rand() < 0.62 ? 1 : -1) * depth * Math.sqrt(edge) * (0.92 + rand() * 0.08);
    set(c, i++, x, y, z);
  }

  // Controls on the front face: D-pad, four face buttons, two sticks
  const front = depth + 0.06;
  const features: Array<(r: () => number) => [number, number]> = [
    // D-pad (plus sign)
    (r) =>
      r() < 0.5
        ? [-0.62 + (r() - 0.5) * 0.36, 0.14 + (r() - 0.5) * 0.11]
        : [-0.62 + (r() - 0.5) * 0.11, 0.14 + (r() - 0.5) * 0.36],
    // Face buttons
    (r) => {
      const b = [
        [0.62, 0.3],
        [0.62, -0.02],
        [0.46, 0.14],
        [0.78, 0.14],
      ][Math.floor(r() * 4)]!;
      const a = r() * TAU;
      const rr = Math.sqrt(r()) * 0.075;
      return [b[0]! + Math.cos(a) * rr, b[1]! + Math.sin(a) * rr];
    },
    // Thumbsticks (rings)
    (r) => {
      const s = r() < 0.5 ? [-0.3, -0.2] : [0.3, -0.2];
      const a = r() * TAU;
      const rr = 0.12 + (r() - 0.5) * 0.03;
      return [s[0]! + Math.cos(a) * rr, s[1]! + Math.sin(a) * rr];
    },
  ];
  while (i < count) {
    const [x, y] = features[Math.floor(rand() * features.length)]!(rand);
    set(c, i++, x, y, front + rand() * 0.04, 1);
  }
  return c;
}

/* ----------------------------------------------------------------- Planet */

export function planetPoints(count: number, seed = 37): PointCloud {
  const rand = seeded(seed);
  const c = cloud(count);
  const R = 0.95;
  let i = 0;

  // Latitude and longitude lines
  const grid = Math.floor(count * 0.5);
  while (i < grid) {
    const t = rand() * TAU;
    if (rand() < 0.5) {
      const lat = (Math.floor(rand() * 7) - 3) * (Math.PI / 8);
      set(c, i++, Math.cos(lat) * Math.cos(t) * R, Math.sin(lat) * R, Math.cos(lat) * Math.sin(t) * R);
    } else {
      const lon = Math.floor(rand() * 12) * (Math.PI / 12);
      set(c, i++, Math.cos(t) * Math.cos(lon) * R, Math.sin(t) * R, Math.cos(t) * Math.sin(lon) * R);
    }
  }

  // Landmasses: surface points where a smooth noise is high
  const land = grid + Math.floor(count * 0.25);
  while (i < land) {
    const [dx, dy, dz] = direction(rand);
    const n = Math.sin(dx * 3.1 + 1) * Math.sin(dy * 2.7 + dz * 2) + Math.sin(dz * 4.3 - dx * 1.7) * 0.6;
    if (n < 0.35) continue;
    const lift = 1.02 + rand() * 0.03;
    set(c, i++, dx * R * lift, dy * R * lift, dz * R * lift, 0.2);
  }

  // Tilted ring
  const tilt = 0.42;
  while (i < count) {
    const t = rand() * TAU;
    const r = 1.45 + rand() * 0.32 + (rand() < 0.3 ? 0 : 0.0);
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    const y = (rand() - 0.5) * 0.025;
    set(c, i++, x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt), 1);
  }
  return c;
}
