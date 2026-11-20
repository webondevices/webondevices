/*
 * Copies what Ada (the Mentalese brain) has written into content/demos/mentalese-notebook.json,
 * for the notebook demo at /demos/mentalese-notebook/.
 *
 *   node scripts/export-mentalese-notebook.ts ../../POC_apps/brain/data-live
 *
 * Reads the brain's data folder only: works/*.md (her notes and drafts) and the journal
 * memories in brain.db, opened read-only so a running brain is left alone. Re-run it to pick
 * up whatever she has written since.
 */

import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

type Entry = {
  kind: "work" | "journal";
  id: string;
  title: string;
  created: string;
  modified: string;
  words: number;
  revises: string | null;
  feeling: string | null;
  text: string;
};

const dataDir = path.resolve(process.argv[2] ?? "");
const worksDir = path.join(dataDir, "works");
const dbFile = path.join(dataDir, "brain.db");
if (!process.argv[2] || !fs.existsSync(worksDir)) {
  console.error("usage: node scripts/export-mentalese-notebook.ts <brain data folder>");
  process.exit(1);
}

/* `*w9 · 647 words · 2026-11-20 09:50 · a new version of w8*` (the time is UTC) */
const metaLine = /^\*(\w+) · (\d+) words · (\d{4}-\d\d-\d\d \d\d:\d\d)(?: · a new version of (\w+))?\*$/;

const works: Entry[] = fs
  .readdirSync(worksDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const full = path.join(worksDir, file);
    const [heading, , meta, , ...rest] = fs.readFileSync(full, "utf8").split("\n");
    const m = meta?.match(metaLine);
    if (!heading?.startsWith("# ") || !m) throw new Error(`works/${file}: unexpected layout`);
    return {
      kind: "work",
      id: m[1],
      title: heading.slice(2).trim(),
      created: new Date(`${m[3].replace(" ", "T")}:00Z`).toISOString(),
      modified: fs.statSync(full).mtime.toISOString(),
      words: Number(m[2]),
      revises: m[4] ?? null,
      feeling: null,
      text: rest.join("\n").trim(),
    };
  });

const db = new DatabaseSync(dbFile, { readOnly: true });
const journals: Entry[] = (
  db.prepare("SELECT record FROM memories WHERE kind = 'journal' ORDER BY created_at").all() as { record: string }[]
).map(({ record }) => {
  const r = JSON.parse(record);
  const at = new Date(r.createdAt).toISOString();
  return {
    kind: "journal",
    id: r.id,
    title: "Journal",
    created: at,
    modified: at,
    words: String(r.content).split(/\s+/).filter(Boolean).length,
    revises: null,
    feeling: r.emotion?.label ?? null,
    text: String(r.content).trim(),
  };
});
db.close();

const n = (id: string) => Number(id.replace(/\D/g, ""));
const entries = [...works, ...journals].sort(
  (a, b) => a.created.localeCompare(b.created) || n(a.id) - n(b.id),
);
const out = path.join(import.meta.dirname, "../content/demos/mentalese-notebook.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ exportedAt: new Date().toISOString(), entries }, null, 2) + "\n");
console.log(`${works.length} works and ${journals.length} journal entries → ${path.relative(process.cwd(), out)}`);
