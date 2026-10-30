import styles from "./WodLogo.module.css";

/*
 * Traced from reference/logo-sheet.jpg. Replace the paths with the original
 * vector artwork when it is available; the viewBox and API can stay the same.
 */
const MARK_PATHS = (
  <>
    <path d="M0 0H65L103 72.5L59.5 112Z" />
    <path d="M76 0H141L179 72.5L135.5 112Z" />
    <circle cx="239" cy="56" r="56" />
    <path d="M304 0H356A56 56 0 0 1 356 112H304Z" />
  </>
);

type WodLogoProps = {
  /** "mark" is WOD only; "lockup" adds the Web on Devices name underneath. */
  variant?: "mark" | "lockup";
  /** Rendered height in px. Width follows the aspect ratio. */
  height?: number;
  className?: string;
  /** Accessible name. Pass an empty string when the logo sits inside a labelled link. */
  title?: string;
};

export function WodLogo({
  variant = "mark",
  height = 32,
  className,
  title = "Web on Devices",
}: WodLogoProps) {
  const isLockup = variant === "lockup";
  const viewBox = isLockup ? "0 0 412 172" : "0 0 412 112";
  const [, , w, h] = viewBox.split(" ").map(Number);
  const labelled = title !== "";

  return (
    <svg
      className={[styles.logo, className].filter(Boolean).join(" ")}
      viewBox={viewBox}
      height={height}
      width={(height * w) / h}
      fill="currentColor"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
    >
      {MARK_PATHS}
      {isLockup && (
        <text
          className={styles.subtext}
          x="206"
          y="164"
          textAnchor="middle"
          textLength="400"
          lengthAdjust="spacingAndGlyphs"
        >
          Web on Devices
        </text>
      )}
    </svg>
  );
}
