"use client";

import { useState, type ReactNode } from "react";
import styles from "./notebook.module.css";

/* One piece of Ada's writing, or one journal entry, as it appears in content/demos/mentalese-notebook.json. */
export type Entry = {
  kind: string;
  id: string;
  title: string;
  created: string;
  modified: string;
  words: number;
  revises: string | null;
  feeling: string | null;
  text: string;
};

const papers = ["legal", "ruled", "grid", "cream"] as const;

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(new Date(iso));

/* The works are plain prose: paragraphs, with the odd *italic* or **bold**. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : part.startsWith("*") && part.length > 2 ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
}

/**
 * A sheet of paper holding one document: its latest version, with V1, V2… buttons to swap in an
 * earlier draft. `versions` is oldest first.
 */
export function Sheet({ versions, index }: { versions: Entry[]; index: number }) {
  const [shown, setShown] = useState(versions.length - 1);
  const entry = versions[shown];
  const journal = entry.kind === "journal";
  const paper = journal ? "journal" : papers[index % papers.length];

  return (
    <article id={versions.at(-1)!.id} className={`${styles.sheet} ${styles[paper]}`} data-tilt={index % 3}>
      <header className={styles.head}>
        <p className={styles.tag}>{journal ? "Journal" : entry.id}</p>
        {!journal && <h2 className={styles.title}>{entry.title}</h2>}
        <dl className={styles.meta}>
          <div>
            <dt>Written</dt>
            <dd>
              <time dateTime={versions[0].created}>{when(versions[0].created)}</time>
            </dd>
          </div>
          <div>
            <dt>Modified</dt>
            <dd>
              <time dateTime={entry.modified}>{when(entry.modified)}</time>
            </dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{entry.words} words</dd>
          </div>
          {entry.feeling && (
            <div>
              <dt>Feeling</dt>
              <dd>{entry.feeling}</dd>
            </div>
          )}
        </dl>
        {versions.length > 1 && (
          <div className={styles.versions} role="group" aria-label="Versions">
            {versions.map((v, i) => (
              <button
                key={v.id}
                type="button"
                className={styles.version}
                aria-pressed={i === shown}
                title={`${v.id} · ${when(v.created)}${i === versions.length - 1 ? " · latest" : ""}`}
                onClick={() => setShown(i)}
              >
                V{i + 1}
              </button>
            ))}
          </div>
        )}
      </header>
      <div className={styles.body}>
        {entry.text
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p, i) => (
            <p key={i}>{inline(p)}</p>
          ))}
      </div>
    </article>
  );
}
