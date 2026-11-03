import { ProjectMedia } from "@/components/ProjectMedia/ProjectMedia";
import type { Project } from "@/content/projects";
import { HeroText } from "./HeroText";
import styles from "./hero.module.css";

/* Every project's hero: the text beside its lead image in a rounded, shadowed frame. */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <section className={styles.hero} aria-labelledby="project-title">
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <HeroText project={project} />
        <figure className={styles.frame}>
          <ProjectMedia project={project} />
        </figure>
      </div>
    </section>
  );
}
