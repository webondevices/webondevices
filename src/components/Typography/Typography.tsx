import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Typography.module.css";

/** Every text style the site is allowed to use. Add here, not ad hoc in components. */
export const typographyVariants = [
  "display-xl",
  "display",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "body-lg",
  "body",
  "body-sm",
  "caption",
  "eyebrow",
  "mono",
] as const;

export type TypographyVariant = (typeof typographyVariants)[number];

export type TypographyTone = "default" | "muted" | "subtle" | "accent" | "inverse";

type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "li"
  | "label"
  | "dt"
  | "dd"
  | "figcaption";

const defaultElement: Record<TypographyVariant, TextElement> = {
  "display-xl": "h1",
  display: "h2",
  "heading-1": "h2",
  "heading-2": "h3",
  "heading-3": "h3",
  "heading-4": "h4",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  caption: "span",
  eyebrow: "span",
  mono: "span",
};

type TypographyProps = {
  variant: TypographyVariant;
  /** Override the semantic element. The visual style always follows `variant`. */
  as?: TextElement;
  tone?: TypographyTone;
  /** Eyebrows only: draw the short rule after the label, as in the mock. */
  rule?: boolean;
  /** Limit the line length for readability. */
  balance?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function Typography({
  variant,
  as,
  tone = "default",
  rule = false,
  balance = false,
  className,
  children,
  ...rest
}: TypographyProps) {
  const Element = as ?? defaultElement[variant];
  const classes = [
    styles[variant],
    tone !== "default" && styles[`tone-${tone}`],
    rule && variant === "eyebrow" && styles.rule,
    balance && styles.balance,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  );
}

/**
 * Inline tone change inside a Typography block, for the mock's grey closing
 * line: <Typography variant="display">Software… <Tone muted>working together.</Tone></Typography>
 */
export function Tone({
  muted,
  subtle,
  accent,
  children,
}: {
  muted?: boolean;
  subtle?: boolean;
  accent?: boolean;
  children: ReactNode;
}) {
  const tone = accent ? "accent" : subtle ? "subtle" : muted ? "muted" : "default";
  return (
    <span className={tone === "default" ? undefined : styles[`tone-${tone}`]}>{children}</span>
  );
}
