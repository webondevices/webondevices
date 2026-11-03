"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Icon } from "@/components/Icon/Icon";
import { Typography } from "@/components/Typography/Typography";
import { site } from "@/lib/site";
import styles from "./ContactForm.module.css";
import { useTurnstile } from "./useTurnstile";

/*
 * The site is a static export, so the Cloudflare Worker in `worker/` answers this
 * endpoint: it checks the Turnstile token and emails the enquiry. Wherever the
 * Worker isn't running (plain `next dev`), submitting shows the error state with
 * a direct email fallback.
 */
const ENDPOINT = "/api/contact";

const topics = [
  "Spatial Experiences",
  "Hardware & Electronics",
  "AI & Automation",
  "Software Engineering",
  "Not sure yet",
];

type Status = "idle" | "sending" | "sent" | "error" | "verifying";
type Field = "name" | "email" | "message";

const messages: Record<Field, string> = {
  name: "Please tell me your name.",
  email: "Please enter a valid email address.",
  message: "A sentence or two about the project helps me reply properly.",
};

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const { container: turnstileContainer, ...turnstile } = useTurnstile();

  const validate = (form: HTMLFormElement) => {
    const next: Partial<Record<Field, string>> = {};
    for (const field of Object.keys(messages) as Field[]) {
      const input = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
      if (!input.validity.valid) next[field] = messages[field];
    }
    setErrors(next);
    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = Object.keys(validate(form)) as Field[];
    if (invalid.length) {
      (form.elements.namedItem(invalid[0]) as HTMLElement).focus();
      return;
    }

    // Turnstile usually finishes before anyone gets this far; if not, ask for a moment.
    const turnstileToken = turnstile.token();
    if (turnstile.enabled && !turnstileToken) {
      setStatus("verifying");
      return;
    }

    const data = new FormData(form);
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          topics: data.getAll("topics"),
          message: data.get("message"),
          website: data.get("website"), // Honeypot: real people leave it empty.
          turnstileToken,
        }),
      });
      if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      turnstile.reset();
      setStatus("error");
    }
  };

  // Re-check a field as soon as the visitor fixes it.
  const onFieldInput = (field: Field, valid: boolean) => {
    if (errors[field] && valid) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  if (status === "sent") {
    return (
      <div className={styles.done} role="status">
        <span className={styles.doneIcon}>
          <Icon name="arrow-up-right" />
        </span>
        <Typography variant="heading-3" as="p">
          Thanks, your message is on its way.
        </Typography>
        <Typography variant="body">
          I usually reply within two working days. Speak soon.
        </Typography>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const fieldProps = (field: Field) => ({
    id: `${id}-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
    onInput: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onFieldInput(field, event.currentTarget.validity.valid),
  });

  const error = (field: Field) =>
    errors[field] && (
      <span id={`${id}-${field}-error`} className={styles.error}>
        {errors[field]}
      </span>
    );

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${id}-name`}>Name</label>
          <input type="text" autoComplete="name" required {...fieldProps("name")} />
          {error("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-email`}>Email</label>
          <input type="email" autoComplete="email" required {...fieldProps("email")} />
          {error("email")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-company`}>
          Company <span className={styles.optional}>(optional)</span>
        </label>
        <input id={`${id}-company`} name="company" type="text" autoComplete="organization" />
      </div>

      <fieldset className={styles.topics}>
        <legend>What can I help with?</legend>
        <div className={styles.chips}>
          {topics.map((topic) => (
            <label key={topic} className={styles.chip}>
              <input type="checkbox" name="topics" value={topic} />
              <span>{topic}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={`${id}-message`}>Tell me about the project</label>
        <textarea rows={5} required minLength={10} {...fieldProps("message")} />
        {error("message")}
      </div>

      <div className={styles.honeypot} aria-hidden>
        <label htmlFor={`${id}-website`}>Leave this empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Turnstile stays invisible unless it needs the visitor to tick a box. */}
      <div ref={turnstileContainer} />

      <div className={styles.footer}>
        <Button type="submit" icon="arrow-up-right" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
        <div aria-live="polite">
          {status === "error" && (
            <Typography variant="body-sm" className={styles.formError}>
              Sorry, that didn’t send. Please email me at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </Typography>
          )}
          {status === "verifying" && (
            <Typography variant="body-sm" className={styles.formError}>
              Still checking you’re not a bot. Please press Send again in a moment.
            </Typography>
          )}
        </div>
      </div>
    </form>
  );
}
