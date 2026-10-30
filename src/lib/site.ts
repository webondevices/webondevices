/* Site-wide links and contact details, shared by the header, footer and contact form. */

export const site = {
  name: "Web on Devices",
  email: "webondevices@gmail.com",
  location: "St Albans, UK",
  social: [
    { label: "GitHub", href: "https://github.com/webondevices" },
    { label: "X / Twitter", href: "https://twitter.com/web_on_devices" },
  ],
} as const;

/*
 * The header adds the Expertise menu (the four discipline pages) after Home.
 * Until the projects and about pages exist, those links point at homepage sections.
 */
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const contactHref = "/#contact";
