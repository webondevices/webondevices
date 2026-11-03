/*
 * The contact form's server side: validate the submission, check the Turnstile
 * token and build the email. Nothing here imports Workers-only modules, so it
 * runs under `node --test` as well.
 */

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  topics: string[];
  message: string;
};

export type Parsed =
  | { kind: "enquiry"; enquiry: Enquiry; token: string }
  | { kind: "spam" }
  | { kind: "invalid"; fields: string[] };

const limits = { name: 200, email: 254, company: 200, message: 5000, topic: 60, topics: 10 };
const EMAIL = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]+$/;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function parseSubmission(body: unknown): Parsed {
  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  // Honeypot: the field is hidden from people, so anything in it came from a bot.
  if (text(input.website)) return { kind: "spam" };

  const enquiry: Enquiry = {
    name: text(input.name),
    email: text(input.email),
    company: text(input.company),
    topics: Array.isArray(input.topics) ? input.topics.map(text).filter(Boolean) : [],
    message: text(input.message),
  };

  const fields: string[] = [];
  if (!enquiry.name || enquiry.name.length > limits.name) fields.push("name");
  if (enquiry.email.length > limits.email || !EMAIL.test(enquiry.email)) fields.push("email");
  if (enquiry.company.length > limits.company) fields.push("company");
  if (
    enquiry.topics.length > limits.topics ||
    enquiry.topics.some((topic) => topic.length > limits.topic)
  )
    fields.push("topics");
  if (enquiry.message.length < 10 || enquiry.message.length > limits.message) fields.push("message");

  if (fields.length) return { kind: "invalid", fields };
  return { kind: "enquiry", enquiry, token: text(input.turnstileToken) };
}

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string | null,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  if (!token) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const response = await fetcher(SITEVERIFY, { method: "POST", body: form });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

// Base64 of the UTF-8 bytes, which keeps accents and emoji intact in headers and body.
const base64 = (value: string) => {
  let binary = "";
  for (const byte of new TextEncoder().encode(value)) binary += String.fromCharCode(byte);
  return btoa(binary);
};

// RFC 2047 encoded word. Visitor text never reaches a header raw, so it can't add headers.
const encodeHeader = (value: string) => `=?UTF-8?B?${base64(value.replace(/[\r\n]+/g, " "))}?=`;

export function buildEmail(
  enquiry: Enquiry,
  { from, to, date = new Date(), id = crypto.randomUUID() }: { from: string; to: string; date?: Date; id?: string },
): string {
  const domain = from.split("@")[1];
  const body = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Company: ${enquiry.company || "—"}`,
    `Topics: ${enquiry.topics.join(", ") || "—"}`,
    "",
    enquiry.message,
    "",
    "—",
    "Sent from the contact form on webondevices.com. Reply to answer the visitor directly.",
  ].join("\n");

  return [
    `From: ${encodeHeader("Web on Devices contact form")} <${from}>`,
    `To: <${to}>`,
    `Reply-To: ${encodeHeader(enquiry.name)} <${enquiry.email}>`,
    `Subject: ${encodeHeader(`New enquiry from ${enquiry.name}`)}`,
    `Date: ${date.toUTCString()}`,
    `Message-ID: <${id}@${domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64(body).replace(/.{76}/g, "$&\r\n"),
  ].join("\r\n");
}
