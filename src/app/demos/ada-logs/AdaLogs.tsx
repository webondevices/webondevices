"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./logs.module.css";

type Thought = { at: number; text: string; kind: string | null; feeling: string | null };
type Message = { at: number; from: string; to: string | null; text: string; ada: boolean };
type Logs = { updatedAt: number; thoughts: Thought[]; chat: Message[] };

const POLL_MS = 120_000;

const time = (at: number) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(at);

/* A scrollable column that stays pinned to the newest entry, unless you've scrolled up to read. */
function Column({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  useLayoutEffect(() => {
    if (pinned.current && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [count]);
  return (
    <section className={styles.column}>
      <h2>{title}</h2>
      <div
        ref={ref}
        className={styles.scroll}
        onScroll={(e) => {
          const el = e.currentTarget;
          pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
      >
        {children}
      </div>
    </section>
  );
}

export function AdaLogs() {
  const [logs, setLogs] = useState<Logs | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const res = await fetch("/api/ada-logs", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as Logs;
        if (stop) return;
        setLogs(next);
        setFailed(false);
      } catch {
        if (!stop) setFailed(true);
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  return (
    <main className={styles.page}>
      <p className={styles.status} aria-live="polite">
        {logs ? `Updated ${time(logs.updatedAt)}` : failed ? "Couldn’t load the log" : "Loading…"}
      </p>
      <div className={styles.columns}>
        <Column title="Stream of consciousness" count={logs?.thoughts.length ?? 0}>
          {logs?.thoughts.map((t, i) => (
            <p key={`${t.at}-${i}`} className={styles.thought}>
              <span className={styles.meta}>
                {time(t.at)}
                {t.feeling && ` · ${t.feeling}`}
              </span>
              {t.text}
            </p>
          ))}
        </Column>
        <Column title="Chat" count={logs?.chat.length ?? 0}>
          {logs?.chat.map((m, i) => (
            <p key={`${m.at}-${i}`} className={m.ada ? `${styles.message} ${styles.ada}` : styles.message}>
              <span className={styles.meta}>
                {time(m.at)} · {m.from}
                {m.ada && m.to && m.to !== "everyone" && ` → ${m.to}`}
              </span>
              {m.text}
            </p>
          ))}
        </Column>
      </div>
    </main>
  );
}
