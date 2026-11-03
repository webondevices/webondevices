/*
 * Every URL the old site served must still work after a build: either as a page
 * in out/ or as a redirect in public/_redirects. Also checks that every local
 * image or download the migrated posts point at exists in public/.
 *
 * Run after `next build`: npm run test:urls
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.join(import.meta.dirname, "..");

/* The old Gatsby site's pages, listed from its build (docs/) before that was removed. */
function oldUrls() {
  return fs
    .readFileSync(path.join(root, "scripts/old-urls.txt"), "utf8")
    .split("\n")
    .filter(Boolean);
}

function redirectPatterns() {
  return fs
    .readFileSync(path.join(root, "public/_redirects"), "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const source = line.trim().split(/\s+/)[0];
      const pattern = source
        .replace(/[.+?^$()[\]{}|\\]/g, "\\$&")
        .replace(/:\w+/g, "[^/]+")
        .replace(/\*/g, ".*");
      return new RegExp(`^${pattern}$`);
    });
}

test("every old URL is a page or a redirect", () => {
  assert.ok(fs.existsSync(path.join(root, "out")), "run `next build` first");
  const redirects = redirectPatterns();
  const missing = oldUrls().filter(
    (url) =>
      !fs.existsSync(path.join(root, "out", url, "index.html")) &&
      !redirects.some((pattern) => pattern.test(url)),
  );
  assert.deepEqual(missing, [], `old URLs with no page or redirect:\n${missing.join("\n")}`);
});

test("local images and downloads in posts exist", () => {
  const dir = path.join(root, "content/writing");
  const missing: string[] = [];
  for (const file of fs.readdirSync(dir)) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    for (const [, ref] of text.matchAll(/(?:\]\(|cover: )(\/(?:posts|download|media)\/[^)\s#?]+)/g)) {
      if (!fs.existsSync(path.join(root, "public", decodeURI(ref)))) missing.push(`${file}: ${ref}`);
    }
  }
  assert.deepEqual(missing, [], `missing files:\n${missing.join("\n")}`);
});
