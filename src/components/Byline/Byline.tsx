import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/Typography/Typography";
import { author } from "@/lib/site";
import styles from "./Byline.module.css";

/** Who made it: the author's portrait, name and role, linking to the about section. */
export function Byline() {
  return (
    <Link href="/#about" className={styles.byline}>
      <Image src={author.portrait} alt="" width={96} height={96} />
      <span className={styles.text}>
        <Typography variant="body-sm" as="span" className={styles.name}>
          {author.name}
        </Typography>
        <Typography variant="caption" as="span">
          {author.role}
        </Typography>
      </span>
    </Link>
  );
}
