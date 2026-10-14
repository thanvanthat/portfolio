import { site } from "@/data/site";

/** Copy and scene settings for the /blog pages. */
export const blog = {
  title: `${site.shortName}'s Journal`,
  intro:
    "Devlogs, experiments and lessons from building games and AI systems — the messy middle a portfolio leaves out. Scroll to look around.",
  listHeading: "Latest writing",
  /** Corner metadata on the framed stage. */
  meta: {
    topRight: `Journal — ${site.year}`,
    bottomLeft: "Code · Games · AI",
    side: "Notes from the workshop",
  },
  /**
   * Optional: your own 3D model (e.g. a character made in Blender), exported as .glb into /public.
   * Example: "/models/me.glb". Leave undefined to show the procedural clay controller.
   */
  model: undefined as string | undefined,
};
