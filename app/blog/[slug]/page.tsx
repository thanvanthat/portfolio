import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentPosts, getPost, postText, publishedPosts } from "@/data/posts";
import { site } from "@/data/site";
import { BlogHero } from "@/components/blog/BlogHero";
import { PostBody } from "@/components/blog/PostBody";
import { formatDate, readingTime } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} — ${site.name}`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
    },
  };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();
  const { newer, older } = getAdjacentPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    keywords: post.tags.join(", "),
    url: `${site.url}/blog/${post.slug}`,
    author: { "@type": "Person", name: site.name, url: site.url },
  };

  const meta = "text-[10px] uppercase tracking-[0.26em] text-[rgb(244_241_234/0.65)]";

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHero title={post.title} variant="serif">
        <p className={meta}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="px-2">·</span>
          {readingTime(postText(post.body))} min read
          <span className="px-2">·</span>
          {post.tags.map((t) => `#${t}`).join("  ")}
        </p>
        <p className="mt-4 font-serif text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium leading-snug">{post.excerpt}</p>
      </BlogHero>

      <div className="px-4 pb-24 pt-[12vh] sm:px-6">
        <div className="mx-auto max-w-[46rem] rounded-sm border border-[rgb(244_241_234/0.12)] bg-[rgb(10_14_22/0.45)] px-6 py-12 backdrop-blur-md sm:px-12 sm:py-16">
          <PostBody blocks={post.body} />
        </div>

        <nav aria-label="More posts" className="mx-auto mt-16 grid max-w-[46rem] gap-4 sm:grid-cols-2">
          {[
            { post: older, label: "← Older" },
            { post: newer, label: "Newer →" },
          ].map(({ post: p, label }) =>
            p ? (
              <Link
                key={label}
                href={`/blog/${p.slug}`}
                className="group rounded-sm border border-[rgb(244_241_234/0.12)] bg-[rgb(10_14_22/0.35)] p-6 backdrop-blur-md transition-colors hover:border-[rgb(244_241_234/0.35)] sm:last:text-right"
              >
                <span className={meta}>{label}</span>
                <span className="mt-2 block font-serif text-2xl font-semibold leading-tight group-hover:text-peach">
                  {p.title}
                </span>
              </Link>
            ) : (
              <div key={label} className="hidden sm:block" />
            ),
          )}
        </nav>
        <p className="mt-12 text-center">
          <Link href="/blog" className={`${meta} hover:text-[#f4f1ea]`}>
            ← All posts
          </Link>
        </p>
      </div>
    </article>
  );
}
