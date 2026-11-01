import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { CtaBand } from "@/components/CtaBand/CtaBand";
import { Mdx } from "@/components/Mdx/Mdx";
import { ProjectMedia } from "@/components/ProjectMedia/ProjectMedia";
import { Typography } from "@/components/Typography/Typography";
import { disciplineHref, getDiscipline } from "@/content/disciplines";
import {
  getProject,
  projectHref,
  projects,
  projectStatusLabels,
  relatedProjects,
  projectTypeLabels,
  type Project,
} from "@/content/projects";
import { AiHero, AiSignature } from "./_variants/Ai";
import { HardwareHero, HardwareSignature } from "./_variants/Hardware";
import { SoftwareHero, SoftwareSignature } from "./_variants/Software";
import { SpatialHero, SpatialSignature } from "./_variants/Spatial";
import styles from "./project.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: projectHref(project.slug) },
  };
}

/* The discipline decides the hero and the signature section. Everything else is shared. */
function Hero({ project }: { project: Project }) {
  switch (project.discipline) {
    case "spatial-experiences":
      return <SpatialHero project={project} />;
    case "hardware-electronics":
      return <HardwareHero project={project} />;
    case "ai-automation":
      return <AiHero project={project} />;
    case "software-engineering":
      return <SoftwareHero project={project} />;
  }
}

function Signature({ project }: { project: Project }) {
  switch (project.discipline) {
    case "spatial-experiences":
      return project.details && <SpatialSignature details={project.details} />;
    case "hardware-electronics":
      return project.details && <HardwareSignature details={project.details} />;
    case "ai-automation":
      return project.details && <AiSignature details={project.details} />;
    case "software-engineering":
      return project.details && <SoftwareSignature details={project.details} />;
  }
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const discipline = getDiscipline(project.discipline);
  const related = relatedProjects(project);

  const facts = [
    {
      label: "Expertise",
      value: <Link href={disciplineHref(discipline.slug)}>{discipline.title}</Link>,
    },
    { label: "Type", value: projectTypeLabels[project.type] },
    { label: "Status", value: projectStatusLabels[project.status] },
    project.client && { label: "Client", value: project.client },
    project.role && { label: "Role", value: project.role },
    project.year && { label: "Year", value: project.year },
    { label: "Focus", value: project.tags.join(", ") },
  ].filter(Boolean) as { label: string; value: ReactNode }[];

  return (
    <article data-discipline={project.discipline}>
      <Hero project={project} />

      {/* Key facts */}
      <div className={styles.container}>
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>
                <Typography variant="eyebrow" as="span" tone="subtle">
                  {fact.label}
                </Typography>
              </dt>
              <dd>
                <Typography variant="body-sm" as="span">
                  {fact.value}
                </Typography>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The case study */}
      <section className={styles.section} aria-labelledby="overview-title">
        <div className={`${styles.container} ${styles.split}`}>
          <div className={styles.aside}>
            <div className={styles.sectionTitle}>
              <Typography variant="eyebrow" rule>
                Overview
              </Typography>
              <Typography variant="display" as="h2" id="overview-title">
                The project
              </Typography>
            </div>
            {project.links.length > 0 && (
              <div className={styles.links}>
                {project.links.map((link) => (
                  <Button
                    key={link.href}
                    variant="secondary"
                    size="sm"
                    icon="external"
                    href={link.href}
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Mdx source={project.body} />
        </div>
      </section>

      <Signature project={project} />

      {/* Results */}
      {project.results && (
        <section className={styles.results} aria-labelledby="results-title">
          <div className={styles.container}>
            <Typography variant="eyebrow" rule as="h2" id="results-title">
              Results
            </Typography>
            <dl className={styles.figures}>
              {project.results.map((r) => (
                <div key={r.label} className={styles.figure}>
                  <dt>
                    <Typography variant="body-sm" as="span" tone="muted">
                      {r.label}
                    </Typography>
                  </dt>
                  <dd>
                    <Typography variant="display" as="span">
                      {r.value}
                    </Typography>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* More from this discipline */}
      <section className={styles.section} aria-labelledby="more-title">
        <div className={styles.container}>
          <div className={styles.moreHeader}>
            <Typography variant="eyebrow" rule as="h2" id="more-title">
              Related projects
            </Typography>
            <Button variant="text" icon="arrow-right" href={disciplineHref(discipline.slug)}>
              All {discipline.title}
            </Button>
          </div>
          {related.length > 0 && (
            <div className={styles.related}>
              {related.map((p) => (
                <Card
                  key={p.slug}
                  eyebrow={p.tags.join(" · ")}
                  title={p.title}
                  description={p.summary}
                  media={<ProjectMedia project={p} />}
                  href={projectHref(p.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </article>
  );
}
