/*
 * Publishes Ada's stream of consciousness and chat to /demos/ada-logs/, every 2 minutes.
 *
 *   node scripts/publish-ada-logs.ts ../../POC_apps/brain/data-live [--once] [--local]
 *
 * Reads the brain's event log (events/events-YYYY-MM-DD.jsonl) without touching the running
 * brain, keeps the latest thoughts and chat messages, and uploads them as one JSON value, only
 * when something changed. Needs `wrangler login` (as the site's Cloudflare account). Ctrl-C stops it.
 *
 * It goes to the ADA_LOGS KV namespace (see wrangler.jsonc), which the Worker serves at
 * /api/ada-logs. KV's free tier allows 1,000 writes a day, hence every 2 minutes, not every one.
 * --once publishes once and exits; --local writes to `wrangler dev`'s local KV instead.
 */

import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { StringDecoder } from "node:string_decoder";
import { promisify } from "node:util";

const KEEP = 400;
const EVERY_MS = 120_000;
const KV_KEY = "latest";
const KV_NAMESPACE = "184d945bd7e54deebf4e7d6339a5f86d";

type Thought = { at: number; text: string; kind: string | null; feeling: string | null };
type Message = { at: number; from: string; to: string | null; text: string; ada: boolean };

const once = process.argv.includes("--once");
const local = process.argv.includes("--local");
const dataDir = path.resolve(process.argv[2] ?? "");
const eventsDir = path.join(dataDir, "events");
if (!process.argv[2] || !fs.existsSync(eventsDir)) {
  console.error("usage: node scripts/publish-ada-logs.ts <brain data folder>");
  process.exit(1);
}

const thoughts: Thought[] = [];
const chat: Message[] = [];
/* Who each reply in progress is addressed to, from speech.start, until its speech.end. */
const replyTo = new Map<string, string>();

const keepLatest = <T>(list: T[]) => list.splice(0, Math.max(0, list.length - KEEP));

function take(line: string) {
  if (!line.includes('"type":"thought"') && !line.includes('"type":"stimulus"') && !line.includes('"type":"speech.')) return;
  /* Only the fields read below; the brain's records carry many more. */
  type Data = {
    id?: string;
    text?: string;
    kind?: string;
    feeling?: { label?: string };
    modality?: string;
    content?: string;
    source?: string;
    to?: string;
    aborted?: boolean;
    error?: unknown;
  };
  let r: { at: number; type: string; data?: Data };
  try {
    r = JSON.parse(line);
  } catch {
    return;
  }
  const d = r.data ?? {};
  if (r.type === "thought" && d.text) {
    thoughts.push({ at: r.at, text: d.text, kind: d.kind ?? null, feeling: d.feeling?.label ?? null });
  } else if (r.type === "stimulus" && d.modality === "chat" && d.content) {
    chat.push({ at: r.at, from: d.source ?? "someone", to: null, text: d.content, ada: false });
  } else if (r.type === "speech.start" && d.id) {
    replyTo.set(d.id, d.to ?? "everyone");
  } else if (r.type === "speech.end" && d.text && !d.aborted && !d.error) {
    chat.push({ at: r.at, from: "Ada", to: replyTo.get(d.id ?? "") ?? null, text: d.text, ada: true });
    replyTo.delete(d.id ?? "");
  }
}

/* Read whatever was appended since last time; a new day starts a new file. */
let file = "";
let offset = 0;
let partial = "";
let decoder = new StringDecoder("utf8");

function latestLogFile() {
  const files = fs.readdirSync(eventsDir).filter((f) => /^events-\d{4}-\d\d-\d\d\.jsonl$/.test(f));
  return files.length ? path.join(eventsDir, files.sort().at(-1)!) : "";
}

function readNew() {
  const latest = latestLogFile();
  if (latest !== file) {
    file = latest;
    offset = 0;
    partial = "";
    decoder = new StringDecoder("utf8");
  }
  if (!file) return;
  const size = fs.statSync(file).size;
  if (size < offset) offset = 0;
  const fd = fs.openSync(file, "r");
  const chunk = Buffer.alloc(8 << 20);
  try {
    while (offset < size) {
      const n = fs.readSync(fd, chunk, 0, Math.min(chunk.length, size - offset), offset);
      if (!n) break;
      offset += n;
      const lines = (partial + decoder.write(chunk.subarray(0, n))).split("\n");
      partial = lines.pop() ?? "";
      lines.forEach(take);
    }
  } finally {
    fs.closeSync(fd);
  }
  keepLatest(thoughts);
  keepLatest(chat);
}

const run = promisify(execFile);
const wrangler = path.join(import.meta.dirname, "../node_modules/.bin/wrangler");
const tmp = path.join(os.tmpdir(), "ada-logs.json");
let lastSent = "";

async function publish() {
  readNew();
  const body = JSON.stringify({ thoughts, chat });
  if (body === lastSent) return console.log(`${new Date().toLocaleTimeString("en-GB")}  no change`);
  fs.writeFileSync(tmp, JSON.stringify({ updatedAt: Date.now(), thoughts, chat }));
  await run(
    wrangler,
    ["kv", "key", "put", KV_KEY, "--path", tmp, "--namespace-id", KV_NAMESPACE, local ? "--local" : "--remote"],
    { cwd: path.join(import.meta.dirname, "..") },
  );
  lastSent = body;
  console.log(
    `${new Date().toLocaleTimeString("en-GB")}  published ${thoughts.length} thoughts, ${chat.length} chat messages`,
  );
}

async function loop() {
  try {
    await publish();
  } catch (error) {
    console.error(`${new Date().toLocaleTimeString("en-GB")}  publish failed:`, (error as Error).message);
  }
  if (!once) setTimeout(loop, EVERY_MS);
}

loop();
