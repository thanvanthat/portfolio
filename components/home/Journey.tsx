import type { TimelineEntry } from "@/lib/types";

/**
 * The journey timeline sits on the right, over a fixed frosted rail; each entry is a
 * `data-stage` anchor the 3D camera moves to as it reaches the reading line.
 */
export function Journey({ entries }: { entries: TimelineEntry[] }) {
  return (
    <section id="journey" aria-labelledby="journey-title" className="relative">
      <div className="relative ml-auto w-full max-w-[40rem] px-6 pb-[30vh] pt-[18vh] md:w-[min(46vw,40rem)] md:px-12">
        <h2 id="journey-title" className="font-serif-up text-[clamp(2.6rem,5vw,4rem)] leading-none text-[#f7f2e8]">
          Journey
        </h2>
        <ol className="journey-line relative mt-14">
          {entries.map((e) => (
            <li key={e.chapter} data-stage={e.chapter} className="relative min-h-[85vh] pl-9 last:min-h-[60vh]">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 size-[9px] -translate-x-1/2 rounded-full bg-[#f7f2e8] ring-4 ring-[#f7f2e8]/20"
              />
              {/* On small screens the camera sits behind the text, so each entry gets a frosted card */}
              <div className="-ml-3 rounded-2xl bg-[#11151c]/60 p-5 backdrop-blur-md md:ml-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
                <p className="label text-[#f7f2e8]/70">Chapter {e.chapter}</p>
                <h3 className="font-serif-up mt-2 text-[clamp(1.9rem,3vw,2.6rem)] leading-tight text-[#f7f2e8]">{e.title}</h3>
                <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-relaxed text-[#f7f2e8]/85">{e.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <li key={t} className="label rounded-full border border-[#f7f2e8]/25 px-3 py-1.5 text-[#f7f2e8]/85">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
