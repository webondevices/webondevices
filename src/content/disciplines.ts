import type { GradientArtName } from "@/components/GradientArt/GradientArt";

/* The four disciplines. Each gets a page at /expertise/[slug]/, and every project belongs to one. */

export const disciplineSlugs = [
  "software-engineering",
  "ai-automation",
  "spatial-experiences",
  "hardware-electronics",
] as const;

export type DisciplineSlug = (typeof disciplineSlugs)[number];

export type Discipline = {
  slug: DisciplineSlug;
  title: string;
  /** The title split over two lines, so the homepage tiles line up. */
  titleLines: [string, string];
  /** One line for tiles, menus and the footer. */
  short: string;
  art: GradientArtName;
  /** The page's headline, from the brief's positioning line. */
  headline: string;
  intro: string;
  capabilities: string[];
  approach: { title: string; text: string }[];
  experience: { title: string; text: string }[];
};

export const disciplines: Discipline[] = [
  {
    slug: "software-engineering",
    title: "Software Engineering",
    titleLines: ["Software", "Engineering"],
    short: "Web applications, interfaces and scalable systems.",
    art: "software",
    headline: "Robust, polished digital products, from interface to infrastructure.",
    intro:
      "The professional core behind everything else. We architect and build fast, accessible web applications and the design systems behind them, for teams that need them to last.",
    capabilities: [
      "Full-stack application development",
      "React, Next.js and TypeScript",
      "Front-end architecture",
      "Backend services, APIs and cloud integrations",
      "Design systems and component libraries",
      "Accessible, responsive interfaces",
      "Interactive applications and simulations",
      "Technical consultancy and team leadership",
      "Modernising existing platforms",
    ],
    approach: [
      {
        title: "Architect",
        text: "Set up foundations that scale with the team: structure, data flow, testing and tooling.",
      },
      {
        title: "Systemise",
        text: "Build the design system and component library first, so every screen is consistent and accessible.",
      },
      {
        title: "Build",
        text: "Ship features in small, tested steps with React, Next.js and TypeScript.",
      },
      {
        title: "Scale",
        text: "Keep it fast and maintainable: CI/CD, Core Web Vitals, monitoring and clear documentation.",
      },
    ],
    experience: [
      {
        title: "30+ commercial applications",
        text: "Built at senior level or above, across media, telecom, education, retail, travel and finance.",
      },
      {
        title: "~1B users a year",
        text: "Helped build a media group's design system, used across its whole organisation.",
      },
      {
        title: "160M visitors a year",
        text: "Co-built The Times checkout, with a focus on accessibility and full test coverage.",
      },
      {
        title: "90+ Lighthouse scores",
        text: "Led the green-field rebuild of a luxury travel company's website.",
      },
    ],
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    titleLines: ["AI &", "Automation"],
    short: "AI applications, automations and smart solutions.",
    art: "ai",
    headline: "AI and automation that make complicated processes simpler.",
    intro:
      "Practical applications and working products, not AI for its own sake. We build assistants, search and automations that plug into the systems you already use and save real time.",
    capabilities: [
      "AI agents and assistants",
      "AI-powered search and recommendations",
      "AI voice receptionists and telephone agents",
      "Conversational interfaces",
      "AI video chat and dynamic avatars",
      "Workflow and business process automation",
      "Document and data processing",
      "Integrations between existing systems",
      "Decision-support tools",
    ],
    approach: [
      {
        title: "Find the job",
        text: "Start from a process that costs time or money, not from a model, and agree what success looks like.",
      },
      {
        title: "Prove it",
        text: "Build a working prototype with your real data in days, so you can judge it on results.",
      },
      {
        title: "Integrate",
        text: "Connect it to your phone lines, inboxes, databases and tools, so it fits how your team works.",
      },
      {
        title: "Harden",
        text: "Add evaluation, guardrails, cost control and monitoring before it handles real customers.",
      },
    ],
    experience: [
      {
        title: "Featured by The Verge",
        text: "An AI smart home assistant covered by The Verge, Mashable, 9to5Mac and Unbox Therapy.",
      },
      {
        title: "Voice and chat assistants",
        text: "LLM voice and chat assistants, RAG search and dozens of proofs of concept since 2023.",
      },
      {
        title: "AI-first engineering",
        text: "Introduced spec-driven, agentic development workflows to a financial services engineering team.",
      },
      {
        title: "Automation that saves hours",
        text: "Custom scripts that saved 300 hours of work in a CMS migration for a global company.",
      },
    ],
  },
  {
    slug: "spatial-experiences",
    title: "Spatial Experiences",
    titleLines: ["Spatial", "Experiences"],
    short: "3D capture, digital twins and immersive visualisation.",
    art: "spatial",
    headline: "Real places and objects, turned into interactive digital experiences.",
    intro:
      "We capture buildings, rooms and products in 3D, then build them into experiences people can explore in a browser or a headset. From a single product viewer to a full property walkthrough.",
    capabilities: [
      "Gaussian splatting and photorealistic 3D reconstruction",
      "Interior and exterior 3D property scanning",
      "Drone capture and aerial imaging",
      "Photogrammetry",
      "Digital property walkthroughs and virtual tours",
      "Interactive property websites",
      "3D product presentations and configurators",
      "Virtual staging and digital twins",
      "WebGL, Three.js and WebXR experiences",
    ],
    approach: [
      {
        title: "Capture",
        text: "Scan the space or object with drones, cameras and photogrammetry, planned around how it will be viewed.",
      },
      {
        title: "Reconstruct",
        text: "Turn the capture into Gaussian splats or meshes, cleaned up and optimised to load fast on the web.",
      },
      {
        title: "Build",
        text: "Design the experience around it: tours, hotspots, configurators or a full interactive site.",
      },
      {
        title: "Publish",
        text: "Ship it to any device, embedded in your site or hosted on its own, and keep it up to date.",
      },
    ],
    experience: [
      {
        title: "WebGL, Three.js and WebXR",
        text: "Interactive 3D and immersive experiences built for the browser and for headsets.",
      },
      {
        title: "Colour and product visualisers",
        text: "Built a paint customiser and an experimental colour visualiser for a major paint brand.",
      },
      {
        title: "Animated, scroll-driven sites",
        text: "Highly animated landing pages, promotions and data visualisations for well-known brands.",
      },
      {
        title: "Hands-on capture",
        text: "Years of 3D scanning and printing, from small objects to whole rooms.",
      },
    ],
  },
  {
    slug: "hardware-electronics",
    title: "Hardware & Electronics",
    titleLines: ["Hardware &", "Electronics"],
    short: "Connected devices, sensors and real-world systems.",
    art: "hardware",
    headline: "Bringing intelligence and connectivity into the physical world.",
    intro:
      "Real devices, real sensors, real installations. We design and build electronics that measure, monitor and respond to the world around them, and the software that makes them useful.",
    capabilities: [
      "Custom electronics and prototyping",
      "Arduino, ESP32 and Raspberry Pi applications",
      "Sensors, instrumentation and data logging",
      "IoT devices and remote monitoring",
      "Environmental and agricultural monitoring",
      "Edge AI and computer vision",
      "Smart home and building automation",
      "Robotics and physical computing",
      "Interactive kiosks, POS and digital signage",
      "3D-printed enclosures and prototypes",
    ],
    approach: [
      {
        title: "Prototype",
        text: "Get from idea to a working proof on the bench quickly, to test what matters before spending on production.",
      },
      {
        title: "Design",
        text: "Choose the right boards and sensors, then design the circuit and a 3D-printed enclosure around them.",
      },
      {
        title: "Connect",
        text: "Write the firmware, get the data off the device and into dashboards, alerts and other systems.",
      },
      {
        title: "Deploy",
        text: "Install in the field, update remotely and monitor it, so it keeps working long after launch.",
      },
    ],
    experience: [
      {
        title: "Published author",
        text: "Wrote Introduction to JavaScript Electronics, a book on building with Arduino, sensors and JavaScript.",
      },
      {
        title: "Device software over USB and serial",
        text: "Lead architect on a desktop app that talks to gaming peripherals over USB/HID and serial.",
      },
      {
        title: "Smart homes and automation",
        text: "HomeKit smart homes and home automation built end to end, hardware included.",
      },
      {
        title: "Robots, drones and RC",
        text: "A long habit of building physical computing projects, from RC cars to drones and robots.",
      },
    ],
  },
];

export function getDiscipline(slug: DisciplineSlug) {
  const discipline = disciplines.find((d) => d.slug === slug);
  if (!discipline) throw new Error(`Unknown discipline: ${slug}`);
  return discipline;
}

export const disciplineHref = (slug: DisciplineSlug) => `/expertise/${slug}/`;
