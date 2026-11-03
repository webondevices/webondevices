/* Display names for the old blog's lowercase tags. Kept apart from writing.ts, which reads the filesystem, so client components can use it. */
const labels: Record<string, string> = {
  arduino: "Arduino",
  javascript: "JavaScript",
  project: "Projects",
};

export const tagLabel = (tag: string) => labels[tag] ?? tag;
