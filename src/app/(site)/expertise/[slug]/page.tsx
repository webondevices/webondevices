import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { CtaBand } from "@/components/CtaBand/CtaBand";
import { DisciplineTile } from "@/components/DisciplineTile/DisciplineTile";
import { ProjectMedia } from "@/components/ProjectMedia/ProjectMedia";
import { Typography } from "@/components/Typography/Typography";
import {
  disciplineHref,
  disciplineSlugs,
  disciplines,
  type DisciplineSlug,
} from "@/content/disciplines";
import { projectHref, projectsFor } from "@/content/projects";
import { contactHref } from "@/lib/site";
import styles from "./discipline.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return disciplineSlugs.map((slug) => ({ slug }));
}

function findDiscipline(slug: string) {
  return disciplines.find((d) => d.slug === (slug as DisciplineSlug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const discipline = findDiscipline((await params).slug);
  if (!discipline) return {};
  return {
    title: discipline.title,
    description: `${discipline.headline} ${discipline.short}`,
    alternates: { canonical: disciplineHref(discipline.slug) },
  };
}

export default async function DisciplinePage({ params }: Props) {
  const discipline = findDiscipline((await params).slug);
  if (!discipline) notFound();

  const number = String(disciplines.indexOf(discipline) + 1).padStart(2, "0");
  const projects = projectsFor(discipline.slug);
  const others = disciplines.filter((d) => d !== discipline);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="discipline-title">
        <div className={styles.heroArt}>
          <Image
            src={discipline.heroImage}
            alt=""
            fill
            sizes="100vw"
            priority
            className={styles.heroImage}
          />
        </div>
        <div className={`${styles.container} ${styles.heroContent}`}>
          <Typography variant="eyebrow" rule>
            Expertise · {number}
          </Typography>
          <Typography variant="display-xl" as="h1" id="discipline-title">
            {discipline.title}
          </Typography>
          <Typography variant="heading-3" as="p" className={styles.headline}>
            {discipline.headline}
          </Typography>
          <Typography variant="body-lg" className={styles.intro}>
            {discipline.intro}
          </Typography>
          <div className={styles.heroActions}>
            <Button variant="text" icon="arrow-down" href="#projects">
              See the projects
            </Button>
            <Button variant="secondary" icon="arrow-up-right" href={contactHref}>
              Let&apos;s build
            </Button>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className={styles.section} aria-labelledby="capabilities-title">
        <div className={`${styles.container} ${styles.split}`}>
          <div className={styles.sectionTitle}>
            <Typography variant="eyebrow" rule>
              What I do
            </Typography>
            <Typography variant="display" as="h2" id="capabilities-title">
              Capabilities
            </Typography>
          </div>
          <ul className={styles.capabilities}>
            {discipline.capabilities.map((item) => (
              <li key={item}>
                <Typography variant="body" as="span">
                  {item}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach */}
      <section className={styles.section} aria-labelledby="approach-title">
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <Typography variant="eyebrow" rule>
              How I work
            </Typography>
            <Typography variant="display" as="h2" id="approach-title">
              My approach
            </Typography>
          </div>
          <ol className={styles.steps}>
            {discipline.approach.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                <Typography variant="heading-3" as="h3">
                  {step.title}
                </Typography>
                <Typography variant="body-sm">{step.text}</Typography>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Experience */}
      <section className={styles.experience} aria-labelledby="experience-title">
        <div className={`${styles.container} ${styles.split}`}>
          <div className={styles.sectionTitle}>
            <Typography variant="eyebrow" rule>
              Experience
            </Typography>
            <Typography variant="display" as="h2" id="experience-title">
              Done it before
            </Typography>
          </div>
          <dl className={styles.facts}>
            {discipline.experience.map((item) => (
              <div key={item.title} className={styles.fact}>
                <dt>
                  <Typography variant="heading-4" as="span">
                    {item.title}
                  </Typography>
                </dt>
                <dd>
                  <Typography variant="body-sm" as="span">
                    {item.text}
                  </Typography>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className={styles.section} aria-labelledby="projects-title">
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <Typography variant="eyebrow" rule>
              Projects
            </Typography>
            <Typography variant="display" as="h2" id="projects-title">
              {discipline.title} work
            </Typography>
          </div>
          <div className={styles.projects}>
            {projects.map((p) => (
              <Card
                key={p.slug}
                eyebrow={p.tags.join(" · ")}
                title={p.title}
                description={p.summary}
                media={<ProjectMedia project={p} />}
                action="View project"
                href={projectHref(p.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other disciplines */}
      <section className={styles.section} aria-labelledby="more-title">
        <div className={styles.container}>
          <Typography variant="eyebrow" rule as="h2" id="more-title">
            More expertise
          </Typography>
          <div className={styles.others}>
            {others.map((d) => (
              <Card
                key={d.slug}
                layout="media-bottom"
                eyebrow={String(disciplines.indexOf(d) + 1).padStart(2, "0")}
                title={d.title}
                description={d.short}
                badge={<DisciplineTile icon={d.icon} discipline={d.slug} />}
                href={disciplineHref(d.slug)}
                action="Explore"
                headingLevel="h3"
              />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
