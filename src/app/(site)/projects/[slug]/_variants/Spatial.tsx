import { Icon } from "@/components/Icon/Icon";
import { ProjectMedia } from "@/components/ProjectMedia/ProjectMedia";
import { Typography } from "@/components/Typography/Typography";
import type { Project, SpatialDetails } from "@/content/projects";
import { HeroText } from "./HeroText";
import shared from "./hero.module.css";
import styles from "./spatial.module.css";

type SpatialProject = Extract<Project, { discipline: "spatial-experiences" }>;

/*
 * Spatial: the scene is the hero. A dark, full-width stage framed like a 3D
 * viewer, with the title laid over it. The 3D embed will replace the artwork.
 */
export function SpatialHero({ project }: { project: SpatialProject }) {
  return (
    <section className={styles.hero} aria-labelledby="project-title">
      <div className={shared.container}>
        <div className={styles.stage} data-theme="dark">
          <ProjectMedia project={project} className={styles.scene} />
          <span className={styles.corners} aria-hidden />
          {!project.hero && (
            <span className={styles.viewerLabel}>
              <Icon name="play" />
              <Typography variant="caption" as="span">
                3D scene
              </Typography>
            </span>
          )}
          <div className={styles.stageText}>
            <HeroText project={project} />
          </div>
        </div>
      </div>
    </section>
  );
}

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
