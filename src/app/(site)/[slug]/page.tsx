import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { CtaBand } from "@/components/CtaBand/CtaBand";
import { Mdx } from "@/components/Mdx/Mdx";
import { Typography } from "@/components/Typography/Typography";
import { projectHref } from "@/content/projects";
import { formatPostDate, getPost, morePosts, postHref, posts } from "@/content/writing";
import { tagLabel } from "@/content/writingTags";
import styles from "./post.module.css";

/*
 * Posts from the old blog, at their original top-level URLs. Static routes
 * (/projects, /expertise, /writing…) win over this one, and no post slug
 * collides with them.
 */

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: postHref(post.slug) },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const more = morePosts(post);

  return (
    <article>
      {/* Readers mostly arrive here from old links, so say what this is and where to go next. */}
      <aside className={styles.banner} aria-label="About this article">
        <div className={`${styles.container} ${styles.bannerInner}`}>
          <Typography variant="body-sm">
            <strong>From the Web on Devices archive.</strong> Written in {post.date.slice(0, 4)} and
            kept for reference, so some code and links may have aged.
          </Typography>
          <div className={styles.bannerLinks}>
            <Button variant="text" size="sm" icon="arrow-right" href="/#projects">
              Current projects
            </Button>
            <Button
              variant="text"
              size="sm"
              icon="arrow-right"
              href={projectHref("books-and-publications")}
            >
              The book
            </Button>
          </div>
        </div>
      </aside>

      <header className={`${styles.container} ${styles.header}`}>
        <Typography variant="eyebrow" rule>
          <Link href="/writing/">Writing</Link>
        </Typography>
        <Typography variant="heading-1" as="h1" className={styles.title}>
          {post.title}
        </Typography>
        <Typography variant="body-sm" tone="subtle">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          {post.tags.length > 0 && (
            <>
              {" · "}
              {post.tags.map((tag, i) => (
                <span key={tag}>
                  {i > 0 && ", "}
                  <Link href={`/writing/?tag=${tag}`} className={styles.tag}>
                    {tagLabel(tag)}
                  </Link>
                </span>
              ))}
            </>
          )}
        </Typography>
      </header>

      <div className={`${styles.container} ${styles.body}`}>
        <Mdx source={post.body} captions={false} />
      </div>

      {more.length > 0 && (
        <section className={`${styles.container} ${styles.more}`} aria-labelledby="more-title">
          <div className={styles.moreHeader}>
            <Typography variant="eyebrow" rule as="h2" id="more-title">
              Keep reading
            </Typography>
            <Button variant="text" icon="arrow-right" href="/writing/">
              All writing
            </Button>
          </div>
          <ul className={styles.moreList}>
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={postHref(p.slug)} className={styles.moreLink}>
                  <Typography variant="heading-4" as="span">
                    {p.title}
                  </Typography>
                  <Typography variant="body-sm" tone="subtle" as="span">
                    {formatPostDate(p.date)}
                  </Typography>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand />
    </article>
  );
}
