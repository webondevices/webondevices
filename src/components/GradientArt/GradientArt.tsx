import styles from "./GradientArt.module.css";

export type GradientArtName = "spatial" | "hardware" | "ai" | "software" | "horizon" | "dusk";

type GradientArtProps = {
  /** Each discipline has its own composition; horizon and dusk are general-purpose. */
  name: GradientArtName;
  className?: string;
};

/** Decorative CSS gradient artwork, standing in for photography and motion for now. */
export function GradientArt({ name, className }: GradientArtProps) {
  return (
    <div className={[styles.art, styles[name], className].filter(Boolean).join(" ")} aria-hidden />
  );
}
