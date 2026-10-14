import type { Metadata } from "next";
import Link from "next/link";
import { blog } from "@/data/blog";
import { allTags, postSummaries } from "@/data/posts";
import { site } from "@/data/site";
import { BlogHero } from "@/components/blog/BlogHero";
import { PostTimeline } from "@/components/blog/PostTimeline";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes, devlogs and lessons from ${site.name} on game development, AI and building software.`,
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/feed.xml" } },
  openGraph: { title: `Blog — ${site.name}`, url: "/blog", type: "website" },
};

export default function BlogPage() {
  return (
    <>
      <BlogHero title={blog.title}>
        <p className="font-serif text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-snug">{blog.intro}</p>
      </BlogHero>

      <section aria-labelledby="posts-heading" className="flex justify-end">
        <div className="w-full px-6 pb-24 pt-[18vh] sm:px-10 lg:w-[min(720px,56vw)] lg:pl-[min(180px,10vw)] lg:pr-[clamp(48px,6vw,96px)]">
          <h2 id="posts-heading" className="font-hand text-[clamp(2.25rem,4vw,3.5rem)] leading-none">
            {blog.listHeading}
          </h2>
          <p className="mb-8 mt-3 text-[10px] uppercase tracking-[0.26em] text-[rgb(244_241_234/0.55)]">
            {postSummaries.length} {postSummaries.length === 1 ? "entry" : "entries"}
          </p>
          <PostTimeline posts={postSummaries} tags={allTags} />

          <footer className="mt-28 flex flex-wrap items-center justify-between gap-4 border-t border-[rgb(244_241_234/0.14)] pt-6 text-[10px] uppercase tracking-[0.26em] text-[rgb(244_241_234/0.55)]">
            <span>
              © {site.year} {site.name}
            </span>
            <span className="flex gap-5">
              <Link href="/" className="hover:text-[#f4f1ea]">
                Portfolio
              </Link>
              <a href={`mailto:${site.email}`} className="hover:text-[#f4f1ea]">
                Email
              </a>
              <a href="/blog/feed.xml" className="hover:text-[#f4f1ea]">
                RSS
              </a>
            </span>
          </footer>
        </div>
      </section>
    </>
  );
}
