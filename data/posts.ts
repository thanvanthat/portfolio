import type { Post, PostBlock, PostSummary } from "@/lib/types";
import { readingTime } from "@/lib/utils";

/**
 * Blog posts. Order here does not matter — the helpers below sort by date.
 * To publish: add an entry, give it a unique slug and an ISO date.
 * Set `draft: true` to keep a post out of listings, the sitemap and the feed.
 */
export const posts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello, world — why I'm starting a blog",
    excerpt:
      "Portfolios show the finished thing. This is where I want to write down the messy middle: the prototypes, the dead ends and what I learn building games and AI systems.",
    date: "2026-10-06",
    tags: ["Notes", "Meta"],
    body: [
      {
        type: "p",
        text: "A portfolio is a highlight reel. It shows what shipped, what it looks like and what it does. What it leaves out is almost everything I actually spend my time on: the prototype that felt wrong, the model that looked great on a test set and fell apart on real photos, the refactor that made the next feature possible.",
      },
      {
        type: "p",
        text: "This blog is for that part. Short, honest notes from building at the overlap of game development and AI.",
      },
      { type: "h2", text: "What to expect" },
      {
        type: "list",
        items: [
          "Devlogs from game prototypes — mechanics, feel and the systems behind them.",
          "Notes on applied AI — computer vision, adaptive systems and wiring models into real products.",
          "Engineering lessons — tools, workflows and mistakes worth not repeating.",
        ],
      },
      { type: "h2", text: "Why write at all" },
      {
        type: "p",
        text: "Writing is the fastest way I know to find out whether I understand something. If I can't explain a decision in a few paragraphs, I probably made it by accident.",
      },
      {
        type: "quote",
        text: "If you can't explain it simply, you don't understand it well enough.",
        cite: "Commonly attributed to Albert Einstein",
      },
      {
        type: "callout",
        text: "Want to talk about something I've written? My email and socials are at the bottom of every page.",
      },
    ],
  },
  {
    slug: "blueprints-first",
    title: "Blueprints first, C++ when it hurts",
    excerpt:
      "How I prototype gameplay in Unreal Engine 5: start in Blueprints for speed, and move logic to C++ only when there's a concrete reason.",
    date: "2026-09-28",
    tags: ["Game Dev", "Unreal Engine"],
    body: [
      {
        type: "p",
        text: "When an idea is new, the only question that matters is whether it's fun. Everything that slows down answering that question is a cost, and early on, compile times and boilerplate are a real cost.",
      },
      { type: "h2", text: "Why Blueprints first" },
      {
        type: "list",
        items: [
          "Iteration is immediate — tweak a value, hit play, feel the difference.",
          "The logic is visible, which makes it easy to spot the shape of a system before it's designed.",
          "Throwing a prototype away doesn't hurt, so I actually do it.",
        ],
      },
      { type: "h2", text: "Signals that it's time for C++" },
      {
        type: "list",
        ordered: true,
        items: [
          "The graph has become hard to read and the same nodes keep getting copy-pasted.",
          "Profiling points at a Blueprint function running every tick.",
          "Other systems need a stable, typed API to build on.",
        ],
      },
      {
        type: "p",
        text: "The pattern I like is a thin C++ base class that owns the data and the heavy lifting, with a Blueprint subclass on top for tuning and content. Designers — including future me — keep the fast loop, and the core stays solid.",
      },
      {
        type: "code",
        lang: "cpp",
        code: `UCLASS(Abstract, Blueprintable)
class AInteractableBase : public AActor
{
    GENERATED_BODY()

public:
    // Core logic lives here...
    UFUNCTION(BlueprintCallable, Category = "Interaction")
    void Interact(AActor* Instigator);

protected:
    // ...and the Blueprint layer decides how it looks and feels.
    UFUNCTION(BlueprintImplementableEvent, Category = "Interaction")
    void OnInteracted(AActor* Instigator);
};`,
      },
      {
        type: "callout",
        text: "Rule of thumb: move something to C++ because a profiler or a teammate asked for it, not because it feels more 'real'.",
      },
    ],
  },
  {
    slug: "honest-ai-estimates",
    title: "Designing AI features that admit what they don't know",
    excerpt:
      "A model's output is an estimate. Notes on presenting it that way — confidence, limits and disclaimers — without making the product feel useless.",
    date: "2026-09-15",
    tags: ["AI", "Product"],
    body: [
      {
        type: "p",
        text: "Whenever an AI feature looks at a photo or a document and returns an answer, it's tempting to show that answer as a fact. It's cleaner and it demos well. It's also usually wrong to do so.",
      },
      { type: "h2", text: "Say what the model can't see" },
      {
        type: "p",
        text: "A vision model only sees pixels. It can't smell, test or open anything. Being explicit about that boundary up front is more useful to people than a confident number they can't trust.",
      },
      { type: "h2", text: "Things I try to do" },
      {
        type: "list",
        items: [
          "Phrase results as estimates and decision support, not verdicts.",
          "Show the signals behind a result, so people can sanity-check it.",
          "Put limits next to the result, not buried in a terms page.",
          "Leave the final decision with the person — and say so.",
        ],
      },
      {
        type: "quote",
        text: "A tool that is honest about its limits gets trusted for the things it's actually good at.",
      },
      {
        type: "p",
        text: "None of this makes a feature less impressive. It makes it usable in the real world, which is the only place it matters.",
      },
    ],
  },
];

const byDateDesc = (a: Post, b: Post) => b.date.localeCompare(a.date);

/** Published posts, newest first. */
export const publishedPosts = posts.filter((p) => !p.draft).sort(byDateDesc);

export const getPost = (slug: string) => publishedPosts.find((p) => p.slug === slug);

/** Older and newer neighbours of a post in the published list. */
export function getAdjacentPosts(slug: string) {
  const i = publishedPosts.findIndex((p) => p.slug === slug);
  return {
    newer: i > 0 ? publishedPosts[i - 1] : undefined,
    older: i >= 0 && i < publishedPosts.length - 1 ? publishedPosts[i + 1] : undefined,
  };
}

/** Plain text of a post body, used for reading time. */
export function postText(body: PostBlock[]) {
  return body
    .map((b) => {
      if (b.type === "list") return b.items.join(" ");
      if (b.type === "code") return b.code;
      return b.text;
    })
    .join(" ");
}

export const allTags = [...new Set(publishedPosts.flatMap((p) => p.tags))].sort();

/** Body-less listing data, safe to hand to client components. */
export const postSummaries: PostSummary[] = publishedPosts.map(({ slug, title, excerpt, date, tags, body }) => ({
  slug,
  title,
  excerpt,
  date,
  tags,
  minutes: readingTime(postText(body)),
}));
