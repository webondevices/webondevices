import { Typography } from "@/components/Typography/Typography";
import type { AiDetails } from "@/content/projects";
import shared from "./hero.module.css";
import styles from "./ai.module.css";

/* An example conversation beside the steps that happen behind each reply. */
export function AiSignature({ details }: { details: AiDetails }) {
  return (
    <section className={styles.signature} aria-labelledby="flow-title">
      <div className={`${shared.container} ${styles.grid}`}>
        <figure className={styles.chat}>
          <figcaption className={styles.chatBar}>
            <span className={styles.liveDot} aria-hidden />
            <Typography variant="caption" as="span" tone="muted">
              Example conversation
            </Typography>
          </figcaption>
          <ol className={styles.messages}>
            {details.conversation.map((message, index) => (
              <li key={index} className={styles.message} data-from={message.from}>
                <span className="visually-hidden">
                  {message.from === "user" ? "Visitor: " : "Assistant: "}
                </span>
                <Typography variant="body-sm" as="span">
                  {message.text}
                </Typography>
              </li>
            ))}
          </ol>
        </figure>

        <div>
          <div className={shared.sectionTitle}>
            <Typography variant="eyebrow" rule>
              Behind each answer
            </Typography>
            <Typography variant="display" as="h2" id="flow-title">
              How it works
            </Typography>
          </div>
          <ol className={styles.flow}>
            {details.flow.map((step, index) => (
              <li key={step.title} className={styles.flowStep}>
                <span className={styles.flowNumber} aria-hidden>
                  {index + 1}
                </span>
                <div className={styles.flowText}>
                  <Typography variant="heading-4" as="h3">
                    {step.title}
                  </Typography>
                  <Typography variant="body-sm" tone="muted">
                    {step.text}
                  </Typography>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
