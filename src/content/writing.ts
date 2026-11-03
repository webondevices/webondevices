import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/*
 * The writing archive: posts from the old Web on Devices blog (2015–2018).
 * Each keeps its original URL, /<slug>/, so old links and search results still
 * land. They sit outside the main navigation; the footer links to /writing/.
 */

export type Post = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  tags: string[];
  cover?: string;
  /** False for posts the old site kept off its list (duplicates). */
  listed: boolean;
  /** Plain-text opening, for meta descriptions, cards and the RSS feed. */
  summary: string;
  /** The post, as MDX. */
  body: string;
};

/* Loading: every content/writing/<slug>.mdx file is a post. */

const writingDir = path.join(process.cwd(), "content/writing");

const frontmatter = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  listed: z.boolean().default(true),
});

/* The first paragraph of prose, without markdown, cut to a meta-description length. */
function summarise(body: string, max = 160) {
  const paragraph =
    body
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !/^(<|!\[|#|```|\|)/.test(block)) ?? "";
  const text = paragraph
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\\([{}])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : text;
}

function loadPost(file: string): Post {
  const slug = path.basename(file, ".mdx");
  const { data, content } = matter(fs.readFileSync(path.join(writingDir, file), "utf8"));
  const parsed = frontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(`content/writing/${file}: ${z.prettifyError(parsed.error)}`);
  }
  return { ...parsed.data, slug, summary: summarise(content), body: content };
}

export const posts: Post[] = fs
  .readdirSync(writingDir)
  .filter((file) => file.endsWith(".mdx"))
  .map(loadPost)
  .sort((a, b) => b.date.localeCompare(a.date));

export const listedPosts = posts.filter((p) => p.listed);

export const writingTags = [...new Set(listedPosts.flatMap((p) => p.tags))].sort();

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const postHref = (slug: string) => `/${slug}/`;

export const formatPostDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/* Older posts first after this one, wrapping round: a short "keep reading" list. */
export function morePosts(post: Post, count = 3) {
  const others = listedPosts.filter((p) => p.slug !== post.slug);
  const start = others.findIndex((p) => p.date < post.date);
  const from = start === -1 ? 0 : start;
  return [...others.slice(from), ...others.slice(0, from)].slice(0, count);
}
