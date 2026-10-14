import { ArrowUpRight } from "lucide-react";
import type { SkillGroup, SocialLink } from "@/lib/types";
import { BrandIcon } from "@/components/ui/BrandIcon";

/** Closing screen: the cabinet says thanks for playing; contact and toolkit sit below. */
export function HomeOutro({ email, socials, skills }: { email: string; socials: SocialLink[]; skills: SkillGroup[] }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative px-6 pb-24 pt-[58vh] md:px-12 md:pt-[42vh]">
      <div className="mx-auto max-w-[60rem] text-center">
        <h2 id="contact-title" className="font-hand text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] text-[#f7f2e8]">
          Let&rsquo;s build something
        </h2>
        <p className="font-serif-up mx-auto mt-5 max-w-[34rem] text-[clamp(1.05rem,1.5vw,1.3rem)] text-[#f7f2e8]/85">
          Open to collaborations, internships and conversations about games, AI and interactive work.
        </p>
        <a
          href={`mailto:${email}`}
          className="label mt-9 inline-flex items-center gap-2 rounded-full bg-[#f7f2e8] px-7 py-4 text-[#11151c] transition-transform duration-300 hover:-translate-y-0.5"
        >
          {email} <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
        <ul className="mt-5 flex justify-center gap-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-flex items-center gap-2 rounded-full border border-[#f7f2e8]/30 px-5 py-3 text-[#f7f2e8] transition-colors duration-300 hover:border-[#f7f2e8]"
              >
                <BrandIcon name={s.label} /> {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-24 grid max-w-[72rem] gap-px overflow-hidden rounded-[1.25rem] border border-[#f7f2e8]/15 bg-[#f7f2e8]/10 sm:grid-cols-2 lg:grid-cols-5">
        {skills.map((g) => (
          <div key={g.id} className="bg-[#11151c]/75 p-6 backdrop-blur-md">
            <p className="label text-[#f7f2e8]/60">{g.caption}</p>
            <h3 className="font-serif-up mt-2 text-2xl text-[#f7f2e8]">{g.title}</h3>
            <ul className="mt-4 space-y-1.5 text-sm text-[#f7f2e8]/80">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
