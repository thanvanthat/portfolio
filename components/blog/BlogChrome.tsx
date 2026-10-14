"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { blog } from "@/data/blog";
import { site } from "@/data/site";

/**
 * Framed-stage chrome: hairline inner frame, "+" registration marks and corner metadata.
 * The frame fades as you scroll; the name/navigation row stays.
 */
export function BlogChrome() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 280], [1, 0]);
  // Once the hero is gone, a soft shade keeps the name row readable over content
  const shade = useTransform(scrollY, [200, 500], [0, 1]);

  const mark = "absolute text-[13px] leading-none text-[rgb(244_241_234/0.4)]";

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 [--m:clamp(14px,2.4vh,30px)]"
        style={{ opacity: fade }}
      >
        <div className="absolute inset-[var(--m)] border border-[rgb(244_241_234/0.12)]" />
        <span className={`${mark} left-[var(--m)] top-[var(--m)] -translate-x-1/2 -translate-y-1/2`}>+</span>
        <span className={`${mark} right-[var(--m)] top-[var(--m)] -translate-y-1/2 translate-x-1/2`}>+</span>
        <span className={`${mark} bottom-[var(--m)] left-[var(--m)] -translate-x-1/2 translate-y-1/2`}>+</span>
        <span className={`${mark} bottom-[var(--m)] right-[var(--m)] translate-x-1/2 translate-y-1/2`}>+</span>
        <span className="blog-frame-meta absolute bottom-[calc(var(--m)+16px)] left-[calc(var(--m)+20px)]">
          {blog.meta.bottomLeft}
        </span>
        <span className="blog-frame-meta absolute right-[calc(var(--m)+7px)] top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] sm:block">
          {blog.meta.side}
        </span>
      </motion.div>

      <header className="fixed inset-x-0 top-0 z-30 [--m:clamp(14px,2.4vh,30px)]">
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgb(10_14_22/0.7)] to-transparent"
          style={{ opacity: shade }}
        />
        <nav
          aria-label="Blog"
          className="blog-frame-meta relative flex items-start justify-between gap-6 px-[calc(var(--m)+20px)] pt-[calc(var(--m)+16px)]"
        >
          <Link href="/" className="group">
            <span className="block normal-case tracking-[0.12em] text-[rgb(244_241_234/0.85)] transition-colors group-hover:text-bone">
              {site.name}
            </span>
            <span className="transition-colors group-hover:text-bone">← Portfolio</span>
          </Link>
          <div className="flex flex-col items-end">
            <span>{blog.meta.topRight}</span>
            <span className="flex gap-4">
              {pathname !== "/blog" && (
                <Link href="/blog" className="transition-colors hover:text-bone">
                  All posts
                </Link>
              )}
              <a href="/blog/feed.xml" className="transition-colors hover:text-bone">
                RSS
              </a>
            </span>
          </div>
        </nav>
      </header>
    </>
  );
}
