import { Fragment } from "react";
import { Icon } from "@/components/Icon/Icon";
import { Typography } from "@/components/Typography/Typography";
import type { HardwareDetails } from "@/content/projects";
import shared from "./hero.module.css";
import styles from "./hardware.module.css";

/* A spec sheet, then the system as a chain from sensor to screen. */
export function HardwareSignature({ details }: { details: HardwareDetails }) {
  return (
    <>
      <section className={styles.signature} aria-labelledby="specs-title">
        <div className={`${shared.container} ${styles.split}`}>
          <div className={shared.sectionTitle}>
            <Typography variant="eyebrow" rule>
              Inside the build
            </Typography>
            <Typography variant="display" as="h2" id="specs-title">
              Spec sheet
            </Typography>
          </div>
          <dl className={styles.specs}>
            {details.specs.map((spec, index) => (
              <div key={spec.label} className={styles.spec}>
                <dt>
                  <span className={styles.specNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <Typography variant="body-sm" as="span" tone="muted">
                    {spec.label}
                  </Typography>
                </dt>
                <dd>
                  <Typography variant="body" as="span">
                    {spec.value}
                  </Typography>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={shared.section} aria-labelledby="system-title">
        <div className={shared.container}>
          <div className={shared.sectionTitle}>
            <Typography variant="eyebrow" rule>
              How it works
            </Typography>
            <Typography variant="display" as="h2" id="system-title">
              The system
            </Typography>
          </div>
          <ol className={styles.system}>
            {details.system.map((step, index) => (
              <Fragment key={step.title}>
                {index > 0 && (
                  <li className={styles.connector} aria-hidden>
                    <Icon name="arrow-right" />
                  </li>
                )}
                <li className={styles.module}>
                  <span className={styles.moduleLabel}>
                    {String(index + 1).padStart(2, "0")} / {step.title.toUpperCase()}
                  </span>
                  <Typography variant="heading-4" as="h3">
                    {step.title}
                  </Typography>
                  <Typography variant="body-sm" tone="muted">
                    {step.text}
                  </Typography>
                </li>
              </Fragment>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
