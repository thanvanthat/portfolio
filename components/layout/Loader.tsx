"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { easeCine } from "@/lib/utils";
import { INTRO_KEY as KEY } from "@/lib/constants";

/** Short intro counter, shown once per session. Skipped for reduced motion. */
export function Loader() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      // Hidden before paint by the inline script in layout; sync React state next frame.
      const id = requestAnimationFrame(() => setShow(false));
      return () => cancelAnimationFrame(id);
    }

    const start = performance.now();
    const duration = 800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
        setTimeout(() => setShow(false), 100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading"
          className="intro-loader fixed inset-0 z-[120] flex flex-col justify-between bg-ink p-[var(--gutter)] text-bone"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.7, ease: easeCine }}
        >
          <div className="label flex justify-between text-ash">
            <span>{site.name}</span>
            <span>Portfolio — {site.year}</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="label max-w-[16rem] text-ash">
              Game Developer
              <br />+ AI Engineer
            </div>
            <div className="display text-[clamp(6rem,22vw,20rem)] tabular-nums">{String(count).padStart(3, "0")}</div>
          </div>
          <div className="h-px w-full bg-bone/10">
            <div className="h-px bg-bone" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
