import Image from "next/image";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { GradientArt } from "@/components/GradientArt/GradientArt";
import { Tone, Typography } from "@/components/Typography/Typography";
import { disciplineHref, disciplines, getDiscipline } from "@/content/disciplines";
import { founderFacts, founderHighlights, testimonials } from "@/content/home";
import { featuredProjects } from "@/content/projects";
import { contactHref, site } from "@/lib/site";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroArt} aria-hidden>
          <div className={styles.heroCaption}>
            <Typography variant="eyebrow">3D spatial experiences</Typography>
            <Typography variant="body-sm">
              From reality to interactive digital experiences.
            </Typography>
          </div>
        </div>
        <div className={styles.heroContent}>
          <Typography variant="eyebrow">Creative technology studio</Typography>
          <Typography variant="display-xl" as="h1" id="hero-title" className={styles.heroTitle}>
            Software, hardware and intelligence <Tone muted>working together.</Tone>
          </Typography>
          <Typography variant="body-lg" className={styles.heroLead}>
            We design, build and deploy real-world technology. From physical devices to intelligent
            software and immersive digital experiences.
          </Typography>
          <div className={styles.heroActions}>
            <Button variant="text" icon="arrow-up-right" href="#projects">
              Explore our work
            </Button>
            <Button variant="secondary" icon="arrow-up-right" href={contactHref}>
              Let&apos;s build
            </Button>
          </div>
        </div>
      </section>

      {/* Four disciplines */}
      <section id="expertise" className={styles.disciplines} aria-labelledby="expertise-title">
        <h2 id="expertise-title" className="visually-hidden">
          Expertise
        </h2>
        {disciplines.map((d, index) => (
          <Card
            key={d.slug}
            href={disciplineHref(d.slug)}
            layout="media-bottom"
            eyebrow={String(index + 1).padStart(2, "0")}
            title={
              <>
                {d.titleLines[0]}
                <br />
                {d.titleLines[1]}
              </>
            }
            description={d.short}
            media={<GradientArt name={d.art} />}
          />
        ))}
      </section>

      {/* Featured projects */}
      <section id="projects" className={styles.section} aria-labelledby="projects-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Typography variant="eyebrow" rule>
                Featured projects
              </Typography>
              <Typography variant="display" as="h2" id="projects-title">
                Ideas into real-world results.
              </Typography>
            </div>
            <Typography variant="body" className={styles.sectionAside}>
              A selection of recent projects across spatial media, hardware, AI and software
              development.
            </Typography>
          </div>
        </div>
        <div className={styles.projects}>
          {featuredProjects.map((p) => (
            <Card
              key={p.slug}
              eyebrow={getDiscipline(p.discipline).title}
              title={p.title}
              media={<GradientArt name={p.art} />}
            />
          ))}
        </div>
      </section>

      {/* Founder */}
      <section id="about" className={styles.founder} aria-labelledby="founder-title">
        <div className={`${styles.container} ${styles.founderGrid}`}>
          <div className={styles.founderIntro}>
            <Typography variant="eyebrow" rule>
              Founder &amp; Consultant
            </Typography>
            <Typography variant="heading-1" as="h2" id="founder-title">
              Nearly 20 years of turning new technology <Tone muted>into things people use.</Tone>
            </Typography>
            <figure className={styles.portrait}>
              <Image src="/matemarschalko.jpg" alt="" width={160} height={160} />
              <figcaption>
                <Typography variant="body-sm" as="span" className={styles.portraitName}>
                  Mate Marschalko
                </Typography>
                <Typography variant="caption" as="span">
                  Founder &amp; Consultant
                </Typography>
              </figcaption>
            </figure>
          </div>

          <div className={styles.founderBody}>
            <Typography variant="body-lg">
              Web on Devices is led by Mate Marschalko, a creative technologist and lead engineer.
              He has built products used by millions for media, finance, travel and retail
              companies, and experiments that found an audience of their own. Every project gets the
              same senior engineering, whether it ships to millions of browsers or to a single
              sensor in a field.
            </Typography>

            <dl className={styles.facts}>
              {founderFacts.map((fact) => (
                <div key={fact.value} className={styles.fact}>
                  <dt>
                    <Typography variant="display" as="span">
                      {fact.value}
                    </Typography>
                  </dt>
                  <dd>
                    <Typography variant="body-sm" as="span">
                      {fact.label}
                    </Typography>
                  </dd>
                </div>
              ))}
            </dl>

            <ul className={styles.highlights}>
              {founderHighlights.map((item) => (
                <li key={item}>
                  <Typography variant="body-sm" as="span">
                    {item}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${styles.container} ${styles.quotes}`}>
          {testimonials.map((t) => (
            <figure key={t.name} className={styles.quote}>
              <blockquote>
                <Typography variant="heading-4" as="p">
                  “{t.quote}”
                </Typography>
              </blockquote>
              <figcaption>
                <Typography variant="body-sm" as="span" className={styles.portraitName}>
                  {t.name}
                </Typography>
                <Typography variant="caption" as="span">
                  {t.role}
                </Typography>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Approach band */}
      <section className={styles.band} aria-labelledby="approach-title">
        <div className={styles.bandGlow} aria-hidden />
        <div className={`${styles.container} ${styles.bandContent}`}>
          <div className={styles.sectionTitle}>
            <Typography variant="eyebrow" rule>
              Our approach
            </Typography>
            <Typography variant="display" as="h2" id="approach-title">
              Practical technology <Tone muted>for a more interesting world.</Tone>
            </Typography>
          </div>
          <div className={styles.bandAside}>
            <Typography variant="body">
              We combine engineering, creativity and emerging technologies to solve real problems
              and create new possibilities. One studio, from the circuit board to the cloud.
            </Typography>
            <Button variant="text" icon="arrow-down" href="#contact">
              Start a project
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.section} aria-labelledby="contact-title">
        <div className={`${styles.container} ${styles.contactGrid}`}>
          <div className={styles.contactIntro}>
            <Typography variant="eyebrow" rule>
              Contact
            </Typography>
            <Typography variant="display" as="h2" id="contact-title">
              Let&apos;s build <Tone muted>something real.</Tone>
            </Typography>
            <Typography variant="body-lg">
              A product idea, an engineering challenge or a prototype that needs to work in the real
              world. Tell us about it and we&apos;ll get back to you.
            </Typography>
            <Typography variant="body-sm">
              Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a>
            </Typography>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
