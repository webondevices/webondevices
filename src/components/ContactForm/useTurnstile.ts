"use client";

import { useCallback, useRef } from "react";

/*
 * Cloudflare Turnstile, rendered explicitly so it survives client-side navigation.
 * The site key is public and baked in at build time. Without one (plain `next dev`)
 * the widget is skipped, and the Worker will reject the submission.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  getResponse: (widgetId: string) => string | undefined;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let loader: Promise<Turnstile> | undefined;

function loadTurnstile() {
  loader ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject());
    script.onerror = () => {
      loader = undefined; // Let the next mount try again.
      reject(new Error("Turnstile failed to load"));
    };
    document.head.append(script);
  });
  return loader;
}

export function useTurnstile() {
  const widget = useRef<string | null>(null);

  // Callback ref: renders when the form mounts and cleans up when it unmounts.
  const container = useCallback((element: HTMLDivElement | null) => {
    if (!element || !SITE_KEY) return;
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return;
        widget.current = turnstile.render(element, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          theme: "auto",
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, []);

  const token = useCallback(
    () => (widget.current && window.turnstile?.getResponse(widget.current)) || "",
    [],
  );

  // Tokens are single use, so get a fresh one after every attempt.
  const reset = useCallback(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, []);

  return { container, token, reset, enabled: Boolean(SITE_KEY) };
}
