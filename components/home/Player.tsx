"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { live, pointer } from "./stage";

/**
 * The player character standing beside the cabinet: KayKit "Rogue" (CC0, Kay Lousberg),
 * trimmed to three clips and meshopt-compressed by a build script.
 */
export const PLAYER_URL = "/models/player.glb";

type Clip = "Idle" | "Interact" | "Cheer";

const withMeshopt = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

/** Owns the mixer, the clip crossfades and the head turning toward the cursor. */
class PlayerRig {
  readonly root: THREE.Object3D;
  private readonly mixer: THREE.AnimationMixer;
  private readonly actions = new Map<Clip, THREE.AnimationAction>();
  private readonly head: THREE.Object3D | undefined;
  private current: Clip | null = null;
  private look = { x: 0, y: 0 };

  constructor(gltf: GLTF) {
    this.root = gltf.scene;
    this.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        // Skinned meshes are culled by their bind-pose bounds, which an animation can leave behind
        o.frustumCulled = false;
      }
    });
    this.mixer = new THREE.AnimationMixer(this.root);
    for (const clip of gltf.animations) {
      const action = this.mixer.clipAction(clip);
      if (clip.name === "Interact") {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
      this.actions.set(clip.name as Clip, action);
    }
    this.head = this.root.getObjectByName("head");
    this.play("Idle", 0);
  }

  play(name: Clip, fade = 0.45) {
    if (name === this.current) return;
    const next = this.actions.get(name);
    if (!next) return;
    const prev = this.current ? this.actions.get(this.current) : undefined;
    next.reset().setEffectiveWeight(1).fadeIn(fade).play();
    prev?.fadeOut(fade);
    this.current = name;
  }

  update(dt: number) {
    this.mixer.update(dt);
    if (!this.head) return;
    // Turn the head toward the cursor on top of whatever the clip is doing
    const k = 1 - Math.pow(0.02, dt);
    this.look.x += (pointer.x - this.look.x) * k;
    this.look.y += (pointer.y - this.look.y) * k;
    this.head.rotateY(this.look.x * 0.5);
    this.head.rotateX(-this.look.y * 0.22);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.root);
  }
}

/** Which clip fits the current stage: idle while reading, a cheer at the end and on the last chapter. */
function clipFor(s: number, chapters: number, pressedFor: number, reduced: boolean): Clip {
  if (pressedFor >= 0 && pressedFor < 2.2) return "Interact";
  if (reduced) return "Idle";
  const at = Math.round(s);
  if (at === chapters - 1 || at > chapters) return "Cheer";
  return "Idle";
}

export function Player({ chapters, onReady }: { chapters: number; onReady?: () => void }) {
  const gltf = useLoader(GLTFLoader, PLAYER_URL, withMeshopt);
  const rig = useMemo(() => new PlayerRig(gltf), [gltf]);
  useEffect(() => () => rig.dispose(), [rig]);
  useEffect(() => onReady?.(), [onReady]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    rig.play(clipFor(live.s, chapters, t - live.pressedAt, live.reduced));
    rig.update(Math.min(dt, 0.1));
  });

  return <primitive object={rig.root} position={[-1.5, 0, 0.6]} rotation={[0, 0.38, 0]} scale={0.95} />;
}
