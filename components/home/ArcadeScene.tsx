"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, SMAA } from "@react-three/postprocessing";
import type { DepthOfFieldEffect } from "postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  SCREEN_H,
  SCREEN_W,
  drawMarquee,
  drawScreen,
  preloadCovers,
  setScreenFont,
  type ScreenChapter,
  type ScreenMode,
  type ScreenWork,
} from "./screen";
import { Companion, Player } from "./Characters";
import { live, pointer, readStage, resetStage, type StageState } from "./stage";

export interface ArcadeSceneProps {
  name: string;
  subtitle: string;
  chapters: ScreenChapter[];
  works: ScreenWork[];
  /** Coarse pointers and small screens skip depth of field and use a wider shot. */
  lite: boolean;
  /** Called once the character and the scene have loaded, so the page can fade it in. */
  onReady?: () => void;
  /** Called if the browser drops the WebGL context; the page falls back to the painted sky. */
  onLost?: () => void;
}

/* ------------------------------------------------------------ Camera path */

interface Shot {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  bokeh: number;
}

/** One shot per stage: hero, the four journey chapters, works, outro. */
const SHOTS: Shot[] = [
  { pos: [0, 1.6, 7.6], target: [0, 1.1, 0], fov: 34, bokeh: 2.5 }, // hero: player, cabinet and robot, high in frame
  { pos: [-1.25, 3.05, 3.1], target: [0.7, 2.45, 0.2], fov: 30, bokeh: 6 }, // marquee
  { pos: [-1.15, 2.15, 2.0], target: [0.45, 1.22, 0.55], fov: 30, bokeh: 6 }, // controls
  { pos: [0.1, 1.8, 4.4], target: [2.35, 1.2, 0.5], fov: 34, bokeh: 6 }, // the robot, for the AI chapter
  { pos: [-3.3, 2.25, 4.3], target: [0.95, 1.45, 0], fov: 32, bokeh: 4 }, // three-quarter view
  { pos: [0, 1.86, 2.35], target: [0, 1.83, 0.2], fov: 32, bokeh: 3 }, // works: into the screen
  { pos: [1.6, 1.5, 7.6], target: [0, 0.88, 0], fov: 34, bokeh: 2.5 }, // outro: all three, high in frame like the hero
];

const ease = (t: number) => t * t * (3 - 2 * t);

const tmpPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

function sampleShot(s: number, out: { pos: THREE.Vector3; target: THREE.Vector3; fov: number; bokeh: number }) {
  const x = THREE.MathUtils.clamp(s + 1, 0, SHOTS.length - 1);
  const i = Math.min(Math.floor(x), SHOTS.length - 2);
  const t = ease(x - i);
  const a = SHOTS[i]!;
  const b = SHOTS[i + 1]!;
  out.pos.set(...a.pos).lerp(tmpPos.set(...b.pos), t);
  out.target.set(...a.target).lerp(tmpTarget.set(...b.target), t);
  out.fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
  out.bokeh = THREE.MathUtils.lerp(a.bokeh, b.bokeh, t);
}

/* ------------------------------------------------------------- Background */

function GradientSky() {
  const uniforms = useMemo(
    () => ({ uTop: { value: new THREE.Color("#5f8580") }, uBottom: { value: new THREE.Color("#e8d9bb") } }),
    [],
  );
  return (
    <mesh scale={60}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={
          /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uTop;
          uniform vec3 uBottom;
          varying vec3 vDir;
          void main() {
            float t = clamp(vDir.y * 2.2 + 0.45, 0.0, 1.0);
            gl_FragColor = vec4(mix(uBottom, uTop, t), 1.0);
          }
        `
        }
      />
    </mesh>
  );
}

function Environment() {
  const get = useThree((st) => st.get);
  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [get]);
  return null;
}

/* ---------------------------------------------------------------- Cabinet */

const W = 1.5; // inner width between the side panels
const SIDE = 0.09; // side panel thickness

const COLORS = {
  body: "#e0553d",
  cream: "#e6d8bf",
  dark: "#1d1c22",
  panel: "#2b3346",
};

/** Side panel profile (z forward, y up), extruded across x. */
function sideShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.9, 0);
  s.lineTo(0.47, 0);
  s.lineTo(0.47, 1.05);
  s.lineTo(0.8, 1.12);
  s.lineTo(0.8, 1.24);
  s.lineTo(0.38, 1.34);
  s.lineTo(0.2, 2.36);
  s.lineTo(0.42, 2.42);
  s.lineTo(0.42, 2.88);
  s.lineTo(-0.9, 2.88);
  s.closePath();
  return s;
}

function Cabinet({ screen, marquee }: { screen: THREE.Texture; marquee: THREE.Texture }) {
  const side = useMemo(
    () =>
      new THREE.ExtrudeGeometry(sideShape(), {
        depth: SIDE,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
        curveSegments: 4,
      }),
    [],
  );
  const body = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.body, roughness: 0.42, metalness: 0.05 }), []);
  const cream = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.cream, roughness: 0.55 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.dark, roughness: 0.35 }), []);
  const panel = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.panel, roughness: 0.5 }), []);

  const joystick = useRef<THREE.Group>(null);
  const buttons = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    // The joystick leans toward the cursor; buttons bob on a slow idle loop
    const j = joystick.current;
    if (j) {
      const k = 1 - Math.pow(0.002, dt);
      j.rotation.z += (-pointer.x * 0.45 - j.rotation.z) * k;
      j.rotation.x += (-pointer.y * 0.35 - j.rotation.x) * k;
    }
    // Buttons bob on a slow idle loop, and all flash down together after "press start"
    const t = state.clock.elapsedTime;
    const pressed = t - live.pressedAt < 0.5;
    buttons.current?.children.forEach((b, i) => {
      const idle = live.reduced ? 0 : Math.max(0, Math.sin(t * 2.2 - i * 0.9)) * 0.012;
      b.position.y = 0.035 - (pressed ? 0.02 : idle);
    });
  });

  // Clicking the cabinet presses start: the player reaches for it and the screen reacts
  const get = useThree((st) => st.get);
  const press = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    live.pressedAt = get().clock.elapsedTime;
  };
  const hover = (on: boolean) => () => {
    document.body.style.cursor = on ? "pointer" : "";
  };

  // The screen sits on the slanted face between (z .38, y 1.34) and (z .2, y 2.36)
  const tilt = -Math.atan2(0.18, 1.02);

  return (
    <group onClick={press} onPointerOver={hover(true)} onPointerOut={hover(false)}>
      {/* Side panels */}
      <mesh
        geometry={side}
        material={body}
        rotation={[0, -Math.PI / 2, 0]}
        position={[W / 2 + SIDE, 0, 0]}
        castShadow
        receiveShadow
      />
      <mesh geometry={side} material={body} rotation={[0, -Math.PI / 2, 0]} position={[-W / 2, 0, 0]} castShadow receiveShadow />

      {/* Lower front with the coin door */}
      <mesh material={cream} position={[0, 0.54, 0.43]} castShadow receiveShadow>
        <boxGeometry args={[W, 1.02, 0.06]} />
      </mesh>
      <mesh material={dark} position={[0, 0.5, 0.47]}>
        <boxGeometry args={[0.62, 0.56, 0.03]} />
      </mesh>
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.6, 0.49]}>
          <boxGeometry args={[0.1, 0.16, 0.01]} />
          <meshBasicMaterial color={[2.2, 0.9, 0.35]} toneMapped={false} />
        </mesh>
      ))}
      <mesh material={dark} position={[0, 0.06, 0.4]}>
        <boxGeometry args={[W + 0.02, 0.12, 0.1]} />
      </mesh>

      {/* Control panel */}
      <group position={[0, 1.18, 0.6]} rotation={[0.14, 0, 0]}>
        <mesh material={panel} castShadow receiveShadow>
          <boxGeometry args={[W, 0.1, 0.44]} />
        </mesh>
        <group ref={joystick} position={[-0.42, 0.05, 0.02]}>
          <mesh material={dark} position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 12]} />
          </mesh>
          <mesh position={[0, 0.21, 0]} castShadow>
            <sphereGeometry args={[0.065, 24, 16]} />
            <meshStandardMaterial color="#e63946" roughness={0.25} />
          </mesh>
        </group>
        <group ref={buttons}>
          {[
            [0.02, -0.05, "#ffd166"],
            [0.2, -0.08, "#4cc9f0"],
            [0.38, -0.05, "#f72585"],
            [0.07, 0.1, "#80ed99"],
            [0.25, 0.07, "#f2e7d3"],
            [0.43, 0.1, "#ff8a4c"],
          ].map(([x, z, c]) => (
            <mesh key={c as string} position={[x as number, 0.035, z as number]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.05, 20]} />
              <meshStandardMaterial color={c as string} roughness={0.3} emissive={c as string} emissiveIntensity={0.15} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Screen bezel and CRT */}
      <group position={[0, 1.85, 0.29]} rotation={[tilt, 0, 0]}>
        <mesh material={dark} receiveShadow>
          <boxGeometry args={[W, 1.04, 0.05]} />
        </mesh>
        <mesh position={[0, 0.02, 0.03]}>
          <planeGeometry args={[1.22, 0.915]} />
          <meshBasicMaterial map={screen} toneMapped={false} color={[1.25, 1.25, 1.25]} />
        </mesh>
      </group>

      {/* Marquee */}
      <mesh material={dark} position={[0, 2.65, 0.4]}>
        <boxGeometry args={[W, 0.46, 0.04]} />
      </mesh>
      <mesh position={[0, 2.65, 0.425]}>
        <planeGeometry args={[W - 0.08, 0.38]} />
        <meshBasicMaterial map={marquee} toneMapped={false} color={[1.15, 1.15, 1.15]} />
      </mesh>

      {/* Top and back */}
      <mesh material={cream} position={[0, 2.86, -0.24]} castShadow>
        <boxGeometry args={[W, 0.05, 1.3]} />
      </mesh>
      <mesh material={dark} position={[0, 1.44, -0.88]}>
        <boxGeometry args={[W, 2.88, 0.04]} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------- Floating props */

function Float({
  position,
  speed = 1,
  children,
}: {
  position: [number, number, number];
  speed?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const phase = useMemo(() => position[0] * 3.1 + position[2] * 1.7, [position]);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    if (live.reduced) return;
    const t = state.clock.elapsedTime * speed + phase;
    g.position.y = position[1] + Math.sin(t) * 0.08;
    g.rotation.x = Math.sin(t * 0.6) * 0.4;
    g.rotation.y += 0.004 * speed;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

function Props() {
  const pips = useMemo(() => {
    // Six-sided die: one pip set per face, enough to read as a die out of focus
    const faces: [number, number, number][] = [];
    const d = 0.151;
    faces.push([0, 0, d]);
    faces.push([-0.06, 0.06, -d], [0.06, -0.06, -d]);
    faces.push([d, -0.06, -0.06], [d, 0, 0], [d, 0.06, 0.06]);
    return faces;
  }, []);
  return (
    <>
      <Float position={[-1.75, 2.75, 1.0]} speed={0.8}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.35} />
        </mesh>
        {pips.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.025, 10, 8]} />
            <meshStandardMaterial color="#1d1c22" />
          </mesh>
        ))}
      </Float>
      {[
        [1.55, 2.3, 1.5],
        [1.95, 1.05, 0.4],
        [-1.45, 0.7, 1.7],
      ].map((p, i) => (
        <Float key={i} position={p as [number, number, number]} speed={1.1 + i * 0.2}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.03, 32]} />
            <meshStandardMaterial color="#f2b33d" metalness={0.85} roughness={0.25} />
          </mesh>
        </Float>
      ))}
      <Float position={[-1.9, 1.35, -0.8]} speed={0.7}>
        {/* Gilli: a short stick tapered at both ends */}
        <mesh rotation={[0, 0, Math.PI / 2.6]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.42, 12]} />
          <meshStandardMaterial color="#b07a46" roughness={0.7} />
        </mesh>
      </Float>
      <Float position={[1.55, 3.25, -1.0]} speed={0.6}>
        <mesh>
          <icosahedronGeometry args={[0.26, 1]} />
          <meshStandardMaterial color="#9fd4ff" wireframe />
        </mesh>
      </Float>
    </>
  );
}

/* --------------------------------------------------------------- Surfaces */

/** A canvas-backed texture for the CRT screen; redraws only when asked to. */
class ScreenSurface {
  readonly canvas = document.createElement("canvas");
  readonly texture: THREE.CanvasTexture;
  private key = "";
  private last = 0;
  private dirty = true;

  constructor() {
    this.canvas.width = SCREEN_W;
    this.canvas.height = SCREEN_H;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 4;
  }

  invalidate() {
    this.dirty = true;
  }

  /** Animated modes redraw at ~24 fps; a static project card only when it changes. */
  update(mode: ScreenMode, key: string, t: number, chapters: ScreenChapter[], works: ScreenWork[]) {
    const animated = mode.kind !== "work";
    if (key === this.key && !this.dirty && !(animated && t - this.last > 1 / 24)) return;
    const ctx = this.canvas.getContext("2d");
    if (ctx) drawScreen(ctx, mode, chapters, works);
    this.texture.needsUpdate = true;
    this.key = key;
    this.last = t;
    this.dirty = false;
  }

  dispose() {
    this.texture.dispose();
  }
}

class MarqueeSurface {
  readonly canvas = document.createElement("canvas");
  readonly texture: THREE.CanvasTexture;

  constructor() {
    this.canvas.width = 1024;
    this.canvas.height = 256;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
  }

  draw(name: string, sub: string) {
    const ctx = this.canvas.getContext("2d");
    if (ctx) drawMarquee(ctx, name, sub);
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

/* ----------------------------------------------------------------- Scene */

function Rig({ chapters, works, name, subtitle, lite }: ArcadeSceneProps) {
  const get = useThree((st) => st.get);
  const setDpr = useThree((st) => st.setDpr);
  // Drop to the light effect chain if this device can't hold ~30 fps with depth of field
  const [degraded, setDegraded] = useState(false);
  const perf = useRef({ time: 0, frames: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (live.reduced = mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      resetStage();
      document.body.style.cursor = "";
    };
  }, []);
  const screen = useMemo(() => new ScreenSurface(), []);
  const marquee = useMemo(() => new MarqueeSurface(), []);
  useEffect(
    () => () => {
      screen.dispose();
      marquee.dispose();
    },
    [screen, marquee],
  );

  useEffect(() => {
    setScreenFont(getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains"));
    const draw = () => {
      marquee.draw(name, subtitle);
      screen.invalidate();
    };
    draw();
    // Redraw once the web font has loaded so the canvases use it
    let active = true;
    document.fonts?.ready.then(() => active && draw());
    preloadCovers(works, () => active && screen.invalidate());
    return () => {
      active = false;
    };
  }, [marquee, screen, name, subtitle, works]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const state = useRef({
    stage: { s: -1, work: 0 } as StageState,
    s: null as number | null,
    shot: { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 34, bokeh: 3 },
    look: { x: 0, y: 0 },
    blink: { next: 3, t: 0 },
    v: new THREE.Vector3(),
    q: new THREE.Quaternion(),
    e: new THREE.Euler(0, 0, 0, "YXZ"),
  });
  const dof = useRef<DepthOfFieldEffect>(null);

  useFrame((frame, dt) => {
    const r = state.current;
    const t = frame.clock.elapsedTime;
    const { camera, size } = get();
    const cam = camera as THREE.PerspectiveCamera;

    // Average frame time over ~2 s; give up depth of field once if it stays slow
    if (!lite && !degraded && t > 4) {
      perf.current.time += dt;
      perf.current.frames += 1;
      if (perf.current.time > 2) {
        if (perf.current.time / perf.current.frames > 1 / 30) {
          setDegraded(true);
          setDpr(1);
        }
        perf.current = { time: 0, frames: 0 };
      }
    }

    readStage(r.stage);
    r.s ??= r.stage.s;
    r.s += (r.stage.s - r.s) * (1 - Math.pow(0.004, dt));
    const s = r.s;
    live.s = s;

    // Camera: follow the shot path, then orbit a few degrees around the focus point with the cursor
    const shot = r.shot;
    sampleShot(s, shot);
    if (size.width < size.height * 1.05) {
      // Portrait: centre the subject and pull back, further for the close-ups and for the
      // wide opening and closing shots, which have to fit both characters across
      const wide = THREE.MathUtils.clamp(-s, 0, 1) + THREE.MathUtils.clamp(s - (SHOTS.length - 3), 0, 1);
      const close = THREE.MathUtils.clamp(1 - Math.abs(s - 1.5) / 2.5, 0, 1);
      // The robot's shot keeps it centred instead of the cabinet
      const robot = THREE.MathUtils.clamp(1 - Math.abs(s - 2), 0, 1);
      shot.target.x = THREE.MathUtils.lerp(shot.target.x * 0.15, 1.5, robot);
      r.v
        .copy(shot.pos)
        .sub(shot.target)
        .multiplyScalar(1.55 + close * 0.9 + wide * 0.45);
      shot.pos.copy(shot.target).add(r.v);
    }
    const k = 1 - Math.pow(0.08, dt);
    r.look.x += (pointer.x - r.look.x) * k;
    r.look.y += (pointer.y - r.look.y) * k;
    const sway = live.reduced ? 0 : 1;
    r.e.set(-r.look.y * 0.05 * sway, -r.look.x * 0.07 * sway, 0);
    r.q.setFromEuler(r.e);
    r.v.copy(shot.pos).sub(shot.target).applyQuaternion(r.q).add(shot.target);
    cam.position.copy(r.v);
    cam.lookAt(shot.target);
    if (Math.abs(cam.fov - shot.fov) > 0.01) {
      cam.fov = shot.fov;
      cam.updateProjectionMatrix();
    }
    const d = dof.current;
    if (d) {
      d.target = shot.target;
      d.bokehScale = shot.bokeh;
    }

    // Screen content follows the nearest stage
    const n = chapters.length;
    const at = Math.round(s);
    let mode: ScreenMode;
    if (t - live.pressedAt < 2.2) mode = { kind: "start", tick: t - live.pressedAt };
    else if (at <= -1) {
      const b = r.blink;
      if (t > b.next) {
        b.t = t;
        b.next = t + 2.5 + Math.random() * 3;
      }
      const bt = (t - b.t) / 0.16;
      const closed = bt >= 0 && bt < 2 ? 1 - Math.abs(bt - 1) : 0;
      mode = { kind: "eyes", lookX: r.look.x, lookY: r.look.y, blink: closed, tick: t };
    } else if (at < n) mode = { kind: "chapter", index: at, tick: t };
    else if (at === n) mode = { kind: "work", index: Math.min(r.stage.work, works.length - 1) };
    else mode = { kind: "outro", tick: t };
    const key = mode.kind === "work" || mode.kind === "chapter" ? `${mode.kind}-${mode.index}` : mode.kind;

    screen.update(mode, key, t, chapters, works);
  });

  return (
    <>
      <Cabinet screen={screen.texture} marquee={marquee.texture} />
      <Props />
      {lite || degraded ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.85} luminanceSmoothing={0.3} />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={0}>
          <DepthOfField ref={dof} worldFocusRange={1.4} bokehScale={3} height={480} />
          <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.85} luminanceSmoothing={0.3} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}

function Lights() {
  return (
    <>
      <Environment />
      <hemisphereLight args={["#fff6e8", "#4a4f46", 1.1]} />
      <directionalLight
        position={[3.5, 6, 4.5]}
        intensity={1.9}
        color="#ffdcc7"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={4}
        shadow-camera-bottom={-1}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-4, 3, -3]} intensity={1.6} color="#9fc6ff" />
    </>
  );
}

export default function ArcadeScene(props: ArcadeSceneProps) {
  const { onLost } = props;
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={props.lite ? [1, 1.25] : [1, 1.5]}
      camera={{ position: SHOTS[0]!.pos, fov: SHOTS[0]!.fov, near: 0.1, far: 200 }}
      gl={{ antialias: false, stencil: false, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onLost?.();
        });
      }}
    >
      {/* Everything appears together once the character has loaded */}
      <Suspense fallback={null}>
        <GradientSky />
        <Lights />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.22} />
        </mesh>
        <Player chapters={props.chapters.length} onReady={props.onReady} />
        <Companion chapters={props.chapters.length} />
        <Rig {...props} />
      </Suspense>
    </Canvas>
  );
}
