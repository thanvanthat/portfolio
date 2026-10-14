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

## Structure

```
app/                 routes: home, /projects/[slug] case studies (each with its own share image), OG image, sitemap, robots
components/
  home/              the homepage: HomeExperience (fixed 3D scene + overlays), HomeHero, Journey,
                     WorksGallery, HomeOutro; ArcadeScene + Player (three.js), stage.ts (scroll → camera
                     stage), screen.ts (the cabinet's CRT and marquee canvases)
  layout/            Navbar, Footer, Loader, CursorInteraction, PageTransition
  sections/          the previous homepage sections (not mounted; kept for reuse)
  projects/          GameProject, AIProject, ProjectModal, ProjectMeta, CaseStudy, ScreenGallery, ProjectLinks
  visuals/           procedural SVG key art, device frames for real screens, Blueprint graph, adaptive mini-game
  ui/                RevealText, WordReveal, MagneticButton, Pipeline, Marquee, ...
data/                all portfolio content (typed)
lib/                 types, hooks, utils, GSAP registration
public/projects/     real product screenshots (WebP)
public/models/       player.glb, the homepage character
styles/globals.css   design tokens (Tailwind @theme) and global styles
```

## Design notes

- **Type:** Archivo in condensed (`wdth 62`) and wide cuts for display, Inter Tight for body, JetBrains Mono for metadata.
- **Color:** ink, off-white and steel. Each project brings its own accent/atmosphere (`atmosphere` in `data/projects.ts`).
- **Screens and key art:** projects with `screens` in `data/projects.ts` show real captures in device frames (`ProjectArt`, `DeviceStage`, `ScreenGallery`). The others fall back to procedural SVG key art (`components/visuals/ProjectVisual.tsx`). To add captures, put WebP files in `public/projects/<project>/` and list them under `screens`.
- **Homepage scene:** one fixed three.js scene sits behind the scrolling page: a procedural arcade cabinet, the player character and a few floating props on a gradient sky, with depth of field, bloom and film grain. Scrolling moves the camera between fixed shots (`SHOTS` in `components/home/ArcadeScene.tsx`); the shot for each journey chapter is anchored to its `data-stage` entry and rests while you read. The CRT shows eyes that follow the cursor, a card per chapter, the project in view in the works gallery and a closing screen. Clicking the cabinet "presses start". The scene loads after first paint and fades in once ready, switches to a lighter effect chain on phones or when frame time stays above 33 ms, and falls back to the painted sky without WebGL or if the context is lost. With reduced motion the props, buttons and camera sway stay still.
- **Character:** `public/models/player.glb` is "Rogue" from KayKit Adventurers by Kay Lousberg ([kaylousberg.com](https://kaylousberg.com), CC0). The file was cut down with glTF-Transform to the Idle, Interact and Cheer clips, with the weapons removed, a 512 px WebP texture and meshopt compression (about 190 KB). Its head turns toward the cursor on top of the playing clip.
- **Motion:** everything respects `prefers-reduced-motion`. GSAP loads lazily.
- **Cursor:** desktop only. Add `data-cursor="hover|view|drag|explore"` (and optionally `data-cursor-label`) to any element.
