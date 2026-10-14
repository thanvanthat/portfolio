# Thanvanth AT — Portfolio

Cinematic portfolio for **Thanvanth AT — Game Developer + AI Engineer**.
Next.js (App Router) · React · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP ScrollTrigger · React Three Fiber.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (static)
npm run lint && npm run typecheck && npm run format:check
```

## Deploying

The site deploys to Vercel from `main` (https://thanvanth.vercel.app). If the domain changes, update `url` in `data/site.ts`; it drives canonical URLs, share images, the sitemap and robots.txt.

Project facts (status, engine, technologies, screenshots, live and source links) live in `data/projects.ts`. Update them as projects move along.

## Writing a blog post

Add an entry to `data/posts.ts`: a unique `slug`, an ISO `date`, `tags`, an `excerpt` and a `body` made of typed
blocks (`p`, `h2`, `h3`, `list`, `quote`, `code`, `callout`; see `PostBlock` in `lib/types.ts`). Posts are sorted by
date automatically and appear on `/blog`, the home page "Writing" section, the sitemap and the RSS feed.
Set `draft: true` to hide a post while you work on it.

## Structure

```
app/                 routes: home, /projects/[slug] case studies (each with its own share image),
                     /blog + /blog/[slug] posts, /blog/feed.xml (RSS), OG image, sitemap, robots
components/
  layout/            Navbar, Footer, Loader, CursorInteraction, PageTransition
  sections/          Hero (+ HeroScene WebGL), About, Experience, ProjectShowcase, GameDev,
                     Unreal, AI, FresoraFeature, GrantPilotFeature (both built on LiveProjectFeature),
                     BrainverseFeature, Skills/TechStack, Process, Contact
  blog/              PostCard, PostBody (renders typed post blocks), blog scene and chrome
  projects/          GameProject, AIProject, ProjectModal, ProjectMeta, CaseStudy, ScreenGallery, ProjectLinks
  visuals/           procedural SVG key art, device frames for real screens, Blueprint graph, adaptive mini-game
  ui/                RevealText, WordReveal, MagneticButton, Pipeline, Marquee, ...
data/                all portfolio content (typed)
lib/                 types, hooks, utils, GSAP registration
public/projects/     real product screenshots (WebP)
styles/globals.css   design tokens (Tailwind @theme) and global styles
```

## Design notes

- **Type:** Archivo in condensed (`wdth 62`) and wide cuts for display, Inter Tight for body, JetBrains Mono for metadata.
- **Color:** ink, off-white and steel. Each project brings its own accent/atmosphere (`atmosphere` in `data/projects.ts`).
- **Screens and key art:** projects with `screens` in `data/projects.ts` show real captures in device frames (`ProjectArt`, `DeviceStage`, `ScreenGallery`). The others fall back to procedural SVG key art (`components/visuals/ProjectVisual.tsx`). To add captures, put WebP files in `public/projects/<project>/` and list them under `screens`.
- **Motion:** everything respects `prefers-reduced-motion`; with reduced motion the Game Dev sequence stacks vertically instead of pinning. The WebGL hero (a particle cloud morphing between a game controller, a brain and a ringed planet, shapes in `components/visuals/morphShapes.ts`) runs on desktop only and loads after first paint. Phones and tablets get a terrain still (`public/hero-terrain.webp`) with a recorded loop of the morph (`public/hero-morph.mp4` / `.webm`) blended on top. GSAP loads lazily.
- **Cursor:** desktop only. Add `data-cursor="hover|view|drag|explore"` (and optionally `data-cursor-label`) to any element.
