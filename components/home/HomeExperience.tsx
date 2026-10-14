"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
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
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The homepage shell: one fixed 3D arcade scene behind scrolling HTML, plus the
 * hero frame, scroll dimming and film grain layered on top.
 */
export function HomeExperience({ name, subtitle, chapters, works, chrome, children }: HomeExperienceProps) {
  const [scene, setScene] = useState<null | { lite: boolean }>(null);
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
  // follow where those sections sit in the viewport
  const rail = useTransform(scrollY, () => {
    if (typeof document === "undefined") return 0;
    const journey = document.getElementById("journey")?.getBoundingClientRect();
    if (!journey) return 0;
    const vh = window.innerHeight;
    const enter = Math.min(1, Math.max(0, (vh * 0.9 - journey.top) / (vh * 0.5)));
    const leave = Math.min(1, Math.max(0, (journey.bottom - vh * 0.2) / (vh * 0.5)));
    return Math.min(enter, leave);
  });
  const fog = useTransform(scrollY, () => {
    if (typeof document === "undefined") return 0;
    const works = document.getElementById("works")?.getBoundingClientRect();
    const contact = document.getElementById("contact")?.getBoundingClientRect();
    if (!works) return 0;
    const vh = window.innerHeight;
    const enter = Math.min(1, Math.max(0, (vh - works.top) / (vh * 0.6)));
    const leave = contact ? Math.min(1, Math.max(0, contact.top / (vh * 0.6))) : 1;
    return Math.min(enter, leave) * 0.5;
  });

  return (
    <div className="home-root relative isolate">
      <div aria-hidden="true" className="home-sky fixed inset-0 -z-10">
        {scene && <ArcadeScene name={name} subtitle={subtitle} chapters={chapters} works={works} lite={scene.lite} />}
      </div>
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
