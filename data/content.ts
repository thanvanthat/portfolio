import type { PipelineStep, ResearchThread, SkillGroup, TimelineEntry, UnrealStage } from "@/lib/types";

export const aboutStatements = [
  "Game Development",
  "Unreal Engine",
  "AI Systems",
  "Software Engineering",
  "Interactive Experiences",
];

export const aboutIntro =
  "I'm a Computer Science and Engineering student working where games and intelligence overlap. I prototype mechanics in Unreal Engine, train and wire up models for vision and personalization, and build the software that holds it together.";

export const timeline: TimelineEntry[] = [
  {
    chapter: "I",
    title: "Foundations",
    body: "Computer Science and Engineering — data structures, algorithms and the habit of building things to understand them.",
    tags: ["C++", "Python", "Problem solving"],
  },
  {
    chapter: "II",
    title: "Worlds",
    body: "Moved into game development: Unreal Engine 5, Blueprints, levels, materials and MetaHumans, then shipped Gilli, a 3D physics game with a C# engine.",
    tags: ["Unreal Engine 5", "Blueprints", "C#", "Gilli"],
  },
  {
    chapter: "III",
    title: "Intelligence",
    body: "Exploring machine learning and computer vision — CNNs, object detection and generative AI — through applied projects.",
    tags: ["Computer Vision", "CNN", "Generative AI"],
  },
  {
    chapter: "IV",
    title: "Convergence",
    body: "Now shipping projects where they meet: Gilli, Fresora and GrantPilot AI are live, alongside adaptive games and interactive web experiences.",
    tags: ["Fresora", "GrantPilot AI", "BrainVerse AI"],
  },
];

export const unrealStages: UnrealStage[] = [
  {
    label: "Blueprints",
    detail: "Visual scripting for gameplay logic, interactions, triggers and state.",
    tools: ["Event graphs", "Interfaces", "Components"],
  },
  {
    label: "Characters",
    detail: "Third-person setups, animation, cameras and MetaHuman characters.",
    tools: ["MetaHuman", "Anim BP", "Camera rigs"],
  },
  {
    label: "Gameplay",
    detail: "Prototyping mechanics quickly, then tuning them by feel.",
    tools: ["Prototyping", "Encounters", "Objectives"],
  },
  {
    label: "UI",
    detail: "HUDs, menus and prompts that support play without getting in the way.",
    tools: ["UMG", "Widgets", "HUD"],
  },
  {
    label: "World",
    detail: "Level blockouts, lighting and materials that set the atmosphere.",
    tools: ["Levels", "Materials", "Lighting"],
  },
  {
    label: "Player Experience",
    detail: "Everything above, judged by one question — how does it feel to play?",
    tools: ["Pacing", "Feedback", "Flow"],
  },
];

export const unrealCapabilities = [
  "Unreal Engine 5",
  "Blueprints",
  "MetaHuman",
  "Materials",
  "Levels",
  "UI Systems",
  "Gameplay Prototyping",
];

export const aiPipeline: PipelineStep[] = [
  { label: "Input", detail: "Camera frames, gameplay events, user actions." },
  { label: "Vision / Data", detail: "Pre-processing, features, signals." },
  { label: "AI Model", detail: "CNNs, detectors, ML and generative models." },
  { label: "Decision", detail: "Scores, estimates, predictions." },
  { label: "User Experience", detail: "Adaptive, assistive, personal." },
];

export const researchThreads: ResearchThread[] = [
  {
    title: "Fresora",
    status: "Live",
    summary: "Food identification with MobileNetV2 and YOLOX, OpenCV freshness measurement and an explainable score.",
    slug: "fresora",
  },
  {
    title: "GrantPilot AI",
    status: "Live",
    summary: "Explainable qualification, proposal and compliance engines for government grants and tenders, with an AI agent.",
    slug: "grantpilot-ai",
  },
  {
    title: "BrainVerse AI",
    status: "In development",
    summary: "Gameplay signals driving adaptive difficulty in cognitive challenges.",
    slug: "brainverse-ai",
  },
  {
    title: "AI-assisted game systems",
    status: "Exploring",
    summary: "Using models to support NPC behaviour, content and tuning in prototypes.",
  },
  {
    title: "AI personalization",
    status: "Exploring",
    summary: "Experiences that adapt pace and content to the person using them.",
  },
];

export const skillGroups: SkillGroup[] = [
  { id: "game", title: "Game Development", caption: "Worlds & mechanics", items: ["Unreal Engine", "Blueprints"] },
  { id: "code", title: "Programming", caption: "Languages", items: ["C++", "C#", "Python", "JavaScript / TypeScript"] },
  {
    id: "ai",
    title: "AI / ML",
    caption: "Intelligence",
    items: ["Machine Learning", "Computer Vision", "CNN", "Object Detection", "Generative AI", "AI APIs"],
  },
  { id: "web", title: "Web", caption: "Interfaces", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { id: "tools", title: "Tools", caption: "Pipeline", items: ["Git", "GitHub", "Blender", "DaVinci Resolve", "Visual Studio"] },
];

export const processSteps: PipelineStep[] = [
  { label: "Question", detail: "Start from the experience — what should the player or user feel, learn or decide?" },
  { label: "Prototype", detail: "Build the smallest playable or testable version, fast and rough." },
  { label: "Systems", detail: "Turn what works into clean, data-driven systems and code." },
  { label: "Polish", detail: "Iterate on feel, feedback, performance and presentation." },
];
