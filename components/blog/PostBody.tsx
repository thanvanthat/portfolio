import type { PostBlock } from "@/lib/types";
import { slugify } from "@/lib/utils";

/** Renders a post's structured body: serif headings and quotes, sans body for long reading. */
export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-6 text-[1.0625rem] leading-[1.8] text-[rgb(244_241_234/0.85)]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return <p key={i}>{block.text}</p>;
          case "h2":
            return (
              <h2
                key={i}
                id={slugify(block.text)}
                className="scroll-mt-28 pt-6 font-serif text-[clamp(1.75rem,3vw,2.4rem)] font-semibold leading-tight text-[#f4f1ea]"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slugify(block.text)} className="scroll-mt-28 pt-2 font-serif text-2xl font-semibold text-[#f4f1ea]">
                {block.text}
              </h3>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="grid grid-cols-[2rem_1fr]">
                    <span className="pt-[0.2rem] text-[11px] tracking-[0.2em] text-peach" aria-hidden="true">
                      {block.ordered ? String(j + 1).padStart(2, "0") : "✦"}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <figure key={i} className="my-10 text-center">
                <blockquote className="font-hand text-[clamp(1.5rem,3vw,2.1rem)] leading-snug text-[#f4f1ea]">
                  “{block.text}”
                </blockquote>
                {block.cite && (
                  <figcaption className="mt-3 text-[10px] uppercase tracking-[0.26em] text-[rgb(244_241_234/0.55)]">
                    — {block.cite}
                  </figcaption>
                )}
              </figure>
            );
          case "code":
            return (
              <figure
                key={i}
                className="my-8 overflow-hidden rounded-sm border border-[rgb(244_241_234/0.12)] bg-[rgb(10_14_22/0.7)]"
              >
                {block.lang && (
                  <figcaption className="border-b border-[rgb(244_241_234/0.12)] px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-[rgb(244_241_234/0.55)]">
                    {block.lang}
                  </figcaption>
                )}
                <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-steel">
                  <code>{block.code}</code>
                </pre>
              </figure>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="my-8 flex gap-4 rounded-sm border border-peach/30 bg-peach/10 p-5 font-serif text-lg leading-snug text-[#f4f1ea]"
              >
                <span className="text-peach" aria-hidden="true">
                  ✦
                </span>
                <p>{block.text}</p>
              </aside>
            );
        }
      })}
    </div>
  );
}
