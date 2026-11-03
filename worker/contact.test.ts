import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEmail, parseSubmission, verifyTurnstile, type Enquiry } from "./contact.ts";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  topics: ["AI & Automation"],
  message: "I'd like a prototype built.",
  website: "",
  turnstileToken: "token",
};

test("accepts a valid submission and trims it", () => {
  const parsed = parseSubmission({ ...valid, name: "  Ada Lovelace  " });
  assert.equal(parsed.kind, "enquiry");
  if (parsed.kind !== "enquiry") return;
  assert.equal(parsed.enquiry.name, "Ada Lovelace");
  assert.equal(parsed.token, "token");
});

test("treats a filled honeypot as spam", () => {
  assert.deepEqual(parseSubmission({ ...valid, website: "https://spam.example" }), { kind: "spam" });
});

test("lists every invalid field", () => {
  const parsed = parseSubmission({ ...valid, name: "", email: "not-an-email", message: "short" });
  assert.deepEqual(parsed, { kind: "invalid", fields: ["name", "email", "message"] });
});

test("rejects oversized fields and non-object bodies", () => {
  assert.deepEqual(parseSubmission({ ...valid, message: "x".repeat(5001) }), {
    kind: "invalid",
    fields: ["message"],
  });
  assert.equal(parseSubmission(null).kind, "invalid");
  assert.equal(parseSubmission("hello").kind, "invalid");
});

test("rejects email addresses that could smuggle header text", () => {
  for (const email of ["a@b.com\r\nBcc: x@y.com", "a b@c.com", "<a@b.com>"]) {
    assert.equal(parseSubmission({ ...valid, email }).kind, "invalid", email);
  }
});

test("verifyTurnstile posts the secret, token and IP and reads success", async () => {
  let sent: FormData | undefined;
  const fetcher = (async (_url: string, init: RequestInit) => {
    sent = init.body as FormData;
    return Response.json({ success: true });
  }) as typeof fetch;

  assert.equal(await verifyTurnstile("tok", "secret", "1.2.3.4", fetcher), true);
  assert.equal(sent?.get("secret"), "secret");
  assert.equal(sent?.get("response"), "tok");
  assert.equal(sent?.get("remoteip"), "1.2.3.4");
});

test("verifyTurnstile fails closed", async () => {
  const failing = (async () => Response.json({ success: false })) as unknown as typeof fetch;
  const broken = (async () => {
    throw new Error("network");
  }) as unknown as typeof fetch;
  assert.equal(await verifyTurnstile("tok", "secret", null, failing), false);
  assert.equal(await verifyTurnstile("tok", "secret", null, broken), false);
  assert.equal(await verifyTurnstile("", "secret", null, failing), false);
});

test("buildEmail sets Reply-To to the visitor and encodes their text", () => {
  const enquiry: Enquiry = {
    name: "Zoë\r\nBcc: evil@example.com",
    email: "zoe@example.com",
    company: "",
    topics: [],
    message: "Héllo 👋, can we talk?",
  };
  const raw = buildEmail(enquiry, {
    from: "contact@webondevices.com",
    to: "me@example.com",
    date: new Date("2026-11-03T12:00:00Z"),
    id: "abc",
  });
  const [head, body] = raw.split("\r\n\r\n");

  assert.ok(!/^Bcc:/im.test(head), "visitor text must not create headers");
  assert.match(head, /^Reply-To: =\?UTF-8\?B\?[A-Za-z0-9+/=]+\?= <zoe@example\.com>$/m);
  assert.match(head, /^Message-ID: <abc@webondevices\.com>$/m);
  assert.match(head, /^To: <me@example\.com>$/m);

  const decoded = new TextDecoder().decode(
    Uint8Array.from(atob(body.replace(/\r\n/g, "")), (c) => c.charCodeAt(0)),
  );
  assert.match(decoded, /Héllo 👋, can we talk\?/);
  assert.match(decoded, /Email: zoe@example\.com/);
});
