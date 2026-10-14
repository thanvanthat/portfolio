"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Fixed 3D stage behind the blog. Scrolling is the camera move: the page's scroll
 * progress wipes the camera along a path, and the centrepiece turns toward the cursor.
 * Layout and mood after github.com/dayinji/sen-3d-resume (MIT); the centrepiece is a
 * procedural clay game controller unless a .glb model is configured in data/blog.ts.
 */

const SAGE = "#a3ae8a";
const CLAY = "#efe9dc";
const DARK = "#2a2c33";

interface Pose {
  pos: [number, number, number];
  look: [number, number, number];
}

/** Camera keyframes along the scroll. Index keeps the subject left of the post rail. */
const PATHS: Record<"index" | "post", Pose[]> = {
  index: [
    { pos: [0, 0.5, 7.6], look: [0, 0.15, 0] },
    { pos: [1.4, 1.3, 6.2], look: [1.9, 0, 0] },
    { pos: [3.6, 3.1, 4.8], look: [2.2, -0.4, 0] },
  ],
  post: [
    { pos: [-2.6, 0.2, 7], look: [-2.1, -0.9, 0] },
    { pos: [0.6, 2.6, 6.8], look: [0.2, -0.2, 0] },
    { pos: [2.8, 1.2, 5.6], look: [0.8, 0, 0] },
  ],
};

const clay = (color: string) => <meshStandardMaterial color={color} roughness={0.82} metalness={0} />;

function Controller() {
  return (
    <group>
      {/* Body + grips */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.55]}>
        <capsuleGeometry args={[0.55, 1.6, 8, 24]} />
        {clay(CLAY)}
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[side * 0.95, -0.45, -0.02]} rotation={[0, 0, side * 0.5]} scale={[1, 1, 0.6]}>
          <capsuleGeometry args={[0.42, 0.7, 8, 20]} />
          {clay(CLAY)}
        </mesh>
      ))}
      {/* D-pad */}
      <group position={[-0.78, 0.08, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.13, 0.1]} />
          {clay(DARK)}
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.42, 0.1]} />
          {clay(DARK)}
        </mesh>
      </group>
      {/* Face buttons */}
      {(
        [
          [0, 0.18, "#ff6a3d"],
          [0.18, 0, "#9fd4ff"],
          [0, -0.18, "#7f8f62"],
          [-0.18, 0, "#ffd9b3"],
        ] as const
      ).map(([x, y, color]) => (
        <mesh key={color} castShadow position={[0.78 + x, 0.08 + y, 0.3]}>
          <sphereGeometry args={[0.095, 20, 16]} />
          {clay(color)}
        </mesh>
      ))}
      {/* Thumbsticks */}
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[side * 0.34, -0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
          {clay(DARK)}
        </mesh>
      ))}
      {/* Status light */}
      <mesh position={[0, 0.3, 0.3]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#ffd9b3" emissive="#ffb070" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  const scene = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
    });
    // Fit any model to ~3.2 units tall, centred on the origin
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 3.2 / Math.max(size.y, 0.001);
    root.scale.setScalar(s);
    root.position.set(-center.x * s, -center.y * s, -center.z * s);
    return root;
  }, [gltf]);
  return <primitive object={scene} />;
}

/** Floating clay "pickups" around the centrepiece. */
function Pickups({ still }: { still: boolean }) {
  const items = useRef<(THREE.Mesh | null)[]>([]);
  const defs = useMemo(
    () =>
      [
        { pos: [-2.3, 1.2, -0.6], color: "#ff6a3d", geo: <torusGeometry args={[0.28, 0.11, 16, 40]} /> },
        { pos: [2.4, 1.35, -1], color: "#9fd4ff", geo: <octahedronGeometry args={[0.32, 0]} /> },
        { pos: [-2.7, -0.9, 0.8], color: "#ffd9b3", geo: <boxGeometry args={[0.38, 0.38, 0.38]} /> },
        { pos: [2.6, -0.7, 0.9], color: CLAY, geo: <icosahedronGeometry args={[0.26, 0]} /> },
        { pos: [0.4, 2.1, -1.8], color: "#7f8f62", geo: <sphereGeometry args={[0.2, 24, 16]} /> },
      ] as { pos: [number, number, number]; color: string; geo: ReactNode }[],
    [],
  );

  useFrame(({ clock }, delta) => {
    if (still) return;
    const t = clock.elapsedTime;
    items.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = defs[i]!.pos[1] + Math.sin(t * 0.9 + i * 1.7) * 0.14;
      m.rotation.x += delta * (0.25 + i * 0.05);
      m.rotation.y += delta * (0.35 - i * 0.03);
    });
  });

  return (
    <>
      {defs.map((d, i) => (
        <mesh
          key={i}
          ref={(m) => {
            items.current[i] = m;
          }}
          position={d.pos}
          castShadow
        >
          {d.geo}
          {clay(d.color)}
        </mesh>
      ))}
    </>
  );
}

/** Wraps the centrepiece: idle bob plus a turn toward the cursor. */
function Subject({ children, still }: { children: ReactNode; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const k = still ? 1 : 0.06;
    g.rotation.y += (pointer.current.x * 0.45 - 0.15 - g.rotation.y) * k;
    g.rotation.x += (-pointer.current.y * 0.25 + 0.12 - g.rotation.x) * k;
    if (!still) {
      g.position.y = Math.sin(t * 0.8) * 0.12;
      g.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
  });

  return <group ref={group}>{children}</group>;
}

// Scratch vectors for the camera rig (one stage per page, so module scope is fine)
const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const a = new THREE.Vector3();
const b = new THREE.Vector3();

function CameraRig({ route, mobile, still }: { route: "index" | "post"; mobile: boolean; still: boolean }) {
  const camera = useThree((s) => s.camera);
  const look = useRef(new THREE.Vector3(...PATHS[route][0]!.look));

  useFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    const path = PATHS[route];
    const f = p * (path.length - 1);
    const i = Math.min(Math.floor(f), path.length - 2);
    const t = THREE.MathUtils.smootherstep(f - i, 0, 1);
    const from = path[i]!;
    const to = path[i + 1]!;

    tmpPos.lerpVectors(a.set(...from.pos), b.set(...to.pos), t);
    tmpLook.lerpVectors(a.set(...from.look), b.set(...to.look), t);
    if (mobile) {
      // Narrow screens: step back and keep the subject centred
      tmpPos.multiplyScalar(1.35);
      tmpLook.x *= 0.2;
    }

    const k = still ? 1 : 0.07;
    camera.position.lerp(tmpPos, k);
    look.current.lerp(tmpLook, k);
    camera.lookAt(look.current);
  });

  return null;
}

interface BlogSceneProps {
  route: "index" | "post";
  mobile: boolean;
  still: boolean;
  model?: string;
}

export default function BlogScene({ route, mobile, still, model }: BlogSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, mobile ? 1.25 : 1.5]}
      camera={{ position: PATHS[route][0]!.pos, fov: mobile ? 50 : 38, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={[SAGE]} />
      <fog attach="fog" args={[SAGE, 9, 22]} />
      <hemisphereLight args={["#f4f1ea", "#5c6b4a", 1.1]} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.1}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-radius={6}
      />
      <pointLight position={[-3, 2, -3]} intensity={14} color="#ffd9b3" distance={12} />

      <Subject still={still}>
        {model ? (
          <Suspense fallback={<Controller />}>
            <Model url={model} />
          </Suspense>
        ) : (
          <Controller />
        )}
      </Subject>
      <Pickups still={still} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        {/* Seamless studio floor: only the shadows show */}
        <shadowMaterial opacity={0.16} />
      </mesh>

      <CameraRig route={route} mobile={mobile} still={still} />
    </Canvas>
  );
}
