export type ProjectCategory = "game" | "ai" | "web";

export type ProjectStatus = "Live" | "In development" | "Prototype" | "Concept prototype" | "Completed" | "Exploring";

/** Identifies which procedural artwork renders for a project. */
export type ProjectVisualKey =
  "brainverse" | "gilli" | "snakes" | "fresora" | "grantpilot" | "echo" | "ecodash" | "eventplatform";

export interface ProjectAtmosphere {
  /** Accent color used sparingly for highlights, states and hover. */
  accent: string;
  /** Deep base tone of the project's own atmosphere. */
  base: string;
  /** Soft secondary tone used in gradients and artwork. */
  glow: string;
}

/** A real capture of the product, stored under /public/projects. */
export interface ProjectScreen {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "live" | "source";
}

export interface PipelineStep {
  label: string;
  detail: string;
}

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  /** Short cinematic statement shown on chapters and hero. */
  statement: string;
  description: string;
  categories: ProjectCategory[];
  type: string;
  role: string;
  engine: string;
  technologies: string[];
  status: ProjectStatus;
  visual: ProjectVisualKey;
  atmosphere: ProjectAtmosphere;
  overview: string;
  problem: string;
  concept: string;
  responsibilities: string[];
  system: PipelineStep[];
  process: CaseStudySection[];
  result: string;
  /** Procedural key-art variants, used when a project has no real screens yet. */
  /** Generated key-art frames for projects without real screens. */
  gallery?: { caption: string; variant: number }[];
  /** Real product captures. When present they replace the procedural art. */
  screens?: ProjectScreen[];
  /** "phone" renders screens in a handset frame, "desktop" in a browser frame. */
  device?: "phone" | "desktop";
  /** Facts worth surfacing as large numbers on the case study. */
  highlights?: { value: string; label: string }[];
  /** Optional honest disclaimer, e.g. for AI estimation systems. */
  note?: string;
  links?: ProjectLink[];
}

export interface NavItem {
  id: string;
  label: string;
  /** Set for links to a separate route instead of a home-page section. */
  href?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  caption: string;
  items: string[];
}

export interface TimelineEntry {
  chapter: string;
  title: string;
  body: string;
  tags: string[];
}

export interface UnrealStage {
  label: string;
  detail: string;
  tools: string[];
}

export interface ResearchThread {
  title: string;
  status: ProjectStatus;
  summary: string;
  slug?: string;
}

/** A piece of a blog post body. Kept structured so posts stay typed data, not raw HTML. */
export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; code: string; lang?: string }
  | { type: "callout"; text: string };

export interface Post {
  slug: string;
  title: string;
  /** One or two sentences shown on cards, meta description and the RSS feed. */
  excerpt: string;
  /** ISO date, e.g. "2026-10-06". */
  date: string;
  tags: string[];
  /** Hide from listings, sitemap and feed while still drafting. */
  draft?: boolean;
  body: PostBlock[];
}

/** Lightweight post data for client-side listings (no body). */
export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  minutes: number;
}
