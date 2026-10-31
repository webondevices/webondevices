import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { CtaBand } from "@/components/CtaBand/CtaBand";
import { GradientArt } from "@/components/GradientArt/GradientArt";
import { Typography } from "@/components/Typography/Typography";
import { disciplineHref, getDiscipline } from "@/content/disciplines";
import {
  getProject,
  projectHref,
  projects,
  projectsFor,
  projectStatusLabels,
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
  const related = projectsFor(project.discipline).filter((p) => p !== project);
  const story = [
    { label: "The challenge", text: project.challenge },
    { label: "What we built", text: project.solution },
    { label: "The result", text: project.outcome },
  ].filter((part): part is { label: string; text: string } => Boolean(part.text));

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

      {/* Overview */}
      <section className={styles.section} aria-labelledby="overview-title">
        <div className={`${styles.container} ${styles.split}`}>
          <div className={styles.sectionTitle}>
            <Typography variant="eyebrow" rule>
              Overview
            </Typography>
            <Typography variant="display" as="h2" id="overview-title">
              The project
            </Typography>
          </div>
          <div className={styles.overview}>
            <Typography variant="body-lg">{project.overview ?? project.summary}</Typography>
            {story.length > 0 ? (
              <dl className={styles.story}>
                {story.map((part) => (
                  <div key={part.label} className={styles.storyPart}>
                    <dt>
                      <Typography variant="heading-4" as="span">
                        {part.label}
                      </Typography>
                    </dt>
                    <dd>
                      <Typography variant="body" as="span" tone="muted">
                        {part.text}
                      </Typography>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <Typography variant="body-sm" tone="subtle">
                The full case study is on its way.
              </Typography>
            )}
            {project.links && (
              <div className={styles.links}>
                {project.links.map((link) => (
                  <Button key={link.href} variant="secondary" icon="external" href={link.href}>
                    {link.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
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

      {/* Gallery */}
      {project.gallery && (
        <section className={styles.section} aria-label="Gallery">
          <div className={`${styles.container} ${styles.gallery}`}>
            {project.gallery.map((item) => (
              <figure key={item.caption} className={styles.galleryItem}>
                <div className={styles.galleryMedia}>
                  <GradientArt name={item.art} />
                </div>
                <Typography variant="caption" as="figcaption" tone="muted">
                  {item.caption}
                </Typography>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* More from this discipline */}
      <section className={styles.section} aria-labelledby="more-title">
        <div className={styles.container}>
          <div className={styles.moreHeader}>
            <Typography variant="eyebrow" rule as="h2" id="more-title">
              More {discipline.title}
            </Typography>
            <Button variant="text" icon="arrow-right" href={disciplineHref(discipline.slug)}>
              All {discipline.title}
            </Button>
          </div>
          {related.length > 0 && (
            <div className={styles.related}>
              {related.slice(0, 3).map((p) => (
                <Card
                  key={p.slug}
                  eyebrow={p.tags.join(" · ")}
                  title={p.title}
                  description={p.summary}
                  media={<GradientArt name={p.art} />}
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
