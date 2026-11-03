import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CubeScan,
  Developer,
  ElectronicsChip,
  HalfMoon,
  Mail,
  Menu,
  Pause,
  Play,
  Plus,
  OpenNewWindow,
  Sparks,
  SunLight,
  Computer,
  NavArrowDown,
  Xmark,
} from "iconoir-react";
import type { ComponentType, SVGProps } from "react";
import styles from "./Icon.module.css";

/* Iconoir line icons (iconoir.com), 24×24 at a 1.5px stroke. Keep the set small and on-brand. */
const icons = {
  "arrow-up-right": ArrowUpRight,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-down": ArrowDown,
  "chevron-down": NavArrowDown,
  plus: Plus,
  close: Xmark,
  menu: Menu,
  external: OpenNewWindow,
  mail: Mail,
  sun: SunLight,
  moon: HalfMoon,
  monitor: Computer,
  play: Play,
  pause: Pause,
  /* One per discipline. */
  software: Developer,
  ai: Sparks,
  spatial: CubeScan,
  hardware: ElectronicsChip,
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];

type IconProps = {
  name: IconName;
  /** px; defaults to 1em so the icon follows the surrounding text size. */
  size?: number | "1em";
  /** Give a label only when the icon stands alone and means something. */
  label?: string;
  className?: string;
};

export function Icon({ name, size = "1em", label, className }: IconProps) {
  const Svg = icons[name];
  return (
    <Svg
      className={[styles.icon, className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      strokeWidth={1.5}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
