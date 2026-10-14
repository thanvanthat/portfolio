import { Cormorant_Upright, Mansalva } from "next/font/google";
import { aboutIntro, skillGroups, timeline } from "@/data/content";
import { projects } from "@/data/projects";
import { site, socials } from "@/data/site";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeOutro } from "@/components/home/HomeOutro";
import { Journey } from "@/components/home/Journey";
import { WorksGallery } from "@/components/home/WorksGallery";

const hand = Mansalva({ weight: "400", subsets: ["latin"], variable: "--font-hand", display: "swap" });
const serif = Cormorant_Upright({ weight: ["500", "600"], subsets: ["latin"], variable: "--font-serif-up", display: "swap" });

export default function HomePage() {
  const chapters = timeline.map((t) => ({ numeral: t.chapter, title: t.title, tags: t.tags }));
  const works = projects.map((p) => ({
    number: p.number,
    title: p.title,
    accent: p.atmosphere.accent,
    base: p.atmosphere.base,
    cover: p.screens?.[0]?.src,
  }));

  return (
    <div className={`${hand.variable} ${serif.variable}`}>
      <HomeExperience
        name={site.shortName}
        subtitle="Game Dev · AI · Worlds"
        chapters={chapters}
        works={works}
        chrome={{
          bottomLeft: "Games · AI · Worlds",
          bottomRight: `Portfolio — ${site.year}`,
          side: site.roles.slice(0, 2).join(" + "),
        }}
      >
        <HomeHero title={`About ${site.shortName}`} body={aboutIntro} />
        <Journey entries={timeline} />
        <WorksGallery projects={projects} />
        <HomeOutro email={site.email} socials={socials} skills={skillGroups} />
      </HomeExperience>
    </div>
  );
}
