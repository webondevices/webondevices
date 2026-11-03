import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ConsentSettingsButton } from "@/components/Analytics/Analytics";
import { Mdx } from "@/components/Mdx/Mdx";
import { Typography } from "@/components/Typography/Typography";
import styles from "./privacy.module.css";

/* Bump when the policy changes in substance. */
const updated = "2026-11-03";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What personal data webondevices.com collects, why, and how to change your choice.",
  alternates: { canonical: "/privacy/" },
};

export default async function PrivacyPage() {
  const source = fs.readFileSync(path.join(process.cwd(), "content/pages/privacy.mdx"), "utf8");

  return (
    <article>
      <header className={`${styles.container} ${styles.header}`}>
        <Typography variant="eyebrow" rule>
          Privacy
        </Typography>
        <Typography variant="heading-1" as="h1">
          Your data on this site
        </Typography>
        <Typography variant="body-sm" tone="subtle">
          Last updated <time dateTime={updated}>3 November 2026</time>
        </Typography>
      </header>

      <div className={`${styles.container} ${styles.body}`}>
        <Mdx source={source} />
        <Typography variant="body" className={styles.change}>
          <ConsentSettingsButton label="Change your analytics choice" />
        </Typography>
      </div>
    </article>
  );
}
