import type { Metadata } from "next";
import { Button, IconButton } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { DisciplineTile } from "@/components/DisciplineTile/DisciplineTile";
import { Icon, iconNames } from "@/components/Icon/Icon";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { Tone, Typography, type TypographyVariant } from "@/components/Typography/Typography";
import { WodLogo } from "@/components/WodLogo/WodLogo";
import { type DisciplineSlug, disciplines, getDiscipline } from "@/content/disciplines";
import { Swatch } from "./_components/Swatch";
import styles from "./brand.module.css";

export const metadata: Metadata = {
  title: "Brand preview",
  robots: { index: false, follow: false },
};

const brandGroups: { name: string; tokens: string[] }[] = [
  {
    name: "Blues",
    tokens: ["--brand-midnight", "--brand-dusk", "--brand-ocean", "--brand-sky", "--brand-mist"],
  },
  { name: "Sunset", tokens: ["--brand-coral", "--brand-ember", "--brand-gold", "--brand-sun"] },
  {
    name: "Neutrals",
    tokens: [
      "--brand-paper",
      "--brand-grey-100",
      "--brand-grey-200",
      "--brand-grey-300",
      "--brand-grey-400",
      "--brand-grey-500",
      "--brand-grey-600",
      "--brand-grey-700",
      "--brand-ink",
    ],
  },
  {
    name: "Night",
    tokens: [
      "--brand-night-800",
      "--brand-night-700",
      "--brand-night-500",
      "--brand-night-300",
      "--brand-night-100",
    ],
  },
];

const roleGroups: { name: string; tokens: string[] }[] = [
  {
    name: "Backgrounds",
    tokens: ["--color-bg", "--color-bg-subtle", "--color-surface", "--color-bg-inverse"],
  },
  {
    name: "Text",
    tokens: [
      "--color-text",
      "--color-text-muted",
      "--color-text-subtle",
      "--color-text-accent",
      "--color-text-inverse",
    ],
  },
  {
    name: "Lines, accents and actions",
    tokens: [
      "--color-border",
      "--color-border-strong",
      "--color-accent",
      "--color-accent-warm",
      "--color-highlight",
      "--color-action-bg",
      "--color-focus",
    ],
  },
];

const gradients = ["--brand-gradient-sunset", "--brand-gradient-dusk", "--brand-gradient-ember"];

const typeSpecimens: { variant: TypographyVariant; sample: string; spec: string }[] = [
  { variant: "display-xl", sample: "Working together.", spec: "48–104px · Light · −3.5%" },
  { variant: "display", sample: "Ideas into real-world results.", spec: "40–76px · Light · −3%" },
  { variant: "heading-1", sample: "Practical technology", spec: "32–52px · Regular · −2.5%" },
  { variant: "heading-2", sample: "Hardware & Electronics", spec: "26–36px · Regular · −2%" },
  { variant: "heading-3", sample: "Spatial Experiences", spec: "21–26px · Regular · −1.5%" },
  { variant: "heading-4", sample: "Farm Monitoring System", spec: "20px · Medium · −1%" },
  {
    variant: "body-lg",
    sample:
      "We design, build and deploy real-world technology, from physical devices to intelligent software.",
    spec: "18px · Regular · 1.6",
  },
  {
    variant: "body",
    sample: "Connected devices, sensors and real-world systems that collect data where it happens.",
    spec: "16px · Regular · 1.6",
  },
  {
    variant: "body-sm",
    sample: "3D capture, digital twins and immersive visualisation.",
    spec: "14px · Regular · 1.55",
  },
  { variant: "caption", sample: "Photographed on site, March 2026", spec: "13px · Regular" },
  {
    variant: "eyebrow",
    sample: "Creative technology studio",
    spec: "11px · Medium · +22% · Uppercase",
  },
  {
    variant: "mono",
    sample: "ESP32 · LoRaWAN · 12 sensors · 18 month battery",
    spec: "JetBrains Mono · 13px",
  },
];

/* Placeholder art per discipline, until the brand page uses real project photos. */
const projects: { discipline: DisciplineSlug; title: string; media: React.ReactNode }[] = [
  {
    discipline: "spatial-experiences",
    title: "Interactive Property Showcase",
    media: <div className={styles.placeholderSky} />,
  },
  {
    discipline: "hardware-electronics",
    title: "Farm Monitoring System",
    media: <div className={styles.placeholderSunset} />,
  },
  {
    discipline: "ai-automation",
    title: "AI-Powered Search Platform",
    media: <div className={styles.placeholderDusk} />,
  },
];

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <header className={styles.sectionHeader}>
        <Typography variant="eyebrow" rule>
          {eyebrow}
        </Typography>
        <Typography variant="heading-1" as="h2" id={`${id}-title`}>
          {title}
        </Typography>
      </header>
      {children}
    </section>
  );
}

export default function BrandPage() {
  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <a href="#top" className={styles.homeLink} aria-label="Web on Devices brand preview">
            <WodLogo height={26} title="" />
          </a>
          <nav className={styles.toc} aria-label="Sections">
            <a href="#logo">Logo</a>
            <a href="#colour">Colour</a>
            <a href="#type">Type</a>
            <a href="#components">Components</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        {/* The brand in context, loosely following the homepage mock. */}
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroContent}>
            <Typography variant="eyebrow">Creative technology studio</Typography>
            <Typography variant="display-xl" as="h1">
              Software, hardware and intelligence <Tone muted>working together.</Tone>
            </Typography>
            <Typography variant="body-lg" balance>
              We design, build and deploy real-world technology. From physical devices to
              intelligent software and immersive digital experiences.
            </Typography>
            <div className={styles.heroActions}>
              <Button variant="text" icon="arrow-up-right" href="#components">
                Explore our work
              </Button>
              <Button variant="primary" icon="arrow-up-right" href="#colour">
                Let&apos;s build
              </Button>
            </div>
          </div>
        </section>

        <div className={styles.container}>
          <Section id="logo" eyebrow="Logo" title="The WOD mark">
            <div className={styles.logoGrid}>
              <div className={`${styles.logoTile} ${styles.logoLight}`}>
                <WodLogo height={88} title="WOD logo on light" />
              </div>
              <div className={`${styles.logoTile} ${styles.logoDark}`}>
                <WodLogo height={88} title="WOD logo on dark" />
              </div>
              <div className={`${styles.logoTile} ${styles.logoSunset}`}>
                <WodLogo height={88} title="WOD logo on the sunset gradient" />
              </div>
              <div className={`${styles.logoTile} ${styles.logoLight}`}>
                <WodLogo variant="lockup" height={130} title="WOD with Web on Devices" />
              </div>
            </div>
            <div className={styles.logoSizes}>
              {[96, 48, 32, 24, 16].map((size) => (
                <div key={size} className={styles.logoSize}>
                  <WodLogo height={size} title="" />
                  <Typography variant="mono">{size}px</Typography>
                </div>
              ))}
            </div>
            <Typography variant="caption">
              Traced from the logo sheet. Swap in the original vector paths in WodLogo.tsx when
              available.
            </Typography>
          </Section>

          <Section id="colour" eyebrow="Colour" title="Sunset palette">
            <Typography variant="body" balance>
              Tier 1 is the brand palette: raw values that never change with the theme. Tier 2 maps
              roles onto them per theme, and components only ever use roles. Switch the theme at the
              top to see the roles move.
            </Typography>

            {brandGroups.map((group) => (
              <div key={group.name} className={styles.swatchGroup}>
                <Typography variant="eyebrow" as="h3">
                  Brand · {group.name}
                </Typography>
                <div className={styles.swatches}>
                  {group.tokens.map((token) => (
                    <Swatch key={token} token={token} />
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.swatchGroup}>
              <Typography variant="eyebrow" as="h3">
                Brand · Gradients
              </Typography>
              <div className={styles.gradients}>
                {gradients.map((token) => (
                  <figure key={token} className={styles.gradient}>
                    <div style={{ backgroundImage: `var(${token})` }} />
                    <figcaption>
                      <code>{token}</code>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            {roleGroups.map((group) => (
              <div key={group.name} className={styles.swatchGroup}>
                <Typography variant="eyebrow" as="h3">
                  Role · {group.name}
                </Typography>
                <div className={styles.swatches}>
                  {group.tokens.map((token) => (
                    <Swatch key={token} token={token} />
                  ))}
                </div>
              </div>
            ))}
          </Section>

          <Section id="type" eyebrow="Typography" title="Inter, light and confident">
            <div className={styles.typeList}>
              {typeSpecimens.map(({ variant, sample, spec }) => (
                <div key={variant} className={styles.typeRow}>
                  <div className={styles.typeMeta}>
                    <Typography variant="mono" tone="default">
                      {variant}
                    </Typography>
                    <Typography variant="caption">{spec}</Typography>
                  </div>
                  <Typography variant={variant} as="p">
                    {sample}
                  </Typography>
                </div>
              ))}
            </div>
          </Section>

          <Section id="components" eyebrow="Components" title="Buttons, icons and cards">
            <div className={styles.componentBlock}>
              <Typography variant="eyebrow" as="h3">
                Buttons
              </Typography>
              <div className={styles.row}>
                <Button icon="arrow-up-right">Let&apos;s build</Button>
                <Button variant="secondary" icon="arrow-up-right">
                  View all projects
                </Button>
                <Button variant="text" icon="arrow-up-right">
                  Explore our work
                </Button>
                <Button size="sm" icon="arrow-right">
                  Small
                </Button>
                <Button variant="secondary" size="sm">
                  Small outline
                </Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className={styles.row}>
                <IconButton icon="arrow-up-right" label="Open project" />
                <IconButton icon="arrow-up-right" label="Open project" variant="solid" />
                <IconButton icon="arrow-right" label="Next" size="sm" />
                <IconButton icon="plus" label="Add" size="sm" variant="solid" />
              </div>
            </div>

            <div className={styles.componentBlock}>
              <Typography variant="eyebrow" as="h3">
                Icons
              </Typography>
              <div className={styles.icons}>
                {iconNames.map((name) => (
                  <div key={name} className={styles.iconCell}>
                    <Icon name={name} size={24} />
                    <Typography variant="mono">{name}</Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.componentBlock}>
              <Typography variant="eyebrow" as="h3">
                Discipline badges
              </Typography>
              <div className={styles.icons}>
                {disciplines.map((d) => (
                  <div key={d.slug} className={styles.iconCell}>
                    <DisciplineTile icon={d.icon} discipline={d.slug} />
                    <Typography variant="mono">{d.slug}</Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.componentBlock}>
              <Typography variant="eyebrow" as="h3">
                Discipline cards
              </Typography>
              <div className={styles.disciplines}>
                {disciplines.map((d, index) => (
                  <Card
                    key={d.slug}
                    href="#components"
                    action="Explore"
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
                    badge={<DisciplineTile icon={d.icon} discipline={d.slug} />}
                  />
                ))}
              </div>
            </div>

            <div className={styles.componentBlock}>
              <Typography variant="eyebrow" as="h3">
                Project cards
              </Typography>
              <div className={styles.projects}>
                {projects.map((p) => (
                  <Card
                    key={p.title}
                    eyebrow={getDiscipline(p.discipline).title}
                    title={p.title}
                    media={p.media}
                    action="View project"
                    badge={
                      <DisciplineTile
                        icon={getDiscipline(p.discipline).icon}
                        discipline={p.discipline}
                      />
                    }
                    href="#components"
                  />
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* The gradient in context, at the proportions of the "Our approach" band in the mock. */}
        <section className={styles.band} aria-labelledby="approach-title">
          <div className={styles.bandGlow} aria-hidden />
          <div className={styles.bandContent}>
            <div className={styles.bandHeading}>
              <Typography variant="eyebrow" rule>
                Our approach
              </Typography>
              <Typography variant="heading-1" as="h2" id="approach-title">
                Practical technology <Tone muted>for a more interesting world.</Tone>
              </Typography>
            </div>
            <div className={styles.bandAside}>
              <Typography variant="body-sm">
                We combine engineering, creativity and emerging technologies to solve real problems
                and create new possibilities.
              </Typography>
              <Button variant="text" icon="arrow-right" href="#top">
                Learn more
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
