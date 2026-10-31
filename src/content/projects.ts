import type { GradientArtName } from "@/components/GradientArt/GradientArt";
import { disciplineSlugs, type DisciplineSlug } from "./disciplines";

/*
 * Every project belongs to exactly one discipline, which decides how its page
 * is laid out: each discipline has its own hero and signature section, fed by
 * that discipline's `details`. Most of these are the brief's example projects,
 * standing in until the real case studies are written.
 */

export type ProjectType = "client" | "internal" | "product" | "prototype" | "experiment";
export type ProjectStatus = "concept" | "in-development" | "completed" | "live";

type Step = { title: string; text: string };
type Figure = { value: string; label: string };

/* Spatial: the capture behind the scene, and how it became an experience. */
export type SpatialDetails = {
  capture: Figure[];
  pipeline: Step[];
};

/* Hardware: a spec sheet, and the system from sensor to screen. */
export type HardwareDetails = {
  specs: { label: string; value: string }[];
  system: Step[];
};

/* AI: what a conversation looks like, and what happens behind it. */
export type AiDetails = {
  conversation: { from: "user" | "assistant"; text: string }[];
  flow: Step[];
};

/* Software: the stack, and the layers of the system. */
export type SoftwareDetails = {
  stack: { group: string; items: string[] }[];
  layers: Step[];
};

type DetailsFor = {
  "spatial-experiences": SpatialDetails;
  "hardware-electronics": HardwareDetails;
  "ai-automation": AiDetails;
  "software-engineering": SoftwareDetails;
};

type ProjectBase = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  art: GradientArtName;
  type: ProjectType;
  status: ProjectStatus;
  year?: string;
  client?: string;
  role?: string;
  /** Shown in the homepage's featured row. */
  featured?: boolean;
  /** The case study. Without it, the page shows the summary only. */
  overview?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  results?: Figure[];
  /** Stand-ins for photography and video until real media arrives. */
  gallery?: { art: GradientArtName; caption: string }[];
  links?: { label: string; href: string }[];
};

/* A project, with `details` typed by its discipline. */
export type Project = {
  [D in DisciplineSlug]: ProjectBase & { discipline: D; details?: DetailsFor[D] };
}[DisciplineSlug];

export const projectTypeLabels: Record<ProjectType, string> = {
  client: "Client project",
  internal: "Internal project",
  product: "Product",
  prototype: "Prototype",
  experiment: "Experiment",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  concept: "Concept",
  "in-development": "In development",
  completed: "Completed",
  live: "Live",
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
    type: "prototype",
    status: "in-development",
    overview:
      "A country house and its grounds, captured from the air and on foot, then rebuilt as a photorealistic scene that anyone can walk through in a browser, with no app or headset needed.",
    challenge:
      "Photos and floor plans don't give buyers a feel for a large property. Traditional 3D tours look synthetic and struggle with gardens, glass and fine detail.",
    solution:
      "Drone and ground capture reconstructed with Gaussian splatting, which keeps real lighting and texture. The scene is optimised to stream on the web, with guided stops and free exploration.",
    outcome:
      "A walkthrough that feels like being there, ready to embed in a listing page or share as a link.",
    details: {
      capture: [
        { value: "Drone + ground", label: "Capture" },
        { value: "Gaussian splats", label: "Reconstruction" },
        { value: "Browser", label: "Runs in" },
        { value: "Inside + out", label: "Coverage" },
      ],
      pipeline: [
        { title: "Capture", text: "Aerial passes for the grounds, then room-by-room capture on foot." },
        { title: "Reconstruct", text: "Train Gaussian splats, then clean up floaters and stray points." },
        { title: "Optimise", text: "Compress and split the scene so it streams quickly on any device." },
        { title: "Present", text: "Add guided stops, hotspots and a simple floor-plan navigator." },
      ],
    },
    gallery: [
      { art: "spatial", caption: "Aerial capture of the house and grounds" },
      { art: "horizon", caption: "Reconstructed scene in the browser" },
    ],
  },
  {
    slug: "3d-product-viewer",
    title: "3D product viewer",
    discipline: "spatial-experiences",
    summary: "A configurable 3D product presentation for an online shop.",
    tags: ["Commerce", "Three.js"],
    art: "horizon",
    type: "client",
    status: "concept",
  },
  {
    slug: "farm-monitor",
    title: "AI-enabled farm monitor",
    discipline: "hardware-electronics",
    summary: "Solar-powered sensors and cameras that watch crops and livestock remotely.",
    tags: ["Sensors", "AI", "IoT"],
    art: "hardware",
    featured: true,
    type: "prototype",
    status: "in-development",
    overview:
      "Self-contained monitoring stations that sit in a field for months, measuring conditions and spotting problems with on-device computer vision, then reporting back over long-range radio.",
    challenge:
      "Remote fields have no mains power and patchy mobile signal, and checking them in person takes hours a week.",
    solution:
      "Low-power boards with solar charging, environmental sensors and a camera running a small vision model at the edge. Only results and alerts are sent, so the battery lasts.",
    outcome:
      "Conditions and alerts on a phone, without driving out to check.",
    details: {
      specs: [
        { label: "Controller", value: "ESP32 + edge AI module" },
        { label: "Power", value: "Solar, LiPo battery" },
        { label: "Sensors", value: "Soil moisture, temperature, humidity, light" },
        { label: "Vision", value: "Camera with on-device detection" },
        { label: "Connectivity", value: "LoRa to a farm gateway" },
        { label: "Enclosure", value: "3D-printed, weatherproofed" },
      ],
      system: [
        { title: "Sense", text: "Sensors and camera sample on a schedule, then sleep." },
        { title: "Decide", text: "The device runs detection locally and keeps only what matters." },
        { title: "Send", text: "Readings and alerts travel over LoRa to a gateway on the farm." },
        { title: "Act", text: "A dashboard shows trends and sends alerts to a phone." },
      ],
    },
    gallery: [
      { art: "hardware", caption: "Monitoring station in the field" },
      { art: "dusk", caption: "Bench prototype and enclosure" },
    ],
  },
  {
    slug: "digital-pos-installation",
    title: "Digital POS installation",
    discipline: "hardware-electronics",
    summary: "An interactive in-store touchscreen display with custom hardware.",
    tags: ["Touchscreen", "Software"],
    art: "dusk",
    type: "client",
    status: "concept",
  },
  {
    slug: "bettersearch",
    title: "BetterSearch, AI-powered search",
    discipline: "ai-automation",
    summary: "Preference-driven search that understands what people mean, not just what they type.",
    tags: ["AI", "Search", "Product"],
    art: "ai",
    featured: true,
    type: "product",
    status: "in-development",
    overview:
      "A search engine that starts from what people want rather than from keywords. You describe what matters to you, and it finds, ranks and explains the best matches.",
    challenge:
      "Filters and keyword search make people translate their needs into the site's categories. Most give up or settle for the first page of results.",
    solution:
      "A language model turns a plain description into structured preferences, searches the catalogue, and explains why each result fits. The same engine powers vertical products such as CarSearch and CareerSearch.",
    outcome:
      "Shorter searches, and results people understand and trust.",
    details: {
      conversation: [
        {
          from: "user",
          text: "A small family car, good on fuel, easy to park in town, under £15k.",
        },
        {
          from: "assistant",
          text: "Here are three hatchbacks that fit. The first is the most economical and has parking sensors as standard.",
        },
        { from: "user", text: "Which has the biggest boot?" },
        {
          from: "assistant",
          text: "The second one, by about 60 litres. It's still under budget.",
        },
      ],
      flow: [
        { title: "Understand", text: "Turn a plain description into structured preferences." },
        { title: "Search", text: "Query the catalogue and score every candidate against them." },
        { title: "Explain", text: "Rank the results and say why each one fits." },
        { title: "Refine", text: "Follow-up questions adjust the preferences, not the keywords." },
      ],
    },
  },
  {
    slug: "ai-smart-home",
    title: "AI smart home assistant",
    discipline: "ai-automation",
    summary: "A conversational assistant controlling a whole HomeKit home, covered by The Verge.",
    tags: ["LLM", "Voice", "HomeKit"],
    art: "horizon",
    type: "experiment",
    status: "completed",
  },
  {
    slug: "ai-voice-receptionist",
    title: "AI voice receptionist",
    discipline: "ai-automation",
    summary: "A telephone agent that answers, books and routes calls around the clock.",
    tags: ["Voice", "Telephony", "AWS"],
    art: "dusk",
    type: "product",
    status: "concept",
  },
  {
    slug: "react-component-library",
    title: "React component library",
    discipline: "software-engineering",
    summary: "An accessible, themeable component library and design system for a product team.",
    tags: ["UI", "Design Systems"],
    art: "software",
    featured: true,
    type: "client",
    status: "completed",
    overview:
      "A shared component library and design system that lets several product teams build consistent, accessible screens quickly, from one source of truth.",
    challenge:
      "Each team had built its own buttons, forms and layouts. The products looked different, accessibility was patchy, and every change had to be made several times.",
    solution:
      "Design tokens feed a typed React component library, documented in Storybook and tested for accessibility on every change. Teams install it as a package and theme it per product.",
    outcome:
      "One consistent look across products, and new screens built from tested parts.",
    details: {
      stack: [
        { group: "Components", items: ["React", "TypeScript", "CSS Modules"] },
        { group: "Design", items: ["Design tokens", "Figma", "Theming"] },
        { group: "Quality", items: ["Storybook", "Testing Library", "axe", "Visual regression"] },
        { group: "Delivery", items: ["Monorepo", "CI/CD", "Versioned releases"] },
      ],
      layers: [
        { title: "Tokens", text: "Colour, type, spacing and motion, defined once and themed per product." },
        { title: "Primitives", text: "Accessible building blocks: buttons, inputs, layout and typography." },
        { title: "Patterns", text: "Forms, navigation, tables and dialogs assembled from the primitives." },
        { title: "Products", text: "Each team installs the package and builds screens from tested parts." },
      ],
    },
    gallery: [
      { art: "software", caption: "Component documentation" },
      { art: "horizon", caption: "Themes for two products" },
    ],
  },
  {
    slug: "white-blood-cell-game",
    title: "White blood cell strategy game",
    discipline: "software-engineering",
    summary: "An educational real-time strategy game set inside the immune system.",
    tags: ["Games", "Simulation"],
    art: "dusk",
    type: "experiment",
    status: "concept",
  },
];

/* One per discipline, in the disciplines' order. */
export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => disciplineSlugs.indexOf(a.discipline) - disciplineSlugs.indexOf(b.discipline));

export const projectsFor = (slug: DisciplineSlug) => projects.filter((p) => p.discipline === slug);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectHref = (slug: string) => `/projects/${slug}/`;
