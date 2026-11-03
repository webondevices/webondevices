"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Consent = "granted" | "denied";

/** Empty or unset means no Google tag at all (local dev, previews). */
export const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

const STORAGE_KEY = "wod-analytics-consent";

/**
 * Runs before gtag.js loads. Consent Mode v2: storage stays denied until the visitor accepts,
 * so a declined or undecided visit only sends cookieless pings. Inlined as a string.
 */
export const gtagInitScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var c="denied";try{if(localStorage.getItem("${STORAGE_KEY}")==="granted")c="granted";}catch(e){}gtag("consent","default",{analytics_storage:c,ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});gtag("js",new Date());gtag("config","${gaId}");`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/* Fallback when storage is blocked, so the banner still goes away for this page view. */
let unsavedConsent: Consent | null = null;

function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return unsavedConsent;
  }
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The visitor's analytics choice. `undefined` during SSR and hydration, so nothing that depends
 * on it renders into the static HTML; `null` once we know they haven't chosen yet.
 */
export function useConsent() {
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribe,
    readConsent,
    () => undefined,
  );

  const setConsent = useCallback((value: Consent | null) => {
    unsavedConsent = value;
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage blocked: unsavedConsent covers this page view.
    }
    window.gtag?.("consent", "update", { analytics_storage: value ?? "denied" });
    notify();
  }, []);

  return { consent, setConsent };
}
