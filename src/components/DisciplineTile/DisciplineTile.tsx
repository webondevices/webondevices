import { Icon, type IconName } from "@/components/Icon/Icon";
import type { DisciplineSlug } from "@/content/disciplines";
import styles from "./DisciplineTile.module.css";

type DisciplineTileProps = {
  icon: IconName;
  /** Picks the badge colour. */
  discipline: DisciplineSlug;
  className?: string;
};

/** A discipline's icon as a small badge in that discipline's brand colour. */
export function DisciplineTile({ icon, discipline, className }: DisciplineTileProps) {
  return (
    <div
      className={[styles.tile, styles[discipline], className].filter(Boolean).join(" ")}
      aria-hidden
    >
      <Icon name={icon} className={styles.icon} />
    </div>
  );
}
