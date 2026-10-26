"use client";

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { ScreenChapter, ScreenWork } from "./screen";

const ArcadeScene = dynamic(() => import("./ArcadeScene"), { ssr: false });

interface HomeExperienceProps {
  name: string;
  subtitle: string;
  chapters: ScreenChapter[];
  works: ScreenWork[];
  chrome: { bottomLeft: string; bottomRight: string; side: string };
  children: ReactNode;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    // Release the probe context straight away; browsers cap how many can be alive
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The homepage shell: one fixed 3D arcade scene behind scrolling HTML, plus the
 * hero frame, scroll dimming and film grain layered on top.
 */
export function HomeExperience({ name, subtitle, chapters, works, chrome, children }: HomeExperienceProps) {
  const [scene, setScene] = useState<null | { lite: boolean }>(null);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setScene(null), []);
  useEffect(() => {
    if (!hasWebGL()) return;
    const lite = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    // Mount after first paint so the page and its text arrive before the 3D bundle
    const id = requestAnimationFrame(() => setScene({ lite }));
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollY } = useScroll();
  const scrim = useTransform(scrollY, [0, 520], [0, 0.32]);
  const chromeOpacity = useTransform(scrollY, [0, 280], [1, 0]);
  // The frosted rail behind the journey text, and the darker fog behind the works cards,
  // follow where those sections sit in the viewport. Measured on scroll and resize, and
  // once on mount so a reload part-way down the page starts in the right state.
  const rail = useMotionValue(0);
  const fog = useMotionValue(0);
  useEffect(() => {
    const journey = document.getElementById("journey");
    const worksEl = document.getElementById("works");
    const contact = document.getElementById("contact");
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const j = journey?.getBoundingClientRect();
      rail.set(j ? Math.min(clamp01((vh * 0.9 - j.top) / (vh * 0.5)), clamp01((j.bottom - vh * 0.2) / (vh * 0.5))) : 0);
      const w = worksEl?.getBoundingClientRect();
      const c = contact?.getBoundingClientRect();
      const enter = w ? clamp01((vh - w.top) / (vh * 0.6)) : 0;
      const leave = c ? clamp01(c.top / (vh * 0.6)) : 1;
      fog.set(Math.min(enter, leave) * 0.5);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [rail, fog]);

  return (
    <div className="home-root relative isolate overflow-x-clip">
      <div aria-hidden="true" className="home-sky fixed inset-0 -z-10">
        <div className="h-full w-full transition-opacity duration-1000 ease-out" style={{ opacity: ready ? 1 : 0 }}>
          {scene && (
            <ArcadeScene
              name={name}
              subtitle={subtitle}
              chapters={chapters}
              works={works}
              lite={scene.lite}
              onReady={onReady}
              onLost={onLost}
            />
          )}
        </div>
      </div>
      {scene && !ready && (
        <p
          aria-hidden="true"
          className="label home-loading pointer-events-none fixed bottom-28 left-1/2 z-10 -translate-x-1/2 text-[#f7f2e8]/80"
        >
          Loading world
        </p>
      )}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0a0d12]"
        style={{ opacity: scrim }}
      />
      <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[#0a0d12]" style={{ opacity: fog }} />
      <motion.div
        aria-hidden="true"
        className="journey-rail pointer-events-none fixed inset-y-0 right-0 -z-10 hidden w-[min(46vw,40rem)] md:block"
        style={{ opacity: rail }}
      />

      <motion.div
        aria-hidden="true"
        className="home-chrome pointer-events-none fixed inset-0 z-10"
        style={{ opacity: chromeOpacity }}
      >
        <div className="home-frame" />
        <span className="home-mark tl">+</span>
        <span className="home-mark tr">+</span>
        <span className="home-mark bl">+</span>
        <span className="home-mark br">+</span>
        <span className="home-meta bl">{chrome.bottomLeft}</span>
        <span className="home-meta br">{chrome.bottomRight}</span>
        <span className="home-meta side">{chrome.side}</span>
      </motion.div>

      <div aria-hidden="true" className="film-grain" />

      {children}
    </div>
  );
}
