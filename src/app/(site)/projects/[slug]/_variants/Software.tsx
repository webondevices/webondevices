import type { CSSProperties } from "react";
import { Typography } from "@/components/Typography/Typography";
import type { SoftwareDetails } from "@/content/projects";
import shared from "./hero.module.css";
import styles from "./software.module.css";

/* The architecture as stacked layers, then the stack grouped by job. */
export function SoftwareSignature({ details }: { details: SoftwareDetails }) {
  return (
    <section className={styles.signature} aria-labelledby="architecture-title">
      <div className={shared.container}>
        <div className={shared.sectionTitle}>
          <Typography variant="eyebrow" rule>
            Under the hood
          </Typography>
          <Typography variant="display" as="h2" id="architecture-title">
            Architecture
          </Typography>
        </div>

        <ol className={styles.layers}>
          {details.layers.map((layer, index) => (
            <li
              key={layer.title}
              className={styles.layer}
              style={{ "--depth": index } as CSSProperties}
            >
              <span className={styles.layerIndex} aria-hidden>
                L{index + 1}
              </span>
              <Typography variant="heading-4" as="h3">
                {layer.title}
              </Typography>
              <Typography variant="body-sm" tone="muted">
                {layer.text}
              </Typography>
            </li>
          ))}
        </ol>

        <div className={styles.stack}>
          <Typography variant="eyebrow" rule as="h3">
            Stack
          </Typography>
          <dl className={styles.stackGroups}>
            {details.stack.map((group) => (
              <div key={group.group} className={styles.stackGroup}>
                <dt>
                  <Typography variant="body-sm" as="span" tone="muted">
                    {group.group}
                  </Typography>
                </dt>
                <dd>
                  <ul className={styles.chips}>
                    {group.items.map((item) => (
                      <li key={item} className={styles.chip}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
