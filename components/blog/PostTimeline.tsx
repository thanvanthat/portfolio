"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostSummary } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

/** Posts as a vertical timeline with a tag filter, set in the frosted right rail. */
export function PostTimeline({ posts, tags }: { posts: PostSummary[]; tags: string[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const visible = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <>
      <div role="group" aria-label="Filter posts by tag" className="flex flex-wrap gap-2">
        {[null, ...tags].map((t) => (
          <button
            key={t ?? "all"}
            type="button"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-colors duration-300",
              tag === t
                ? "border-[#f4f1ea] bg-[#f4f1ea] text-moss"
                : "border-[rgb(244_241_234/0.2)] text-[rgb(244_241_234/0.65)] hover:border-[rgb(244_241_234/0.5)] hover:text-[#f4f1ea]",
            )}
          >
            {t ?? "All"}
          </button>
        ))}
      </div>

      <ol
        aria-live="polite"
        className="relative mt-12 space-y-14 pl-8 before:absolute before:inset-y-2 before:left-[5px] before:w-px before:bg-[rgb(244_241_234/0.18)]"
      >
        {visible.map((post) => (
          <li key={post.slug} className="group relative">
            <span
              aria-hidden="true"
              className="absolute -left-8 top-1.5 size-[11px] rounded-full border border-[rgb(244_241_234/0.5)] bg-moss transition-colors duration-300 group-hover:border-peach group-hover:bg-peach"
            />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[rgb(244_241_234/0.55)]">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="px-2">·</span>
              {post.minutes} min read
            </p>
            <h3 className="mt-2 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-tight">
              <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-peach">
                {post.title}
              </Link>
            </h3>
            <p className="mt-3 font-serif text-lg leading-snug text-[rgb(244_241_234/0.75)]">{post.excerpt}</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 text-[10px] uppercase tracking-[0.22em] text-[rgb(244_241_234/0.5)]">
              {post.tags.map((t) => (
                <li key={t}>#{t}</li>
              ))}
            </ul>
          </li>
        ))}
        {!visible.length && <li className="font-serif text-lg text-[rgb(244_241_234/0.6)]">No posts with this tag yet.</li>}
      </ol>
    </>
  );
}
