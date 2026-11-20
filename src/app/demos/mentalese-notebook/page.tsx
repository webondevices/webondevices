import type { Metadata } from "next";
import { Caveat, Kalam } from "next/font/google";
import notebook from "../../../../content/demos/mentalese-notebook.json";
import styles from "./notebook.module.css";
import { Sheet, type Entry } from "./Sheet";

/*
 * Ada's notebook: everything the Mentalese brain wrote on its first live day, as it wrote it.
 * The data is copied from the brain by scripts/export-mentalese-notebook.ts.
 */

const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat" });
const kalam = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-kalam" });

const ARTICLE = "/projects/mentalese-live/";
const LIVE = "https://www.youtube.com/watch?v=mcm6hNGhJr4";

export const metadata: Metadata = {
  title: "Ada's notebook",
  description:
    "Every note, story draft and journal entry an AI mind wrote on its first day running live, exactly as it wrote them.",
};

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(new Date(iso));

/* A document is a first draft and every rewrite of it, oldest first. */
type Doc = { versions: Entry[] };

/* Newest first: a document counts as new as its latest version. */
function documents(entries: Entry[]): Doc[] {
  const docOf = new Map<string, Doc>();
  const docs: Doc[] = [];
  for (const entry of entries) {
    const doc = (entry.revises && docOf.get(entry.revises)) || { versions: [] };
    if (!doc.versions.length) docs.push(doc);
    doc.versions.push(entry);
    docOf.set(entry.id, doc);
  }
  const latest = (d: Doc) => d.versions.at(-1)!;
  /* Several pages can share a minute; the order she saved them breaks the tie. */
  const order = (d: Doc) => entries.indexOf(latest(d));
  return docs.sort((a, b) => latest(b).created.localeCompare(latest(a).created) || order(b) - order(a));
}

export default function NotebookPage() {
  const { exportedAt } = notebook;
  const entries: Entry[] = notebook.entries;
  const docs = documents(entries);
  const journals = entries.filter((e) => e.kind === "journal").length;
  const words = docs.reduce((sum, d) => sum + d.versions.at(-1)!.words, 0);

  return (
    <div className={`${styles.desk} ${caveat.variable} ${kalam.variable}`}>
      <header className={styles.intro}>
        <a className={styles.back} href={ARTICLE}>
          ← About the project
        </a>
        <h1>Ada&rsquo;s notebook</h1>
        <p className={styles.lede}>
          Ada is an artificial mind that keeps thinking when nobody&rsquo;s talking to her. This morning she
          woke up for the first time on a live stream, and when nobody came to chat she started writing. These
          are her pages, newest first, word for word. Where she rewrote a piece you see the latest version,
          and the V buttons swap in the drafts that came before it.
        </p>
        <p className={styles.stats}>
          {docs.length - journals} pieces · {entries.length - journals} drafts in all · {journals} journal{" "}
          {journals === 1 ? "entry" : "entries"} · {words.toLocaleString("en-GB")} words · copied{" "}
          {when(exportedAt)}
        </p>
        <a className={styles.live} href={LIVE} target="_blank" rel="noopener">
          <span className={styles.dot} aria-hidden /> Watch her think, live on YouTube
        </a>
      </header>

      <main className={styles.pile}>
        {docs.map((doc, i) => (
          <Sheet key={doc.versions[0].id} versions={doc.versions} index={i} />
        ))}
      </main>

      <footer className={styles.foot}>
        <a href={ARTICLE}>How Ada works</a> · <a href={LIVE}>The live stream</a>
      </footer>
    </div>
  );
}
