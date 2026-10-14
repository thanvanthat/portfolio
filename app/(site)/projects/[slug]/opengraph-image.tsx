import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";

export const alt = `Project case study — ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const accent = project?.atmosphere.accent ?? "#9fd4ff";
  const base = project?.atmosphere.base ?? "#09090a";
  const glow = project?.atmosphere.glow ?? "#1c2a38";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: `radial-gradient(circle at 80% 10%, ${glow} 0%, ${base} 62%)`,
        color: "#ecebe6",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 4, color: "#8b8b90" }}>
        <span>{site.name.toUpperCase()}</span>
        <span style={{ color: accent }}>{project?.status === "Live" ? "● LIVE" : (project?.status ?? "").toUpperCase()}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 28, letterSpacing: 6, color: accent }}>
          {project ? `PROJECT ${project.number} — ${project.type.toUpperCase()}` : "PROJECT"}
        </span>
        <span style={{ fontSize: 120, fontWeight: 900, letterSpacing: -4, lineHeight: 1, marginTop: 16 }}>
          {(project?.title ?? site.name).toUpperCase()}
        </span>
      </div>
      <div style={{ fontSize: 30, opacity: 0.8, maxWidth: 1000 }}>{project?.statement ?? site.tagline}</div>
    </div>,
    size,
  );
}
