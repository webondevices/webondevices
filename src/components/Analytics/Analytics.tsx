"use client";

import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/Button/Button";
import { Typography } from "@/components/Typography/Typography";
import { gaId, gtagInitScript, useConsent } from "@/lib/analytics";
import styles from "./Analytics.module.css";

/** Google Analytics 4 with Consent Mode, plus the banner that asks for consent. */
export function Analytics() {
  if (!gaId) return null;

  return (
    <>
      <Script id="gtag-init" strategy="afterInteractive">
        {gtagInitScript}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <ConsentBanner />
    </>
  );
}

function ConsentBanner() {
  const { consent, setConsent } = useConsent();
  if (consent !== null) return null;

  return (
    <section className={styles.banner} aria-label="Analytics cookies" data-theme="dark">
      <Typography variant="body-sm">
        Can I use Google Analytics cookies to see which pages people read? Nothing is used for ads.{" "}
        <Link href="/privacy/">Privacy</Link>
      </Typography>
      <div className={styles.actions}>
        <Button size="sm" variant="secondary" onClick={() => setConsent("denied")}>
          Decline
        </Button>
        <Button size="sm" onClick={() => setConsent("granted")}>
          Accept
        </Button>
      </div>
    </section>
  );
}

/** Clears the choice, so the banner asks again. Used in the footer and on /privacy. */
export function ConsentSettingsButton({ label = "Cookie settings" }: { label?: string }) {
  const { setConsent } = useConsent();
  if (!gaId) return null;

  return (
    <button type="button" className={styles.settings} onClick={() => setConsent(null)}>
      {label}
    </button>
  );
}
