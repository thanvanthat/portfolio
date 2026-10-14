"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { seeded } from "@/lib/utils";
import { brainPoints, controllerPoints, planetPoints } from "@/components/visuals/morphShapes";

/**
 * Hero WebGL scene: a procedurally displaced terrain (the game world)
 * streaming toward the camera, and above it a cloud of particles that
 * morphs between a game controller, a brain and a ringed planet.
 * One scene, one draw loop.
 */

const terrainVertex = /* glsl */ `
  uniform float uTime;
  varying float vHeight;
  varying float vDepth;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec3 p = position;
    vec2 q = vec2(p.x * 0.16, (p.y + uTime * 1.4) * 0.16);
    float h = noise(q) * 2.2 + noise(q * 2.3) * 0.7;
    // Carve a valley down the middle so the core floats above a path
    float valley = smoothstep(0.0, 6.0, abs(p.x));
    h *= mix(0.15, 1.0, valley);
    p.z += h;
    vHeight = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const terrainFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vHeight;
  varying float vDepth;
  void main() {
    float fog = 1.0 - smoothstep(6.0, 34.0, vDepth);
    vec3 col = mix(uColor, uAccent, smoothstep(1.2, 2.4, vHeight));
    gl_FragColor = vec4(col, fog * 0.55);
  }
`;

function Terrain() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#8b8b90") },
      uAccent: { value: new THREE.Color("#9fd4ff") },
    }),
    [],
  );
  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime!.value += delta;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -10]}>
      <planeGeometry args={[48, 44, 96, 88]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={terrainVertex}
        fragmentShader={terrainFragment}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ Morph */

/** Order of the forms: games, intelligence, worlds. */
export const HERO_FORMS = ["Games", "Intelligence", "Worlds"] as const;

const HOLD = 4.2;
const MORPH = 2.4;
const PERIOD = HOLD + MORPH;
const LOOP = PERIOD * HERO_FORMS.length;

const morphVertex = /* glsl */ `
  uniform float uTime;
  uniform float uFrom;
  uniform float uTo;
  uniform float uProg;
  uniform float uScatter;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uLoopW;
  uniform vec3 uColors[3];
  uniform vec3 uAccents[3];
  attribute vec3 aB;
  attribute vec3 aC;
  attribute vec3 aFeat;
  attribute vec4 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 shapePos(float k) { return k < 0.5 ? position : (k < 1.5 ? aB : aC); }
  float shapeFeat(float k) { return k < 0.5 ? aFeat.x : (k < 1.5 ? aFeat.y : aFeat.z); }
  vec3 shapeColor(float k) { return k < 0.5 ? uColors[0] : (k < 1.5 ? uColors[1] : uColors[2]); }
  vec3 shapeAccent(float k) { return k < 0.5 ? uAccents[0] : (k < 1.5 ? uAccents[1] : uAccents[2]); }

  void main() {
    // Each particle leaves a little later than the last, so shapes dissolve and rebuild in waves
    float t = clamp(uProg * 1.6 - aRand.w * 0.6, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float lift = sin(t * 3.14159);

    vec3 p = mix(shapePos(uFrom), shapePos(uTo), t);
    p += aRand.xyz * lift * 0.85;
    p += vec3(
      sin(uTime * uLoopW * 4.0 + aRand.w * 20.0),
      cos(uTime * uLoopW * 3.0 + aRand.w * 17.0),
      sin(uTime * uLoopW * 5.0 + aRand.w * 13.0)
    ) * 0.012;
    p += aRand.xyz * uScatter * 3.5;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec3 away = world.xyz - uMouse;
    float push = smoothstep(1.15, 0.0, length(away.xy)) * uMouseStrength;
    world.xyz += normalize(away + vec3(0.0, 0.0, 0.0001)) * push * 0.7;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aRand.w * 0.9) * uPixelRatio / -mv.z;

    float feat = mix(shapeFeat(uFrom), shapeFeat(uTo), t);
    vec3 base = mix(shapeColor(uFrom), shapeColor(uTo), t);
    vec3 accent = mix(shapeAccent(uFrom), shapeAccent(uTo), t);
    vColor = mix(base, accent, feat);
    float twinkle = 0.6 + 0.4 * sin(uTime * uLoopW * 6.0 + aRand.w * 40.0);
    vAlpha = twinkle * (1.0 - uScatter) * (0.75 + lift * 0.25);
  }
`;

const morphFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

interface MorphCloudProps {
  count: number;
  /** 0–1 scroll progress through the hero; the cloud bursts apart as it leaves. */
  scroll?: MotionValue<number>;
  onForm?: (index: number) => void;
  /** Hold one form instead of cycling (reduced motion). */
  still: boolean;
}

function MorphCloud({ count, scroll, onForm, still }: MorphCloudProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const time = useRef(0);
  const shown = useRef(-1);
  const mouseRef = useRef({
    pos: new THREE.Vector3(99, 99, 0),
    ray: new THREE.Vector3(),
    strength: 0,
    last: new THREE.Vector2(9, 9),
  });

  const geometry = useMemo(() => {
    const shapes = [controllerPoints(count), brainPoints(count), planetPoints(count)];
    const feat = new Float32Array(count * 3);
    const rnd = new Float32Array(count * 4);
    const rand = seeded(5);
    for (let i = 0; i < count; i++) {
      feat[i * 3] = shapes[0]!.feature[i]!;
      feat[i * 3 + 1] = shapes[1]!.feature[i]!;
      feat[i * 3 + 2] = shapes[2]!.feature[i]!;
      const u = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u) * (0.6 + rand() * 0.6);
      rnd.set([Math.cos(a) * r, u * (0.6 + rand() * 0.6), Math.sin(a) * r, rand()], i * 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(shapes[0]!.positions, 3));
    g.setAttribute("aB", new THREE.BufferAttribute(shapes[1]!.positions, 3));
    g.setAttribute("aC", new THREE.BufferAttribute(shapes[2]!.positions, 3));
    g.setAttribute("aFeat", new THREE.BufferAttribute(feat, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rnd, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uProg: { value: 0 },
      uScatter: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uSize: { value: 30 },
      uPixelRatio: { value: 1 },
      uLoopW: { value: (Math.PI * 2) / LOOP },
      // games: bone with ember controls; intelligence: AI blue; worlds: steel with a blue ring
      uColors: { value: [new THREE.Color("#ecebe6"), new THREE.Color("#9fd4ff"), new THREE.Color("#c4cbd3")] },
      uAccents: { value: [new THREE.Color("#ff6a3d"), new THREE.Color("#d8ccff"), new THREE.Color("#9fd4ff")] },
    }),
    [],
  );

  useFrame((state, delta) => {
    const m = material.current;
    if (!m || !group.current) return;
    if (!still) time.current += Math.min(delta, 0.1);
    const t = time.current;
    m.uniforms.uTime!.value = t;
    m.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();

    // Hold a form, then morph into the next one
    const phase = t % LOOP;
    const index = Math.floor(phase / PERIOD);
    const within = phase - index * PERIOD;
    const prog = within < HOLD ? 0 : (within - HOLD) / MORPH;
    const next = (index + 1) % HERO_FORMS.length;
    m.uniforms.uFrom!.value = index;
    m.uniforms.uTo!.value = prog > 0 ? next : index;
    m.uniforms.uProg!.value = prog;
    const visible = prog > 0.55 ? next : index;
    if (visible !== shown.current) {
      shown.current = visible;
      onForm?.(visible);
    }

    // Gentle sway, periodic over one full loop
    const w = (Math.PI * 2) / LOOP;
    group.current.rotation.y = Math.sin(t * w * 2) * 0.3;
    group.current.rotation.x = Math.sin(t * w * 3) * 0.08;

    // Cursor pushes particles away; the push fades when the pointer rests
    const mouse = mouseRef.current;
    const { pointer, camera } = state;
    const moved = mouse.last.distanceToSquared(pointer) > 1e-6;
    mouse.last.copy(pointer);
    const v = mouse.ray.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const dist = -camera.position.z / v.z;
    mouse.pos.copy(camera.position).addScaledVector(v, dist);
    mouse.strength += ((moved && !still ? 1 : 0) - mouse.strength) * (moved ? 0.15 : 0.02);
    m.uniforms.uMouse!.value.copy(mouse.pos);
    m.uniforms.uMouseStrength!.value = mouse.strength;

    const sp = scroll?.get() ?? 0;
    m.uniforms.uScatter!.value = THREE.MathUtils.smoothstep(sp, 0.05, 0.65);
  });

  return (
    <group ref={group} position={[2.35, 0.7, 0]} scale={0.82}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={morphVertex}
          fragmentShader={morphFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function CameraRig({ mobile }: { mobile: boolean }) {
  const target = useMemo(() => new THREE.Vector3(mobile ? 0.8 : 0.6, 0.2, 0), [mobile]);
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 0.6 + (mobile ? 0.8 : 0) - camera.position.x) * 0.04;
    camera.position.y += (0.6 + pointer.y * 0.35 - camera.position.y) * 0.04;
    camera.lookAt(target);
  });
  return null;
}

interface HeroSceneProps {
  active: boolean;
  reduced: boolean;
  mobile: boolean;
  /** Element that receives pointer events for the scene (the hero section). */
  eventSource?: RefObject<HTMLElement | null>;
  scroll?: MotionValue<number>;
  onForm?: (index: number) => void;
}

export default function HeroScene({ active, reduced, mobile, eventSource, scroll, onForm }: HeroSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, mobile ? 1.25 : 1.6]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      camera={{ position: [0, 0.6, 6.5], fov: mobile ? 55 : 42, near: 0.1, far: 60 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      eventSource={eventSource}
      eventPrefix="client"
      aria-hidden="true"
    >
      <Terrain />
      <MorphCloud count={mobile ? 9000 : 20000} scroll={scroll} onForm={onForm} still={reduced} />
      {!reduced && <CameraRig mobile={mobile} />}
    </Canvas>
  );
}
