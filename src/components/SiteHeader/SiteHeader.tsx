"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button, IconButton } from "@/components/Button/Button";
import { Icon } from "@/components/Icon/Icon";
import { WodLogo } from "@/components/WodLogo/WodLogo";
import { disciplineHref, disciplines } from "@/content/disciplines";
import { contactHref, mainNav } from "@/lib/site";
import styles from "./SiteHeader.module.css";

/* The homepage sections the nav points at, by id. */
const sectionIds = mainNav.flatMap((item) => item.href.match(/^\/#(.+)/)?.[1] ?? []);

/** Which homepage section sits across the middle of the viewport, if any. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(sectionIds.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [expertiseOpen, setExpertiseOpen] = useState(false);
  const expertiseRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const expertiseId = useId();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const activeSection = useActiveSection(onHome);
  const onExpertise = pathname.startsWith("/expertise/");

  const currentFor = (href: string) => {
    if (href === "/") return onHome && !activeSection ? "page" : undefined;
    if (href.startsWith("/#"))
      return onHome && href === `/#${activeSection}` ? "location" : undefined;
    return pathname === href ? "page" : undefined;
  };

  useEffect(() => {
    if (!open && !expertiseOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setExpertiseOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!expertiseRef.current?.contains(event.target as Node)) setExpertiseOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, expertiseOpen]);

  const close = () => {
    setOpen(false);
    setExpertiseOpen(false);
  };

  const [home, ...rest] = mainNav;

  return (
    <header className={styles.header} data-open={open || undefined}>
      <div className={styles.inner}>
        <Link href="/" className={styles.home} aria-label="Web on Devices, home" onClick={close}>
          <WodLogo variant="lockup" height={44} title="" />
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <ul id={menuId} className={styles.links}>
            <li>
              <Link
                href={home.href}
                className={styles.link}
                onClick={close}
                aria-current={currentFor(home.href)}
              >
                {home.label}
              </Link>
            </li>

            <li ref={expertiseRef} className={styles.expertise}>
              <button
                type="button"
                className={styles.link}
                aria-expanded={expertiseOpen}
                aria-controls={expertiseId}
                data-current={onExpertise || undefined}
                onClick={() => setExpertiseOpen((value) => !value)}
              >
                Expertise
                <Icon name="chevron-down" className={styles.chevron} />
              </button>
              <ul
                id={expertiseId}
                className={styles.submenu}
                data-open={expertiseOpen || undefined}
              >
                {disciplines.map((d, index) => {
                  const href = disciplineHref(d.slug);
                  return (
                    <li key={d.slug}>
                      <Link
                        href={href}
                        className={styles.subLink}
                        onClick={close}
                        aria-current={pathname === href ? "page" : undefined}
                      >
                        <span className={styles.subNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.subText}>
                          <span className={styles.subTitle}>{d.title}</span>
                          <span className={styles.subShort}>{d.short}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {rest.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.link}
                  onClick={close}
                  aria-current={currentFor(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className={styles.menuCta}>
              <Button href={contactHref} icon="arrow-up-right" onClick={close}>
                Let&apos;s build
              </Button>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button href={contactHref} icon="arrow-up-right" size="sm" className={styles.cta}>
            Let&apos;s build
          </Button>
          <IconButton
            icon={open ? "close" : "menu"}
            label={open ? "Close menu" : "Open menu"}
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          />
        </div>
      </div>
    </header>
  );
}
