import type { Metadata } from "next";
import { AdaLogs } from "./AdaLogs";

/*
 * Ada's live log: her stream of consciousness and her chat, side by side. The data comes from
 * /api/ada-logs, which scripts/publish-ada-logs.ts keeps up to date from the running brain.
 */

export const metadata: Metadata = {
  title: "Ada's live log",
  description: "The stream of consciousness and chat of Ada, an AI mind running live, updated every couple of minutes.",
};

export default function AdaLogsPage() {
  return <AdaLogs />;
}
