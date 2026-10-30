"use client";

import { useCssVariable } from "@/lib/theme";
import styles from "../brand.module.css";

export function Swatch({ token, label }: { token: string; label?: string }) {
  const value = useCssVariable(token);

  return (
    <figure className={styles.swatch}>
      <div className={styles.swatchChip} style={{ background: `var(${token})` }} />
      <figcaption>
        <span className={styles.swatchName}>{label ?? token.replace(/^--(brand|color)-/, "")}</span>
        <code className={styles.swatchValue}>{token}</code>
        <code className={styles.swatchValue}>{value || " "}</code>
      </figcaption>
    </figure>
  );
}
