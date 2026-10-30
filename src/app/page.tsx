import { Button } from "@/components/Button/Button";
import { Typography } from "@/components/Typography/Typography";
import { WodLogo } from "@/components/WodLogo/WodLogo";
import styles from "./page.module.css";

/* Placeholder until the homepage is built (Phase 2). */
export default function HomePage() {
  return (
    <main className={styles.main}>
      <WodLogo variant="lockup" height={120} />
      <Typography variant="body-lg">The new Web on Devices site is under construction.</Typography>
      <Button variant="secondary" icon="arrow-right" href="/brand/">
        Brand preview
      </Button>
    </main>
  );
}
