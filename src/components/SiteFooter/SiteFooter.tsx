import Link from "next/link";
import { Typography } from "@/components/Typography/Typography";
import { WodLogo } from "@/components/WodLogo/WodLogo";
import { disciplineHref, disciplines } from "@/content/disciplines";
import { mainNav, site } from "@/lib/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    // The footer is always dark, so it scopes the dark role tokens to itself.
    <footer className={styles.footer} data-theme="dark">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <WodLogo variant="lockup" height={61} title="Web on Devices" />
          <Typography variant="body-sm">
            A creative technology studio building spatial experiences, connected hardware, AI and
            software.
          </Typography>
        </div>

        <nav className={styles.columns} aria-label="Footer">
          <div className={styles.column}>
            <Typography variant="eyebrow" as="h2">
              Expertise
            </Typography>
            <ul>
              {disciplines.map((d) => (
                <li key={d.slug}>
                  <Link href={disciplineHref(d.slug)}>{d.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.column}>
            <Typography variant="eyebrow" as="h2">
              Studio
            </Typography>
            <ul>
              {mainNav
                .filter((item) => item.href !== "/")
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className={styles.column}>
            <Typography variant="eyebrow" as="h2">
              Connect
            </Typography>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              {site.social.map((link) => (
                <li key={link.href}>
                  <a href={link.href} rel="noreferrer" target="_blank">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className={styles.bottom}>
          <Typography variant="caption">
            © {new Date().getFullYear()} Web on Devices Ltd · {site.location}
          </Typography>
        </div>
      </div>
    </footer>
  );
}
