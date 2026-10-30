import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/Icon/Icon";
import { Typography } from "@/components/Typography/Typography";
import styles from "./Card.module.css";

type CardProps = {
  title: ReactNode;
  /** Small label above the title: a discipline, or a number like "01". */
  eyebrow?: string;
  description?: ReactNode;
  /** Image, video or any visual. Fills the media area edge to edge. */
  media?: ReactNode;
  /**
   * media-top: project card (image, then label + title).
   * media-bottom: discipline card (number, title, text, then image).
   */
  layout?: "media-top" | "media-bottom";
  /** Makes the whole card a link, with the ↗ affordance. */
  href?: string;
  /** Heading level for the title, to fit the page outline. */
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

export function Card({
  title,
  eyebrow,
  description,
  media,
  layout = "media-top",
  href,
  headingLevel = "h3",
  className,
}: CardProps) {
  const classes = [styles.card, styles[layout], href && styles.interactive, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes}>
      {media && <div className={styles.media}>{media}</div>}
      <div className={styles.body}>
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
          <span className={styles.arrow} aria-hidden>
            <Icon name="arrow-up-right" />
          </span>
        )}
      </div>
    </article>
  );
}
