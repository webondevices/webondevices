import Link from "next/link";
import { Button } from "@/components/Button/Button";
import { Byline } from "@/components/Byline/Byline";
import { Icon } from "@/components/Icon/Icon";
import { Typography } from "@/components/Typography/Typography";
import { disciplineHref, getDiscipline } from "@/content/disciplines";
import { projectStatusLabels, type Project } from "@/content/projects";
import styles from "./hero.module.css";

/** The text every project hero shares: the way back, the title, the summary, the byline and the status. */
export function HeroText({ project }: { project: Project }) {
  const discipline = getDiscipline(project.discipline);
  return (
    <div className={styles.text}>
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
      <div className={styles.meta}>
        <Byline />
        <span className={styles.status} data-status={project.status}>
          <Typography variant="caption" as="span">
            {projectStatusLabels[project.status]}
          </Typography>
        </span>
      </div>
      {project.demo && (
        <Button href={project.demo} icon="arrow-right" className={styles.demo}>
          Launch the live demo
        </Button>
      )}
    </div>
  );
}
