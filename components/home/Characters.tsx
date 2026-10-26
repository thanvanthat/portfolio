"use client";

import { useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { live, pointer } from "./stage";

/**
 * The two characters beside the cabinet, one for each half of the work:
 *
 * - Player: KayKit "Rogue" by Kay Lousberg (CC0), trimmed to Idle, Interact and Cheer.
 * - Companion: three.js's "RobotExpressive" by Tomás Laulhé, with expressions by
 *   Don McCurdy (CC0), recoloured to the scene's palette with glowing eyes and
 *   trimmed to six clips.
 *
 * Both files are meshopt-compressed by a glTF-Transform script (see the README).
 */
export const PLAYER_URL = "/models/player.glb";
export const COMPANION_URL = "/models/companion.glb";

const withMeshopt = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

/** What a character should be doing: a looping base clip, or a one-off that returns to it. */
interface Cue {
  clip: string;
  once?: boolean;
}

/** Owns a mixer, crossfades between clips and turns the head toward the cursor. */
class CharacterRig {
  readonly root: THREE.Object3D;
  private readonly mixer: THREE.AnimationMixer;
  private readonly actions = new Map<string, THREE.AnimationAction>();
  private readonly head: THREE.Object3D | undefined;
  private current = "";
  private cueKey = "";
  private look = { x: 0, y: 0 };
  /** The head's pose from the animation alone, before the cursor turn is added. */
  private readonly headPose = new THREE.Quaternion();

  constructor(
    gltf: GLTF,
    private readonly base: string,
    headName: string,
    private readonly turn: { yaw: number; pitch: number },
  ) {
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
    for (const clip of gltf.animations) this.actions.set(clip.name, this.mixer.clipAction(clip));
    // A one-off clip hands back to the base loop when it ends
    this.mixer.addEventListener("finished", () => this.fade(this.base));
    this.head = this.findBone(headName);
    if (this.head) this.headPose.copy(this.head.quaternion);
    this.fade(base, 0);
  }

  private findBone(name: string) {
    let bone: THREE.Object3D | undefined;
    this.root.traverse((o) => {
      if (!bone && (o as THREE.Bone).isBone && o.name === name) bone = o;
    });
    return bone;
  }

  private fade(name: string, duration = 0.4, once = false) {
    const next = this.actions.get(name);
    if (!next || name === this.current) return;
    const prev = this.actions.get(this.current);
    next.reset();
    next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
    next.clampWhenFinished = once;
    next.setEffectiveWeight(1).fadeIn(duration).play();
    prev?.fadeOut(duration);
    this.current = name;
  }

  /** Applies a cue once per change, so a one-off plays a single time per stage. */
  cue(c: Cue) {
    const key = `${c.clip}:${c.once ? 1 : 0}`;
    if (key === this.cueKey) return;
    this.cueKey = key;
    this.fade(c.clip, 0.4, c.once);
  }

  update(dt: number) {
    const head = this.head;
    // Undo last frame's cursor turn first. Clips that key the head overwrite it anyway, but
    // clips that don't (the player's Idle) would otherwise keep adding turns and spin the head.
    if (head) head.quaternion.copy(this.headPose);
    this.mixer.update(dt);
    if (!head) return;
    this.headPose.copy(head.quaternion);
    // Turn the head toward the cursor on top of whatever the clip is doing
    const k = 1 - Math.pow(0.02, dt);
    this.look.x += (pointer.x - this.look.x) * k;
    this.look.y += (pointer.y - this.look.y) * k;
    this.head.rotateY(this.look.x * this.turn.yaw);
    this.head.rotateX(-this.look.y * this.turn.pitch);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.root);
  }
}

/** Seconds since the cabinet was last clicked ("press start"), or Infinity. */
const sincePress = (t: number) => (t >= live.pressedAt ? t - live.pressedAt : Infinity);

/* ----------------------------------------------------------------- Player */

function playerCue(at: number, chapters: number, pressed: number): Cue {
  if (pressed < 2.2) return { clip: "Interact", once: true };
  if (live.reduced) return { clip: "Idle" };
  // Celebrate the last chapter ("now shipping") and the closing shot
  if (at === chapters - 1 || at > chapters) return { clip: "Cheer" };
  return { clip: "Idle" };
}

export function Player({ chapters, onReady }: { chapters: number; onReady?: () => void }) {
  const gltf = useLoader(GLTFLoader, PLAYER_URL, withMeshopt);
  const rig = useMemo(() => new CharacterRig(gltf, "Idle", "head", { yaw: 0.5, pitch: 0.22 }), [gltf]);
  useEffect(() => () => rig.dispose(), [rig]);
  useEffect(() => onReady?.(), [onReady]);

  useFrame((state, dt) => {
    rig.cue(playerCue(Math.round(live.s), chapters, sincePress(state.clock.elapsedTime)));
    rig.update(Math.min(dt, 0.1));
  });

  return <primitive object={rig.root} position={[-1.5, 0, 0.6]} rotation={[0, 0.38, 0]} scale={0.95} />;
}

/* -------------------------------------------------------------- Companion */

/** The robot's chapter is "Intelligence"; it nods at the convergence and dances at the end. */
const AI_CHAPTER = 2;

function companionCue(at: number, chapters: number, pressed: number, poked: number): Cue {
  if (pressed < 1.6) return { clip: "Jump", once: true };
  if (poked < 2.4) return { clip: "Wave", once: true };
  if (at <= -1) return { clip: "Wave", once: true };
  if (live.reduced) return { clip: "Idle" };
  if (at === AI_CHAPTER) return { clip: "ThumbsUp", once: true };
  if (at === chapters - 1) return { clip: "Yes", once: true };
  if (at > chapters) return { clip: "Dance" };
  return { clip: "Idle" };
}

/** Morph targets on the robot's head mesh, and the glowing eye material. */
class Face {
  private readonly influences: number[] | undefined;
  private readonly surprised: number;
  private readonly sad: number;
  private readonly eyes: THREE.MeshStandardMaterial | undefined;
  private readonly glow: number;

  constructor(root: THREE.Object3D) {
    let head: THREE.Mesh | undefined;
    let eyes: THREE.MeshStandardMaterial | undefined;
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (m.morphTargetDictionary && "Surprised" in m.morphTargetDictionary) head = m;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) {
        if ((mat as THREE.MeshStandardMaterial).emissiveIntensity !== undefined && mat.name === "Black") {
          eyes = mat as THREE.MeshStandardMaterial;
        }
      }
    });
    this.influences = head?.morphTargetInfluences;
    this.surprised = head?.morphTargetDictionary?.Surprised ?? -1;
    this.sad = head?.morphTargetDictionary?.Sad ?? -1;
    this.eyes = eyes;
    this.glow = eyes?.emissiveIntensity ?? 1;
  }

  update(dt: number, t: number, surprised: number, thinking: boolean) {
    const k = 1 - Math.pow(0.001, dt);
    if (this.influences && this.surprised >= 0) {
      const s = this.influences[this.surprised] ?? 0;
      this.influences[this.surprised] = s + (surprised - s) * k;
    }
    if (this.influences && this.sad >= 0) {
      // A small "sad" lean when the cursor drops to the bottom of the screen
      const target = Math.max(0, -pointer.y - 0.6) * 0.8;
      const s = this.influences[this.sad] ?? 0;
      this.influences[this.sad] = s + (target - s) * k;
    }
    if (this.eyes) {
      // The eyes pulse while the AI chapter is on screen, as if it's thinking
      const pulse = thinking && !live.reduced ? 0.55 + 0.45 * Math.sin(t * 5) : 1;
      this.eyes.emissiveIntensity = this.glow * pulse;
    }
  }
}

export function Companion({ chapters }: { chapters: number }) {
  const gltf = useLoader(GLTFLoader, COMPANION_URL, withMeshopt);
  const rig = useMemo(() => new CharacterRig(gltf, "Idle", "Head", { yaw: 0.55, pitch: 0.25 }), [gltf]);
  const face = useMemo(() => new Face(rig.root), [rig]);
  useEffect(() => () => rig.dispose(), [rig]);

  // Clicking the robot makes it look surprised and wave back
  const pokedAt = useRef(-100);
  const poke = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    pokedAt.current = performance.now() / 1000;
  };
  const hover = (on: boolean) => () => {
    document.body.style.cursor = on ? "pointer" : "";
  };

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const at = Math.round(live.s);
    const pressed = sincePress(t);
    const poked = performance.now() / 1000 - pokedAt.current;
    rig.cue(companionCue(at, chapters, pressed, poked));
    rig.update(Math.min(dt, 0.1));
    face.update(Math.min(dt, 0.1), t, pressed < 1.8 || poked < 1.2 ? 1 : 0, at === AI_CHAPTER);
  });

  return (
    <primitive
      object={rig.root}
      position={[1.5, 0, 0.65]}
      rotation={[0, -0.45, 0]}
      scale={0.36}
      onClick={poke}
      onPointerOver={hover(true)}
      onPointerOut={hover(false)}
    />
  );
}
