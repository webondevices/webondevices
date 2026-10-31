import { Button } from "@/components/Button/Button";
import { Typography } from "@/components/Typography/Typography";
import { contactHref } from "@/lib/site";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  title?: string;
  /** Unique per page, so the section can be labelled by its heading. */
  id?: string;
};

/** The closing "Have a project in mind?" band, shared by the inner pages. */
export function CtaBand({ title = "Have a project in mind?", id = "cta-title" }: CtaBandProps) {
  return (
    <section className={styles.band} aria-labelledby={id}>
      <div className={styles.glow} aria-hidden />
      <div className={`${styles.container} ${styles.content}`}>
        <Typography variant="display" as="h2" id={id}>
          {title}
        </Typography>
        <Button href={contactHref} icon="arrow-up-right">
          Let&apos;s build
        </Button>
      </div>
    </section>
  );
}
