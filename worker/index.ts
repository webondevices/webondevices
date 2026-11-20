/*
 * The site's one Worker. Static files in `out/` are served by the assets layer
 * before this code runs; only `/api/*` reaches it (see `run_worker_first` in
 * wrangler.jsonc).
 */

import { EmailMessage } from "cloudflare:email";
import { buildEmail, parseSubmission, verifyTurnstile } from "./contact.ts";

const MAX_BODY_BYTES = 20_000;

const json = (body: unknown, status = 200) => Response.json(body, { status });

async function contact(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    return json({ error: "unsupported_media_type" }, 415);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = parseSubmission(body);
  // Bots that fill the honeypot get the same answer as people, so they don't adapt.
  if (parsed.kind === "spam") return json({ ok: true });
  if (parsed.kind === "invalid") return json({ error: "invalid", fields: parsed.fields }, 400);

  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("TURNSTILE_SECRET_KEY is not set; refusing to send.");
    return json({ error: "not_configured" }, 500);
  }
  const human = await verifyTurnstile(
    parsed.token,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get("CF-Connecting-IP"),
  );
  if (!human) return json({ error: "turnstile_failed" }, 403);

  const email = buildEmail(parsed.enquiry, { from: env.CONTACT_FROM, to: env.CONTACT_TO });
  try {
    await env.SEND_EMAIL.send(new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, email));
  } catch (error) {
    console.error("send_email failed", error);
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true });
}

/* Ada's live log, put in KV by scripts/publish-ada-logs.ts. Browsers re-ask every couple of minutes. */
async function adaLogs(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return json({ error: "method_not_allowed" }, 405);
  const body = await env.ADA_LOGS.get("latest");
  if (!body) return json({ error: "not_published" }, 404);
  return new Response(body, {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=30" },
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact" || pathname === "/api/contact/") return contact(request, env);
    if (pathname === "/api/ada-logs" || pathname === "/api/ada-logs/") return adaLogs(request, env);
    if (pathname.startsWith("/api/")) return json({ error: "not_found" }, 404);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
