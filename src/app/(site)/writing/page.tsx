import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand } from "@/components/CtaBand/CtaBand";
import { Typography } from "@/components/Typography/Typography";
import { formatPostDate, listedPosts, postHref, writingTags } from "@/content/writing";
import { PostList } from "./PostList";
import styles from "./writing.module.css";

/* The low-key archive index. Linked from the footer only, not the main nav. */

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Articles from the Web on Devices archive (2015–2018): Arduino, Node.js, JavaScript hardware APIs and connected-device projects.",
  alternates: { canonical: "/writing/" },
};

export default function WritingPage() {
  const items = listedPosts.map((p) => ({
    href: postHref(p.slug),
    title: p.title,
    date: formatPostDate(p.date),
    summary: p.summary,
    tags: p.tags,
  }));

  return (
    <>
      <header className={`${styles.container} ${styles.header}`}>
        <Typography variant="eyebrow" rule>
          Archive
        </Typography>
        <Typography variant="display" as="h1">
          Writing
        </Typography>
        <Typography variant="body-lg" tone="muted" className={styles.intro}>
          Tutorials and project write-ups from the original Web on Devices blog, 2015 to 2018.
          Arduino, Node.js and the browser&apos;s hardware APIs. Kept online for the people who
          still find them useful.
        </Typography>
      </header>

      <div className={`${styles.container} ${styles.list}`}>
        {/* The tag filter reads ?tag= in the browser. Without JS, or before it loads, every post shows. */}
        <Suspense fallback={<PostList items={items} tags={writingTags} />}>
          <PostList items={items} tags={writingTags} filterable />
        </Suspense>
      </div>

      <CtaBand />
    </>
  );
}
