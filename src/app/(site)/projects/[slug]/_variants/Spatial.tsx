import { Typography } from "@/components/Typography/Typography";
import type { SpatialDetails } from "@/content/projects";
import shared from "./hero.module.css";
import styles from "./spatial.module.css";

/* The capture in numbers, then the pipeline from scan to screen, on a dark band. */
export function SpatialSignature({ details }: { details: SpatialDetails }) {
  return (
    <section className={styles.signature} data-theme="dark" aria-labelledby="capture-title">
      <div className={shared.container}>
        <div className={shared.sectionTitle}>
          <Typography variant="eyebrow" rule>
            From capture to scene
          </Typography>
          <Typography variant="display" as="h2" id="capture-title">
            How it was made
          </Typography>
        </div>
        <dl className={styles.capture}>
          {details.capture.map((item) => (
            <div key={item.label} className={styles.captureItem}>
              <dt>
                <Typography variant="eyebrow" as="span" tone="subtle">
                  {item.label}
                </Typography>
              </dt>
              <dd>
                <Typography variant="heading-2" as="span">
                  {item.value}
                </Typography>
              </dd>
            </div>
          ))}
        </dl>
        <ol className={styles.pipeline}>
          {details.pipeline.map((step, index) => (
            <li key={step.title} className={styles.pipelineStep}>
              <span className={styles.node} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <Typography variant="heading-4" as="h3">
                {step.title}
              </Typography>
              <Typography variant="body-sm" tone="muted">
                {step.text}
              </Typography>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
