import Link from "next/link";
import type { ReactNode } from "react";
import { ActionLabel } from "@/components/ActionLabel/ActionLabel";
import { Typography } from "@/components/Typography/Typography";
import styles from "./Card.module.css";

type CardProps = {
  title: ReactNode;
  /** Small label above the title: a discipline, or a number like "01". */
  eyebrow?: string;
  description?: ReactNode;
  /**
   * A small mark, such as a discipline badge: over the image's top-right corner
   * on media-top cards, above the eyebrow on media-bottom cards.
   */
  badge?: ReactNode;
  /** Image, video or any visual. Fills the media area edge to edge. */
  media?: ReactNode;
  /**
   * media-top: project card (image, then label + title).
   * media-bottom: discipline card (number, title, text, then image).
   */
  layout?: "media-top" | "media-bottom";
  /** Makes the whole card a link, with the ↗ affordance. */
  href?: string;
  /** The affordance's label. */
  action?: string;
  /** Heading level for the title, to fit the page outline. */
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

export function Card({
  title,
  eyebrow,
  description,
  badge,
  media,
  layout = "media-top",
  href,
  action = "Learn more",
  headingLevel = "h3",
  className,
}: CardProps) {
  const classes = [styles.card, styles[layout], href && styles.interactive, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes} data-action={href ? true : undefined}>
      {badge && layout === "media-top" && <div className={styles.badge}>{badge}</div>}
      {media && <div className={styles.media}>{media}</div>}
      <div className={styles.body}>
        {badge && layout === "media-bottom" && <div className={styles.badgeInline}>{badge}</div>}
        {eyebrow && (
          <Typography variant="eyebrow" rule={layout === "media-bottom"}>
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant={layout === "media-bottom" ? "heading-3" : "body"}
          as={headingLevel}
          className={styles.title}
        >
          {href ? (
            <Link href={href} className={styles.link}>
              {title}
            </Link>
          ) : (
            title
          )}
        </Typography>
        {description && (
          <Typography variant="body-sm" className={styles.description}>
            {description}
          </Typography>
        )}
        {href && (
          <span className={styles.action} aria-hidden>
            <ActionLabel icon="arrow-up-right" size="sm" variant="secondary">
              {action}
            </ActionLabel>
          </span>
        )}
      </div>
    </article>
  );
}
