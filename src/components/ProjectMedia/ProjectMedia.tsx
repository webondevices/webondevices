import { GradientArt } from "@/components/GradientArt/GradientArt";
import type { Project } from "@/content/projects";
import styles from "./ProjectMedia.module.css";

type ProjectMediaProps = {
  project: Pick<Project, "hero" | "art">;
  className?: string;
};

/** A project's lead image, or its discipline artwork until it has one. Fills its container. */
export function ProjectMedia({ project, className }: ProjectMediaProps) {
  if (!project.hero) return <GradientArt name={project.art} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
    <img
      src={project.hero.image}
      alt={project.hero.alt}
      loading="lazy"
      className={[styles.image, className].filter(Boolean).join(" ")}
    />
  );
}
