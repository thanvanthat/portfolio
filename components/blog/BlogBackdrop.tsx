"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Component, type ReactNode } from "react";
import { blog } from "@/data/blog";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/hooks";

const BlogScene = dynamic(() => import("./BlogScene"), { ssr: false });

/** Without WebGL the sage backdrop alone still carries the look. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Fixed layers behind blog content: the 3D stage, a scroll-driven scrim that darkens
 * where text sits, and (on the index) a frosted rail behind the post list.
 */
export function BlogBackdrop() {
  const pathname = usePathname();
  const route = pathname === "/blog" ? "index" : "post";
  const mobile = useMediaQuery("(max-width: 767px)");
  const still = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  const scrim = useTransform(scrollY, [0, 520], [0, route === "index" ? 0.45 : 0.6]);
  const rail = useTransform(scrollY, [240, 720], [0, 1]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-sage">
      <SceneBoundary>
        <BlogScene route={route} mobile={mobile} still={still} model={blog.model} />
      </SceneBoundary>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: scrim,
          background:
            route === "index"
              ? "linear-gradient(to right, rgb(10 14 22 / 0) 20%, rgb(10 14 22 / 0.75) 58%, rgb(10 14 22 / 1) 92%)"
              : "linear-gradient(to bottom, rgb(10 14 22 / 0.55), rgb(10 14 22 / 0.9))",
        }}
      />
      {route === "post" && (
        // Keeps the post title legible over the stage before the scrim kicks in
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(10_14_22/0.5)] via-[rgb(10_14_22/0.12)] via-45% to-transparent" />
      )}
      {route === "index" && (
        <motion.div
          className="blog-glass-rail absolute -inset-y-0.5 -right-0.5 w-full lg:w-[min(720px,56vw)]"
          style={{ opacity: rail }}
        />
      )}
    </div>
  );
}
