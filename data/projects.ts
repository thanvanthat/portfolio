import type { Project } from "@/lib/types";

/**
 * Project content. Statuses and technologies are written conservatively —
 * update them as each project evolves.
 */
export const projects: Project[] = [
  {
    slug: "brainverse-ai",
    number: "01",
    title: "BrainVerse AI",
    statement: "Adaptive gameplay powered by intelligence.",
    description:
      "An adaptive brain-gaming platform where cognitive challenges reshape themselves around how each player actually plays.",
    categories: ["game", "ai"],
    type: "Adaptive cognitive game platform",
    role: "Game design · AI systems · Development",
    engine: "Web platform",
    technologies: ["Python", "Machine Learning", "JavaScript / TypeScript", "React", "AI APIs"],
    status: "In development",
    visual: "brainverse",
    atmosphere: { accent: "#b7a4ff", base: "#0d0b16", glow: "#3b2d7a" },
    overview:
      "BrainVerse AI is a collection of short cognitive challenges — memory, focus, pattern recognition and reaction — connected by a system that reads gameplay signals and tunes the next challenge.",
    problem:
      "Most brain-training games use fixed difficulty curves. Players either plateau on content that is too easy or drop off when it spikes too hard.",
    concept:
      "Treat every session as data. Accuracy, reaction time and streaks feed an analysis layer that decides the next level's pace, grid size and complexity — keeping players in a flow zone.",
    responsibilities: [
      "Designing the challenge formats and game loop",
      "Building the adaptive difficulty logic",
      "Developing the gameplay UI and interaction feedback",
      "Structuring gameplay telemetry for analysis",
    ],
    system: [
      { label: "Player", detail: "Plays a short cognitive challenge." },
      { label: "Gameplay Data", detail: "Accuracy, reaction time, streaks and errors are captured." },
      { label: "AI Analysis", detail: "Signals are scored against the player's recent performance." },
      { label: "Adaptive Difficulty", detail: "Pace, grid size and complexity are adjusted." },
      { label: "Personalized Challenge", detail: "The next round is generated for that player." },
    ],
    process: [
      {
        heading: "Mechanics first",
        body: "Prototyped each mini-game as a standalone loop and tuned it by feel before connecting any intelligence.",
      },
      {
        heading: "Instrumenting play",
        body: "Defined the gameplay signals that matter and logged them consistently across challenge types.",
      },
      {
        heading: "Adaptation layer",
        body: "Iterating on the rules and models that turn those signals into difficulty decisions.",
      },
    ],
    result: "Actively in development. Core challenge loops and the adaptive difficulty flow are being built and tested.",
    gallery: [
      { caption: "Challenge hub", variant: 0 },
      { caption: "Pattern memory grid", variant: 1 },
      { caption: "Session analysis", variant: 2 },
    ],
  },
  {
    slug: "gilli",
    number: "02",
    title: "Gilli",
    statement: "Tamil Nadu's street game, rebuilt in 3D with real physics.",
    description:
      "A browser-based 3D Gilli-Danda (Kitti Pull) game set on a red-earth village maidan. Flick the gilli, strike it in the air and dodge the fielders, alone against the computer or online with up to three friends.",
    categories: ["game", "web"],
    type: "3D physics game · Single player & online multiplayer",
    role: "Game design · C# engine & physics · 3D client · Netcode",
    engine: "C# (.NET 10) · Three.js",
    technologies: [
      "C# / .NET 10",
      "BEPUphysics v2",
      "WebAssembly",
      "ASP.NET Core",
      "SignalR",
      "WebRTC",
      "React 19",
      "TypeScript",
      "Three.js",
      "Vite",
      "xUnit",
      "Vercel",
    ],
    status: "Live",
    visual: "gilli",
    device: "desktop",
    atmosphere: { accent: "#f08a4b", base: "#120a07", glow: "#6b2410" },
    overview:
      "Gilli is the village street game of Tamil Nadu, played on a procedurally built maidan with coconut palms, banyan trees, tiled and thatched houses, a tea kadai, a temple gopuram and paddy fields. The gilli is a real rigid body simulated by BEPUphysics in a C# engine, so every hit, catch, throw, distance and score comes from the simulation. The same engine runs as a server for online rooms and as WebAssembly inside the browser.",
    problem:
      "Gilli-Danda is a game many people grew up playing in the street, but it has almost no digital version, and a simple arcade remake loses what makes it fun: how the gilli pops up, spins and rolls.",
    concept:
      "Let physics decide everything. The batter flicks and strikes a simulated gilli, the engine measures where it actually stops, and the rules turn that distance into dandas. Fielders can catch it or throw at the danda laid across the pit, exactly like the street game.",
    responsibilities: [
      "Designed the rules: toss, innings, 3-miss outs, catches, throws at the danda and a retire limit",
      "Built the authoritative C# engine with BEPUphysics v2: a kinematic danda swept at 960 Hz against the gilli",
      "Rules engine that resolves every attempt exactly once and scores floor(distance ÷ 0.75 m) + 1",
      "Computer players (Easy, Normal, Hard) that bat and field through the same rules and physics",
      "Three.js client with a procedural Tamil Nadu village, procedural characters, interpolation and ballistic prediction",
      "Online rooms for 2–4 players: SignalR server, and a peer-to-peer WebRTC mode where the host's browser runs the room",
      "Compiled the C# engine to WebAssembly so the whole game runs on static Vercel hosting",
      "65 C# tests, CI, CodeQL scanning and security hardening (rate limits, strict CSP)",
    ],
    system: [
      { label: "Flick", detail: "The batter flicks the gilli up from the pit; the engine applies an impulse to the rigid body." },
      { label: "Swing", detail: "A kinematic danda capsule sweeps through the BEPU world at 960 Hz." },
      { label: "Contact", detail: "BEPU's narrow phase reports the real danda–gilli contact and applies the impact once." },
      { label: "Flight", detail: "The gilli flies, spins, bounces and rolls under gravity and drag until it rests." },
      { label: "Rules", detail: "Catch, throw at the danda, safe or miss is resolved exactly once and scored." },
      { label: "Every player", detail: "Clients render 30 Hz snapshots with interpolation and predict the gilli in the air." },
    ],
    process: [
      {
        heading: "Classic first",
        body: "Started as a single-file Kitti Pull game to find the rules and the feel. It is still playable as the Classic version.",
      },
      {
        heading: "Physics as the referee",
        body: "Moved the game into a C# engine with BEPUphysics so distance, catches and danda hits come from a real simulation, covered by physics, rules and room tests.",
      },
      {
        heading: "Play anywhere",
        body: "Compiled the engine to WebAssembly and added peer-to-peer rooms, so single player and online matches run from a static site with no game server.",
      },
    ],
    result:
      "Live on Vercel. Single player against the computer, practice and online multiplayer with friends all run in the browser, with nothing to install.",
    highlights: [
      { value: "960 Hz", label: "Swing physics" },
      { value: "2–4", label: "Players online" },
      { value: "65", label: "C# tests" },
      { value: "WASM", label: "C# engine in the browser" },
    ],
    note: "Screens captured from a single-player match against the computer.",
    screens: [
      {
        src: "/projects/gilli/menu.webp",
        alt: "Gilli main menu over a 3D Tamil Nadu village with a temple gopuram and a red-earth field",
        caption: "The village maidan",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/gilli/batting.webp",
        alt: "Batter standing at the pit with the danda, ready to flick the gilli",
        caption: "Batting: flick, then strike",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/gilli/flight.webp",
        alt: "The gilli landing past the 20 metre ring while a computer fielder runs after it",
        caption: "Run it out: the gilli lands at 14.2 m",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/gilli/safe.webp",
        alt: "Safe plus 33: 24.42 metres equals 32 dandas plus 1 bonus",
        caption: "Safe! 24.42 m = 32 dandas + 1",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/gilli/throw.webp",
        alt: "Fielder aiming a throw at the danda across the pit with a power and height gauge",
        caption: "Fielding: throw at the danda",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/gilli/toss.webp",
        alt: "The toss: Team A won and chooses to bat or field first",
        caption: "The toss",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/gilli/result.webp",
        alt: "Match result table with points, safe hits, longest hit and how each player got out",
        caption: "Match result",
        width: 1600,
        height: 1000,
      },
    ],
    links: [
      { label: "Play the game", href: "https://gilli-rho.vercel.app/", kind: "live" },
      { label: "Source code", href: "https://github.com/thanvanthat/Gilli", kind: "source" },
    ],
  },
  {
    slug: "snakes-and-ladders-3d",
    number: "03",
    title: "Snakes & Ladders 3D",
    statement: "A board game where the snakes actually bite.",
    description:
      "A complete 3D Snakes & Ladders tabletop for the browser, with animated human characters, snakes that strike, ladders you climb rung by rung and a real 3D die. Play with 2–4 people on one device or against the computer.",
    categories: ["game", "web"],
    type: "3D tabletop game · Local multiplayer & vs computer",
    role: "Game design · 3D scene & animation · Rules engine · UI",
    engine: "React Three Fiber · Three.js",
    technologies: [
      "React 18",
      "TypeScript (strict)",
      "Three.js",
      "React Three Fiber",
      "Drei",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Web Audio",
      "Vitest",
      "Vercel",
    ],
    status: "Live",
    visual: "snakes",
    device: "desktop",
    atmosphere: { accent: "#f6b93b", base: "#0e0d0b", glow: "#5c3a12" },
    overview:
      "Snakes & Ladders 3D turns the family board game into a small 3D world: a bevelled 100-square board on a wooden table, six procedurally modelled characters, snakes with jaws, fangs and forked tongues, and a die that tumbles before landing. Everything is generated in code, so it runs fully offline with no backend and no downloaded assets.",
    problem:
      "Most digital versions of Snakes & Ladders move a token from one square to another and stop there. The moments everyone remembers from the real game, climbing a ladder and getting caught by a snake, are skipped.",
    concept:
      "Keep the traditional rules exact and spend the effort on those two moments. Characters walk the board, climb ladders rung by rung and get bitten, then slide down the snake's real body curve, while a strict turn engine keeps every animation in step with the rules.",
    responsibilities: [
      "Rules engine as pure functions: exact-finish rule, optional roll-a-1-to-start and six-rolls-again house rules",
      "Turn state machine where every stage waits for its animation, so turns cannot overlap or corrupt a restart",
      "Procedural humanoid rig with idle, walk, climb, recoil, slide and celebrate animations, in six looks",
      "Snakes on Catmull-Rom curves with procedural skin, hinged jaw and a full bite sequence",
      "3D board in a single instanced draw call, ladders, die physics-style tumble and confetti",
      "Computer opponent that uses the same die and rules",
      "UI: home screen with live 3D preview, setup, move history, pause, settings and victory screen",
      "Procedural Web Audio sound, saved progress, keyboard controls, reduced-motion support and 92 tests",
    ],
    system: [
      {
        label: "Roll",
        detail: "A fair die (crypto RNG with rejection sampling) decides the value; the 3D die tumbles and settles on it.",
      },
      { label: "Plan", detail: "The rules engine works out the whole turn up front: move, ladder, snake, overshoot or win." },
      { label: "Walk", detail: "The character walks square by square along the board's serpentine path." },
      { label: "Ladder or snake", detail: "Climb rung by rung to the top, or get bitten and slide down the snake's body." },
      { label: "Next turn", detail: "Only when every animation reports back does the next player roll." },
    ],
    process: [
      {
        heading: "Rules first",
        body: "Built the board layout, rules and turn engine as plain TypeScript with tests before drawing anything.",
      },
      {
        heading: "Characters and creatures",
        body: "Modelled and animated the characters, snakes and ladders procedurally, with shared curves so rendering and movement always match.",
      },
      {
        heading: "Polish and safety",
        body: "Added sound, saved games, settings, accessibility and checks so stale or duplicate animation callbacks are ignored.",
      },
    ],
    result:
      "Live on Vercel and deployed automatically from GitHub on every push. It runs fully offline in the browser with nothing to install.",
    highlights: [
      { value: "100", label: "Squares, one draw call" },
      { value: "6", label: "Animated characters" },
      { value: "8", label: "Steps in a snake bite" },
      { value: "92", label: "Tests" },
    ],
    note: "Screens shown in order, captured from one game against the computer.",
    screens: [
      {
        src: "/projects/snakes/1-home.webp",
        alt: "Snakes and Ladders 3D home screen over a live 3D preview of the board",
        caption: "1 · Home: the board in 3D",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/snakes/2-setup.webp",
        alt: "New game setup with Vs computer mode, house rules and character colours",
        caption: "2 · New game: mode, house rules, characters",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/snakes/3-first-turn.webp",
        alt: "Game screen at the first turn with the dice panel and empty move history",
        caption: "3 · First turn: roll the die",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/snakes/4-ladder.webp",
        alt: "Ava climbed a ladder from square 1 up to square 14, shown in the move history",
        caption: "4 · Ladder: up from 1 to 14",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/snakes/5-race.webp",
        alt: "Both players on the board, Ava on 14 next to the snake on 16 and Leo on 3",
        caption: "5 · The race: Ava next to the snake on 16",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/snakes/6-midgame.webp",
        alt: "Turn 15: Ava on square 67 and Leo on 35, with the move history listing Ava's ladder climbs to 31, 44 and 67",
        caption: "6 · Mid-game: Ava up three ladders to 67",
        width: 1600,
        height: 1000,
      },
    ],
    links: [
      { label: "Play the game", href: "https://snakes-and-ladders-3d-psi.vercel.app/", kind: "live" },
      { label: "Source code", href: "https://github.com/thanvanthat/snake-and-ladder-", kind: "source" },
    ],
  },
  {
    slug: "freshco-ai",
    number: "04",
    title: "FreshCO AI",
    statement: "Scan food. Use it before it becomes waste.",
    description:
      "A live, AI-assisted food freshness and zero-waste app. Scan food with your phone, get a measured read of its visible condition, track what you own and rescue it with recipes before it spoils.",
    categories: ["ai"],
    type: "AI + computer vision app · Android & web",
    role: "Solo build · Product design, mobile, backend, CV",
    engine: "React Native (Expo) · FastAPI",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "FastAPI",
      "OpenCV",
      "MobileNetV2 (ONNX)",
      "YOLOX-Tiny",
      "Supabase",
      "TanStack Query",
      "Zustand",
      "Vercel",
    ],
    status: "Live",
    visual: "freshco",
    device: "phone",
    atmosphere: { accent: "#c5ec7a", base: "#0a0f0a", glow: "#2d4a1f" },
    overview:
      "FreshCO AI runs one loop: scan, identify, measure, score, recommend, track, rescue. A photo goes to a FastAPI service where OpenCV measures the surface and on-device models identify the food. The app turns that into a 0–100 freshness score, a storage tip, an estimated freshness window and zero-waste recipes for whatever needs using first.",
    problem:
      "Food gets thrown away because nobody notices it ageing until it is too late. Manual inventory apps are tedious, and most 'AI freshness' demos give a confident verdict without showing how they got it.",
    concept:
      "Measure first, then score in the open. Every number comes from a real measurement: defect coverage, browning, hue drift, texture and colour consistency. A documented formula weights them per food family, so the score is explainable rather than a black box, and the app says plainly when a photo cannot tell.",
    responsibilities: [
      "Designed and built the whole product end to end",
      "27-screen Expo / React Native app with its own design system and 6 languages",
      "FastAPI backend with OpenCV metrics and a transparent scoring formula",
      "Food identification with MobileNetV2 and YOLOX-Tiny via onnxruntime",
      "Inventory, scan history and per-item freshness journey",
      "Zero-waste recipes that prioritise expiring food and never use spoiled items",
      "Optional Supabase sync with row-level security; works fully offline without it",
      "Deployed the web build and the API to Vercel",
    ],
    system: [
      { label: "Scan", detail: "Camera capture or a photo from the gallery, on Android or the web build." },
      {
        label: "Identify",
        detail: "MobileNetV2 and YOLOX-Tiny (ONNX) recognise the food, including several items in one photo.",
      },
      { label: "Measure", detail: "OpenCV measures defects, browning, discoloration, texture and colour consistency." },
      { label: "Score", detail: "A documented formula weights each signal per food family into a 0–100 score." },
      { label: "Recommend", detail: "Storage advice and an estimated freshness window from a curated knowledge base." },
      { label: "Track & rescue", detail: "Inventory, freshness journeys and recipes built around what is about to be lost." },
    ],
    process: [
      {
        heading: "Real measurements",
        body: "Built the OpenCV metrics first and tested them on real produce. Two fixes came from testing: filling mask holes so dark rot is not cut out of the food region, and regularising texture so JPEG noise stops costing points on a flawless surface.",
      },
      {
        heading: "An honest score",
        body: "Wrote the scoring formula as code with tests: weights sum to 1 per food family, missing signals redistribute their weight, browning is only measured on foods where the formula is valid, and meat, seafood and dairy are capped at 72 because a photo cannot prove they are safe.",
      },
      {
        heading: "One codebase, two platforms",
        body: "The same TypeScript source ships as the Android app and the web build through react-native-web, with on-device storage by default and optional Supabase sync.",
      },
    ],
    result:
      "Live on the web, with the API deployed on Vercel. The Android build comes from the same codebase. The app works with zero credentials and reports exactly which models and services are active.",
    highlights: [
      { value: "27", label: "Screens" },
      { value: "5", label: "OpenCV signals" },
      { value: "0–100", label: "Explainable score" },
      { value: "6", label: "Languages" },
    ],
    note: "FreshCO AI analyses visible food characteristics from images. It cannot detect bacteria, odourless toxins or internal hazards. Results are AI-assisted estimates, not food-safety guarantees.",
    screens: [
      {
        src: "/projects/freshco/home.webp",
        alt: "FreshCO AI home screen with fresh and needs-attention counts",
        caption: "Home: what needs attention today",
        width: 780,
        height: 1688,
      },
      {
        src: "/projects/freshco/inventory.webp",
        alt: "FreshCO AI My Food inventory with freshness scores",
        caption: "My Food: scored inventory",
        width: 780,
        height: 1688,
      },
      {
        src: "/projects/freshco/item.webp",
        alt: "FreshCO AI item detail showing an overripe avocado scored 38 out of 100",
        caption: "Item detail and freshness window",
        width: 780,
        height: 1688,
      },
      {
        src: "/projects/freshco/recipes.webp",
        alt: "FreshCO AI zero-waste recipe screen listing ingredients to rescue",
        caption: "Zero-waste recipe rescue",
        width: 780,
        height: 1688,
      },
      {
        src: "/projects/freshco/scan.webp",
        alt: "FreshCO AI scan screen with camera and gallery options",
        caption: "Scan one item or several",
        width: 780,
        height: 1688,
      },
      {
        src: "/projects/freshco/onboarding.webp",
        alt: "FreshCO AI onboarding screen reading Scan any food",
        caption: "Onboarding",
        width: 780,
        height: 1688,
      },
    ],
    links: [
      { label: "Open the live app", href: "https://freshco-web.vercel.app/", kind: "live" },
      { label: "Source code", href: "https://github.com/thanvanthat/freshco-AI", kind: "source" },
    ],
  },
  {
    slug: "grantpilot-ai",
    number: "05",
    title: "GrantPilot AI",
    statement: "From government tender to review-ready bid.",
    description:
      "An AI-assisted government opportunity intelligence platform for Indian startups. It finds grants and tenders, scores how well a company fits, drafts the proposal and checks compliance before internal review.",
    categories: ["ai", "web"],
    type: "AI decision-support web platform",
    role: "Solo build · Product design, frontend, AI integration",
    engine: "React 18 · Vite",
    technologies: [
      "React 18",
      "Vite",
      "React Router",
      "Tailwind CSS",
      "shadcn-style UI",
      "Node.js proxy",
      "SNS Agent Workbench",
      "GitHub Actions",
      "GitHub Pages",
    ],
    status: "Live",
    visual: "grantpilot",
    device: "desktop",
    atmosphere: { accent: "#ff9933", base: "#0a1222", glow: "#1d3b6e" },
    overview:
      "GrantPilot covers the whole path from opportunity to submission-ready draft for schemes like DPIIT Startup India, iDEX, BIRAC BIG, TIDE 2.0 and GeM tenders. A company profile and its documents feed a qualification engine, which drives a proposal workspace, which feeds a compliance workspace with a readiness gate.",
    problem:
      "Startups lose weeks reading long government notices to decide whether to apply, then rebuild the same profile, evidence and compliance checklist for every bid. Most tools stop at listing opportunities and give no reasons.",
    concept:
      "One connected workflow, and every result explains itself. Qualification shows the score, eligibility, capability gaps, risks and a Pursue / Review / Skip recommendation with its reasons. The proposal cites matched capabilities and addresses the gaps. Compliance checks requirements, documents and risks before anything goes to review.",
    responsibilities: [
      "Product design and a government-portal design system (saffron, navy, tricolour accents)",
      "13 pages: dashboard, opportunities, detail, pipeline, compare, proposals, compliance, reports and more",
      "Deterministic qualification engine: weighted fit score, eligibility, gaps, risks, evidence and a recommendation",
      "Proposal workspace with section-by-section drafting and writing guidance",
      "Compliance engine: requirement checklist, document verification, risk register and readiness gate",
      "AI assistant widget connected to the SNS Agent Workbench, with an offline fallback",
      "CI/CD to GitHub Pages with GitHub Actions",
    ],
    system: [
      { label: "Profile & documents", detail: "Company capabilities, sector, experience and uploaded evidence." },
      { label: "Opportunity discovery", detail: "Grants, tenders and challenges filtered by sector, status and deadline." },
      {
        label: "Qualification",
        detail: "Weighted fit score, eligibility pass or fail, gaps, risks and a Pursue / Review / Skip call.",
      },
      { label: "Proposal", detail: "A draft built from the qualification that cites strengths and addresses gaps." },
      { label: "Compliance", detail: "Requirements, documents and risks checked against a transparent readiness gate." },
      { label: "Internal review", detail: "Ready for review, or a clear list of what is blocking it." },
    ],
    process: [
      {
        heading: "Design system first",
        body: "Built a government-portal visual language and a shared component kit so 13 data-heavy pages stay consistent and readable.",
      },
      {
        heading: "Explainable engines",
        body: "Wrote the qualification and compliance engines as deterministic, testable logic, so every score comes with the reasons behind it.",
      },
      {
        heading: "Connected AI",
        body: "Added an AI agent widget through a Node proxy to the SNS Agent Workbench, with a fallback that keeps the app useful offline and on static hosting.",
      },
    ],
    result:
      "Live on GitHub Pages and deployed automatically on every push. It is positioned as decision support: the UI says 'Ready for internal review', never 'approved' or 'guaranteed compliant'.",
    highlights: [
      { value: "13", label: "Product pages" },
      { value: "5", label: "Fit dimensions" },
      { value: "6", label: "Workflow stages" },
      { value: "CI/CD", label: "GitHub Actions" },
    ],
    note: "GrantPilot gives AI-assisted decision support. Final eligibility, legal and submission decisions go through the official government process.",
    screens: [
      {
        src: "/projects/grantpilot/qualification.webp",
        alt: "GrantPilot qualification showing an 82% strong match",
        caption: "Qualification: 82% strong match, explained",
        width: 1920,
        height: 1200,
      },
      {
        src: "/projects/grantpilot/compliance.webp",
        alt: "GrantPilot compliance workspace with readiness gate",
        caption: "Compliance workspace and readiness gate",
        width: 1920,
        height: 1200,
      },
      {
        src: "/projects/grantpilot/opportunities.webp",
        alt: "GrantPilot AI opportunity matching list",
        caption: "AI opportunity matching",
        width: 1920,
        height: 1200,
      },
      {
        src: "/projects/grantpilot/proposal.webp",
        alt: "GrantPilot proposal workspace with writing guidance",
        caption: "Proposal workspace with guidance",
        width: 1920,
        height: 1200,
      },
      {
        src: "/projects/grantpilot/pipeline.webp",
        alt: "GrantPilot opportunity pipeline board",
        caption: "Opportunity pipeline",
        width: 1920,
        height: 1200,
      },
      {
        src: "/projects/grantpilot/reports.webp",
        alt: "GrantPilot portfolio reports",
        caption: "Portfolio reports",
        width: 1920,
        height: 1200,
      },
      {
        src: "/projects/grantpilot/dashboard.webp",
        alt: "GrantPilot dashboard",
        caption: "Dashboard",
        width: 1920,
        height: 1200,
      },
    ],
    links: [
      { label: "Open the live app", href: "https://thanvanthat.github.io/GrantPilot-Frontend/#/dashboard", kind: "live" },
      { label: "Source code", href: "https://github.com/thanvanthat/GrantPilot-Frontend", kind: "source" },
    ],
  },
  {
    slug: "echo-protocol-escape",
    number: "06",
    title: "Echo Protocol: Escape",
    statement: "Third-person action-adventure prototype.",
    description:
      "A third-person action-adventure prototype built in Unreal Engine 5 — traversal, encounters and an escape narrative inside a locked-down facility.",
    categories: ["game"],
    type: "Third-person action-adventure",
    role: "Gameplay · Level design · Blueprints",
    engine: "Unreal Engine 5",
    technologies: ["Unreal Engine 5", "Blueprints", "MetaHuman", "Materials", "UMG UI"],
    status: "Prototype",
    visual: "echo",
    atmosphere: { accent: "#ff6a3d", base: "#0f0908", glow: "#5a1f12" },
    overview:
      "Echo Protocol: Escape follows a character trying to break out of a facility whose systems react to them. The prototype focuses on movement, level flow and moment-to-moment tension.",
    problem:
      "Build a playable slice that feels cohesive — character, camera, level and UI working together — rather than a set of disconnected mechanics.",
    concept:
      "A compact, atmospheric level where lighting, sound and layout guide the player, and every system exists to support the escape.",
    responsibilities: [
      "Third-person character and camera setup",
      "Gameplay logic in Blueprints",
      "Level blockout, lighting and materials",
      "HUD and menu UI",
    ],
    system: [
      { label: "Blueprints", detail: "Gameplay logic, interactions and triggers." },
      { label: "Character", detail: "Third-person movement, camera and animation." },
      { label: "Gameplay", detail: "Objectives, hazards and encounter flow." },
      { label: "UI", detail: "HUD, prompts and menus built with UMG." },
      { label: "World", detail: "Level layout, lighting and materials." },
    ],
    process: [
      { heading: "Blockout", body: "Greyboxed the facility to test pacing, sightlines and routes before any art." },
      { heading: "Systems", body: "Implemented interactions, objectives and hazards in Blueprints." },
      { heading: "Atmosphere", body: "Layered lighting, materials and UI to build tension." },
    ],
    result: "Playable prototype. Expanding encounters and polishing the level.",
    gallery: [
      { caption: "Facility corridor", variant: 0 },
      { caption: "Encounter space", variant: 1 },
      { caption: "Blueprint logic", variant: 2 },
    ],
  },
  {
    slug: "eco-dash",
    number: "07",
    title: "Eco Dash",
    statement: "A sustainability-focused endless runner.",
    description:
      "A fast, readable endless runner where collecting, dodging and choices are themed around sustainability and a world that recovers as you play.",
    categories: ["game"],
    type: "Endless runner",
    role: "Game design · Development",
    engine: "Game engine prototype",
    technologies: ["Game design", "C# / C++", "Procedural spawning", "UI"],
    status: "Prototype",
    visual: "ecodash",
    atmosphere: { accent: "#7fe0a8", base: "#07100d", glow: "#1d4a37" },
    overview:
      "Eco Dash uses the endless-runner format as a light way to talk about sustainability: pollution is an obstacle, clean energy is a power-up, and the environment visibly heals with good runs.",
    problem: "Educational games often feel like lessons with controls attached. The message needs to live inside the mechanics.",
    concept:
      "Keep the runner tight and fun first, then let the theme shape obstacles, collectibles and the world's visual state.",
    responsibilities: [
      "Core runner mechanics and controls",
      "Obstacle and collectible spawning",
      "Difficulty ramp and scoring",
      "Theme-driven UI and feedback",
    ],
    system: [
      { label: "Input", detail: "Lane switching, jump and slide." },
      { label: "Spawner", detail: "Procedurally places obstacles and pickups." },
      { label: "Difficulty", detail: "Speed and density ramp over time." },
      { label: "World State", detail: "Environment reacts to the player's run." },
    ],
    process: [
      { heading: "Feel", body: "Tuned speed, lane timing and hitboxes until the core loop felt fair." },
      { heading: "Theme", body: "Mapped sustainability ideas onto obstacles and power-ups." },
      { heading: "Loop", body: "Added scoring, ramping and the recovering-world feedback." },
    ],
    result: "Playable prototype with the core runner loop in place.",
    gallery: [
      { caption: "Run in progress", variant: 0 },
      { caption: "Clean-energy boost", variant: 1 },
      { caption: "World recovery", variant: 2 },
    ],
  },
  {
    slug: "game-dev-event-platform",
    number: "08",
    title: "Game Dev Event Platform",
    statement: "A home base for game development events.",
    description:
      "A web platform for running game development events — announcements, registrations, schedules and a showcase of what teams build.",
    categories: ["game", "web"],
    type: "Web platform",
    role: "Full-stack development · UI design",
    engine: "Web",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    status: "Completed",
    visual: "eventplatform",
    atmosphere: { accent: "#f2c46b", base: "#0f0d08", glow: "#4a3a17" },
    overview:
      "A platform built for the game development community around events: clear information for participants and a showcase that puts the games first.",
    problem:
      "Event details usually live across chat groups, forms and slides. Participants miss updates and projects disappear after the event.",
    concept: "One place for the whole event lifecycle — from announcement to registration to the final showcase.",
    responsibilities: [
      "Information architecture and UI design",
      "Frontend development",
      "Registration and schedule flows",
      "Project showcase pages",
    ],
    system: [
      { label: "Announce", detail: "Event pages with themes, rules and timelines." },
      { label: "Register", detail: "Participant and team registration." },
      { label: "Schedule", detail: "Sessions and milestones." },
      { label: "Showcase", detail: "A gallery of submitted games." },
    ],
    process: [
      { heading: "Structure", body: "Mapped the event lifecycle and what each audience needs at each step." },
      { heading: "Interface", body: "Designed a bold, game-flavoured UI that stays easy to scan." },
      { heading: "Build", body: "Implemented responsive pages and flows with a component-based frontend." },
    ],
    result: "Built and used as the web presence for game development events.",
    gallery: [
      { caption: "Event landing", variant: 0 },
      { caption: "Schedule", variant: 1 },
      { caption: "Showcase", variant: 2 },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length]!;
};

/** Order of the Game Development pinned sequence. */
export const gameProjects = [
  "gilli",
  "snakes-and-ladders-3d",
  "brainverse-ai",
  "echo-protocol-escape",
  "eco-dash",
  "game-dev-event-platform",
]
  .map((slug) => getProject(slug))
  .filter((p): p is Project => Boolean(p));

/** Order of the cinematic chapter sequence. */
export const chapterProjects = projects;

/** Shipped products with real captures and live links. */
export const liveProjects = projects.filter((p) => p.screens?.length && p.links?.length);
