import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { GradientArtName } from "@/components/GradientArt/GradientArt";
import { disciplineSlugs, getDiscipline, type DisciplineSlug } from "./disciplines";

/*
 * Every project belongs to exactly one discipline, which decides how its page
 * is laid out: each discipline has its own hero and signature section, fed by
 * that discipline's optional `details`. The case study itself is the MDX body.
 */

export type ProjectType = "client" | "internal" | "product" | "prototype" | "experiment";
export type ProjectStatus = "concept" | "in-development" | "completed" | "live";

type Step = { title: string; text: string };
type Figure = { value: string; label: string };

/* Spatial: the capture behind the scene, and how it became an experience. */
export type SpatialDetails = {
  capture: Figure[];
  pipeline: Step[];
};

/* Hardware: a spec sheet, and the system from sensor to screen. */
export type HardwareDetails = {
  specs: { label: string; value: string }[];
  system: Step[];
};

/* AI: what a conversation looks like, and what happens behind it. */
export type AiDetails = {
  conversation: { from: "user" | "assistant"; text: string }[];
  flow: Step[];
};

/* Software: the stack, and the layers of the system. */
export type SoftwareDetails = {
  stack: { group: string; items: string[] }[];
  layers: Step[];
};

type DetailsFor = {
  "spatial-experiences": SpatialDetails;
  "hardware-electronics": HardwareDetails;
  "ai-automation": AiDetails;
  "software-engineering": SoftwareDetails;
};

type ProjectBase = {
  slug: string;
  title: string;
  summary: string;
  /** Every discipline the project touches. Only `discipline` decides the layout. */
  disciplines?: DisciplineSlug[];
  tags: string[];
  art: GradientArtName;
  type: ProjectType;
  status: ProjectStatus;
  year?: string;
  client?: string;
  role?: string;
  /** The lead image, used on cards and on the project page. */
  hero?: { image: string; alt: string };
  /** Shown in the homepage's featured row. */
  featured?: boolean;
  /** Sorts projects within a discipline. Lower comes first, then newest first. */
  order?: number;
  results?: Figure[];
  links: { label: string; href: string }[];
  /** A live demo hosted on this site (under /demos/), opened from the hero. */
  demo?: string;
  /** Slugs of projects to suggest at the end of the page. */
  related: string[];
  /** The case study, as MDX. */
  body: string;
};

/* A project, with `details` typed by its discipline. */
export type Project = {
  [D in DisciplineSlug]: ProjectBase & { discipline: D; details?: DetailsFor[D] };
}[DisciplineSlug];

export const projectTypeLabels: Record<ProjectType, string> = {
  client: "Client project",
  internal: "Internal project",
  product: "Product",
  prototype: "Prototype",
  experiment: "Experiment",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  concept: "Concept",
  "in-development": "In development",
  completed: "Completed",
  live: "Live",
};

/* Loading: every content/projects/<slug>.mdx file is a project, validated against the schema below. */

const projectsDir = path.join(process.cwd(), "content/projects");

const step = z.object({ title: z.string(), text: z.string() });
const figure = z.object({ value: z.string(), label: z.string() });

const detailsSchemas = {
  "spatial-experiences": z.object({ capture: z.array(figure), pipeline: z.array(step) }),
  "hardware-electronics": z.object({
    specs: z.array(z.object({ label: z.string(), value: z.string() })),
    system: z.array(step),
  }),
  "ai-automation": z.object({
    conversation: z.array(z.object({ from: z.enum(["user", "assistant"]), text: z.string() })),
    flow: z.array(step),
  }),
  "software-engineering": z.object({
    stack: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
    layers: z.array(step),
  }),
} satisfies Record<DisciplineSlug, z.ZodType>;

const frontmatter = z.object({
  title: z.string(),
  summary: z.string(),
  discipline: z.enum(disciplineSlugs),
  disciplines: z.array(z.enum(disciplineSlugs)).optional(),
  tags: z.array(z.string()).default([]),
  art: z.enum(["spatial", "hardware", "ai", "software", "horizon", "dusk"]).optional(),
  type: z.enum(["client", "internal", "product", "prototype", "experiment"]),
  status: z.enum(["concept", "in-development", "completed", "live"]),
  year: z.coerce.string().optional(),
  client: z.string().optional(),
  role: z.string().optional(),
  hero: z.object({ image: z.string(), alt: z.string() }).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  results: z.array(figure).optional(),
  links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  demo: z.string().startsWith("/demos/").optional(),
  related: z.array(z.string()).default([]),
  details: z.unknown().optional(),
});

function loadProject(file: string): Project {
  const slug = path.basename(file, ".mdx");
  const { data, content } = matter(fs.readFileSync(path.join(projectsDir, file), "utf8"));
  const parsed = frontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(`content/projects/${file}: ${z.prettifyError(parsed.error)}`);
  }
  const { details, ...meta } = parsed.data;
  const detailsResult = detailsSchemas[meta.discipline].optional().safeParse(details);
  if (!detailsResult.success) {
    throw new Error(`content/projects/${file} details: ${z.prettifyError(detailsResult.error)}`);
  }
  return {
    ...meta,
    slug,
    art: meta.art ?? getDiscipline(meta.discipline).art,
    details: detailsResult.data,
    body: content,
  } as Project;
}

const byOrderThenNewest = (a: Project, b: Project) =>
  (a.order ?? Infinity) - (b.order ?? Infinity) || (b.year ?? "").localeCompare(a.year ?? "");

export const projects: Project[] = fs
  .readdirSync(projectsDir)
  .filter((file) => file.endsWith(".mdx"))
  .map(loadProject)
  .sort(byOrderThenNewest);

for (const project of projects) {
  for (const slug of project.related) {
    if (!projects.some((p) => p.slug === slug)) {
      throw new Error(`content/projects/${project.slug}.mdx: unknown related project "${slug}"`);
    }
  }
}

export const projectsFor = (slug: DisciplineSlug) => projects.filter((p) => p.discipline === slug);

/* The first featured project from each discipline, in the disciplines' order. */
export const featuredProjects = disciplineSlugs
  .map((slug) => projectsFor(slug).find((p) => p.featured))
  .filter((p): p is Project => Boolean(p));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/* The project's own picks, topped up from its discipline. */
export function relatedProjects(project: Project, count = 3) {
  const picks = project.related.map((slug) => getProject(slug)!);
  const fill = projectsFor(project.discipline).filter((p) => p !== project && !picks.includes(p));
  return [...picks, ...fill].slice(0, count);
}

export const projectHref = (slug: string) => `/projects/${slug}/`;
