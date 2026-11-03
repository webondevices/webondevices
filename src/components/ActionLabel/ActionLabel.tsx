import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./ActionLabel.module.css";

type ActionLabelProps = {
  icon: IconName;
  size?: "md" | "sm";
  /** primary: ink circle, light icon. secondary: ink outline, light fill, ink icon. */
  variant?: "primary" | "secondary";
  children: ReactNode;
};

/**
 * An icon in a filled circle, then a label ("↗ Explore my work"). Purely visual:
 * put it inside the link or button, and mark that element with `data-action` so
 * hovering anywhere on it grows the circle.
 */
export function ActionLabel({
  icon,
  size = "md",
  variant = "primary",
  children,
}: ActionLabelProps) {
  return (
    <span className={`${styles.action} ${styles[size]} ${styles[variant]}`}>
      <span className={styles.bubble}>
        <Icon name={icon} />
      </span>
      <span>{children}</span>
    </span>
  );
}
