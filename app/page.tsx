import { AboutSection } from "@/components/sections/AboutSection";
import { AISection } from "@/components/sections/AISection";
import { BrainverseFeature } from "@/components/sections/BrainverseFeature";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { FresoraFeature } from "@/components/sections/FresoraFeature";
import { GrantPilotFeature } from "@/components/sections/GrantPilotFeature";
import { GameDevSection } from "@/components/sections/GameDevSection";
import { GilliFeature } from "@/components/sections/GilliFeature";
import { Hero } from "@/components/sections/Hero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { UnrealSection } from "@/components/sections/UnrealSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <ProjectShowcase />
      <GameDevSection />
      <GilliFeature />
      <UnrealSection />
      <AISection />
      <FresoraFeature />
      <GrantPilotFeature />
      <BrainverseFeature />
      <SkillsSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
