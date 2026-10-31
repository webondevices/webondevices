import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import { Typography } from "@/components/Typography/Typography";
import { disciplineHref, getDiscipline } from "@/content/disciplines";
import { projectStatusLabels, type Project } from "@/content/projects";
import styles from "./hero.module.css";

type HeroTextProps = {
  project: Project;
  /** Centre the text, for heroes without a side panel. */
  centered?: boolean;
};

/** The text every project hero shares: the way back, the title, the summary and the status. */
export function HeroText({ project, centered = false }: HeroTextProps) {
  const discipline = getDiscipline(project.discipline);
  return (
    <div className={[styles.text, centered && styles.centered].filter(Boolean).join(" ")}>
      <Link href={disciplineHref(discipline.slug)} className={styles.back}>
        <Icon name="arrow-left" />
        <Typography variant="eyebrow" as="span">
          {discipline.title}
        </Typography>
      </Link>
      <Typography variant="display-xl" as="h1" id="project-title" balance>
        {project.title}
      </Typography>
      <Typography variant="body-lg" tone="muted" className={styles.summary}>
        {project.summary}
      </Typography>
      <span className={styles.status} data-status={project.status}>
        <Typography variant="caption" as="span">
          {projectStatusLabels[project.status]}
        </Typography>
      </span>
    </div>
  );
}
