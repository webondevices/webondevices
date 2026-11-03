/* Homepage copy that is list-shaped. Edit here; the page only lays it out. */

export const founderFacts: { value: string; label: string }[] = [
  { value: "30+", label: "commercial web applications built at senior level or above" },
  { value: "~1B", label: "people a year reached by a design system I helped build" },
  { value: "160M", label: "annual visitors through a checkout I co-built for The Times" },
  { value: "2008", label: "the year I started building for the web, and never stopped" },
];

/* A highlight can end in a list of links, such as the press that covered it. */
export const founderHighlights: { text: string; links?: { label: string; href: string }[] }[] = [
  {
    text: "AI smart home featured by",
    links: [
      {
        label: "The Verge",
        href: "https://www.theverge.com/2023/1/19/23562063/gpt3-siri-apple-shortcuts-homekit-demo-voice-assistant-artificial-intelligence",
      },
      { label: "Mashable", href: "https://mashable.com/article/chatgpt-siri-smart-home-assistant" },
      { label: "9to5Mac", href: "https://9to5mac.com/2023/01/19/siri-gpt-3/" },
    ],
  },
  { text: "Author of Introduction to JavaScript Electronics" },
  { text: "Lead and principal engineering consultant since 2016" },
];

/*
 * On wide screens the quotes sit in three columns. A `wide` quote spans two, so
 * pair each one with a short quote to fill its row.
 */
export const testimonials: { quote: string; name: string; role: string; wide?: boolean }[] = [
  {
    quote:
      "Mate delivered top-quality work from day one, guiding and inspiring the team toward coding best practices, testing, and pixel-perfect execution. He collaborated seamlessly with our manufacturing partners in China on low-level firmware challenges. The quality of his work positioned PA strongly with the end client. Mate excelled in client communications, handling presentations and demos with clarity and confidence. More than just a strong engineer, he consistently aligned with business goals, demonstrated exceptional planning and time management, and was always ready to step up and lead.",
    name: "Sanjay V.",
    role: "Product Strategy, Experience & AI Lead, PA Consulting",
    wide: true,
  },
  {
    quote:
      "One of the best developers I have had the pleasure to work with. Pixel perfect in nature, the quality of what he delivers is second to none.",
    name: "James M.",
    role: "Lead Creative Technologist, AnalogFolk",
  },
  {
    quote:
      "His blend of technical expertise and creativity meant he’d always deliver more than expected, to a higher quality than expected, faster than expected.",
    name: "Bobby H.",
    role: "Associate Design Director, W12",
  },
  {
    quote:
      "Mate joined us to help develop an experimental AI solution, and he quickly and efficiently led us through complex challenges. His expertise and innovative mindset truly made him a pleasure to work with.",
    name: "Evan B.",
    role: "Product Design and Strategy, SKR Audio Labs",
  },
  {
    quote:
      "Mate consistently demonstrated exceptional technical expertise and strong leadership skills. His capabilities impressed me so much that I invited him to join a project I was leading, and he delivered outstanding results.",
    name: "Ben B.",
    role: "Technical Lead, Brilliant Basics",
  },
  {
    quote:
      "Mate applies his wealth of deep technical knowledge to development challenges and produces innovative approaches to solving problems.",
    name: "Will S.",
    role: "CTO, Scott Dunn",
  },
  {
    quote:
      "Having worked with Mate on a number of complex AI and tech related projects, he has always been very professional, knowledgeable in a very complex and ever changing market, and has always offered us value for money, been on schedule and on budget.",
    name: "Ian S.",
    role: "Founder, Silverstein Locations",
    wide: true,
  },
];
