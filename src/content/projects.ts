import type { GradientArtName } from "@/components/GradientArt/GradientArt";
import { disciplineSlugs, type DisciplineSlug } from "./disciplines";

/*
 * Every project belongs to exactly one discipline. Most of these are the
 * brief's example projects, standing in until the real case studies are written.
 */
export type Project = {
  slug: string;
  title: string;
  discipline: DisciplineSlug;
  summary: string;
  tags: string[];
  art: GradientArtName;
  /** Shown in the homepage's featured row. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "interactive-property-showcase",
    title: "Interactive property showcase",
    discipline: "spatial-experiences",
    summary: "A Gaussian-splat walkthrough of a country house, explorable in the browser.",
    tags: ["Gaussian Splatting", "WebGL"],
    art: "spatial",
    featured: true,
  },
  {
    slug: "3d-product-viewer",
    title: "3D product viewer",
    discipline: "spatial-experiences",
    summary: "A configurable 3D product presentation for an online shop.",
    tags: ["Commerce", "Three.js"],
    art: "horizon",
  },
  {
    slug: "farm-monitor",
    title: "AI-enabled farm monitor",
    discipline: "hardware-electronics",
    summary: "Solar-powered sensors and cameras that watch crops and livestock remotely.",
    tags: ["Sensors", "AI", "IoT"],
    art: "hardware",
    featured: true,
  },
  {
    slug: "digital-pos-installation",
    title: "Digital POS installation",
    discipline: "hardware-electronics",
    summary: "An interactive in-store touchscreen display with custom hardware.",
    tags: ["Touchscreen", "Software"],
    art: "dusk",
  },
  {
    slug: "bettersearch",
    title: "BetterSearch, AI-powered search",
    discipline: "ai-automation",
    summary: "Preference-driven search that understands what people mean, not just what they type.",
    tags: ["AI", "Search", "Product"],
    art: "ai",
    featured: true,
  },
  {
    slug: "ai-smart-home",
    title: "AI smart home assistant",
    discipline: "ai-automation",
    summary: "A conversational assistant controlling a whole HomeKit home, covered by The Verge.",
    tags: ["LLM", "Voice", "HomeKit"],
    art: "horizon",
  },
  {
    slug: "ai-voice-receptionist",
    title: "AI voice receptionist",
    discipline: "ai-automation",
    summary: "A telephone agent that answers, books and routes calls around the clock.",
    tags: ["Voice", "Telephony", "AWS"],
    art: "dusk",
  },
  {
    slug: "react-component-library",
    title: "React component library",
    discipline: "software-engineering",
    summary: "An accessible, themeable component library and design system for a product team.",
    tags: ["UI", "Design Systems"],
    art: "software",
    featured: true,
  },
  {
    slug: "white-blood-cell-game",
    title: "White blood cell strategy game",
    discipline: "software-engineering",
    summary: "An educational real-time strategy game set inside the immune system.",
    tags: ["Games", "Simulation"],
    art: "dusk",
  },
];

/* One per discipline, in the disciplines' order. */
export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => disciplineSlugs.indexOf(a.discipline) - disciplineSlugs.indexOf(b.discipline));

export const projectsFor = (slug: DisciplineSlug) => projects.filter((p) => p.discipline === slug);
