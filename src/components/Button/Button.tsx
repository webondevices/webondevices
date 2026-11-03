import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ActionLabel } from "@/components/ActionLabel/ActionLabel";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "md" | "sm";

type CommonProps = {
  /**
   * primary: solid pill ("Let's build ↗")
   * secondary: outlined pill ("View all projects ↗")
   * text: icon in a filled circle, then the label ("↗ Explore my work")
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    keyof CommonProps | "href"
  >;
type AsButton = CommonProps & { href?: never } & Omit<
    ComponentPropsWithoutRef<"button">,
    keyof CommonProps
  >;

export type ButtonProps = AsLink | AsButton;

function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

type AnchorRest = Omit<AsLink, keyof CommonProps | "href">;
type ButtonRest = Omit<AsButton, keyof CommonProps | "href">;

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  const action = variant === "text" ? true : undefined;
  const content =
    variant === "text" && icon ? (
      <ActionLabel icon={icon} size={size}>
        {children}
      </ActionLabel>
    ) : (
      <>
        <span>{children}</span>
        {icon && <Icon name={icon} className={styles.trailingIcon} />}
      </>
    );

  if (href !== undefined) {
    const anchorProps = rest as AnchorRest;
    if (isExternal(href)) {
      return (
        <a className={classes} href={href} data-action={action} {...anchorProps}>
          {content}
        </a>
      );
    }
    return (
      <Link className={classes} href={href} data-action={action} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as ButtonRest;
  return (
    <button className={classes} type="button" data-action={action} {...buttonProps}>
      {content}
    </button>
  );
}

type IconButtonProps = {
  icon: IconName;
  /** Required: an icon-only control needs an accessible name. */
  label: string;
  variant?: "outline" | "solid";
  size?: ButtonSize;
  href?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

/** The round ↗ control used on cards and section links. */
export function IconButton({
  icon,
  label,
  variant = "outline",
  size = "md",
  href,
  className,
  ...rest
}: IconButtonProps) {
  const classes = [styles.iconButton, styles[`icon-${variant}`], styles[size], className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link className={classes} href={href} aria-label={label}>
        <Icon name={icon} />
      </Link>
    );
  }
  return (
    <button className={classes} type="button" aria-label={label} {...rest}>
      <Icon name={icon} />
    </button>
  );
}
