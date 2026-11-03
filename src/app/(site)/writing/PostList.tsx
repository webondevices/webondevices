"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Typography } from "@/components/Typography/Typography";
import { tagLabel } from "@/content/writingTags";
import styles from "./writing.module.css";

type Item = { href: string; title: string; date: string; summary: string; tags: string[] };

type Props = { items: Item[]; tags: string[]; filterable?: boolean };

/* The list of posts, filtered by ?tag= (old /tags/* pages redirect here). */
export function PostList({ items, tags, filterable = false }: Props) {
  return filterable ? <Filtered items={items} tags={tags} /> : <List items={items} tags={tags} />;
}

function Filtered({ items, tags }: Omit<Props, "filterable">) {
  const tag = useSearchParams().get("tag");
  const active = tag && tags.includes(tag) ? tag : null;
  return <List items={items} tags={tags} active={active} />;
}

function List({ items, tags, active = null }: Omit<Props, "filterable"> & { active?: string | null }) {
  const shown = active ? items.filter((item) => item.tags.includes(active)) : items;

  return (
    <>
      <nav className={styles.tags} aria-label="Filter by topic">
        <Link href="/writing/" className={styles.tagChip} aria-current={!active ? "page" : undefined}>
          All
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/writing/?tag=${t}`}
            className={styles.tagChip}
            aria-current={active === t ? "page" : undefined}
          >
            {tagLabel(t)}
          </Link>
        ))}
      </nav>

      <ul className={styles.posts}>
        {shown.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.post}>
              <Typography variant="body-sm" tone="subtle" as="span">
                {item.date}
              </Typography>
              <Typography variant="heading-3" as="span" className={styles.postTitle}>
                {item.title}
              </Typography>
              <Typography variant="body" tone="muted" as="span">
                {item.summary}
              </Typography>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
