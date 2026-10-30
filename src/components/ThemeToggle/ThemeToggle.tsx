"use client";

import { Icon, type IconName } from "@/components/Icon/Icon";
import { useTheme, type ThemePreference } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

const options: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className={styles.toggle} role="radiogroup" aria-label="Colour theme">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={preference === option.value}
          aria-label={option.label}
          title={option.label}
          className={styles.option}
          onClick={() => setPreference(option.value)}
        >
          <Icon name={option.icon} />
        </button>
      ))}
    </div>
  );
}
