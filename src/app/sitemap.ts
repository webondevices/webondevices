import type { MetadataRoute } from "next";
import { disciplineHref, disciplineSlugs } from "@/content/disciplines";
import { projectHref, projects } from "@/content/projects";
import { postHref, posts } from "@/content/writing";

export const dynamic = "force-static";

const SITE = "https://www.webondevices.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, priority: 1 },
    ...disciplineSlugs.map((slug) => ({ url: `${SITE}${disciplineHref(slug)}`, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${SITE}${projectHref(p.slug)}`, priority: 0.7 })),
    { url: `${SITE}/writing/`, priority: 0.4 },
    ...posts.map((p) => ({ url: `${SITE}${postHref(p.slug)}`, lastModified: p.date, priority: 0.3 })),
  ];
}
