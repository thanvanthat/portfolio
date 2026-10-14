import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/data/projects";
import { CaseStudy } from "@/components/projects/CaseStudy";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.statement} ${project.description}`,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — Thanvanth AT`,
      description: project.description,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudy project={project} next={getNextProject(slug)} />;
}
