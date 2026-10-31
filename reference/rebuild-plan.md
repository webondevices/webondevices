# WOD rebuild: implementation plan

Branch: `rebuild/wod-studio`. Inputs: [writing-block.md](writing-block.md) (brief), [logo-sheet.jpg](logo-sheet.jpg), [homepage-look-and-feel.webp](homepage-look-and-feel.webp). Where the brief and the images disagree on visuals, the images win (see [README.md](README.md)).

---

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript**, `output: "export"` | Matches the brief. Static export keeps hosting free and portable. The only server code is one small Worker for the contact form. |
| Styling | **CSS Modules + CSS custom properties** (design tokens in one `tokens.css`) | Brief asks for tokens and restraint. No utility-class soup, no runtime CSS-in-JS. |
| Type | **Inter** via `next/font` (self-hosted, variable), plus a mono for metadata, used sparingly | Mock uses light-weight Inter-style display type. |
| Content | **MDX in the repo** with typed, validated frontmatter (zod) | Your choice. Projects, disciplines and the old posts all live as files. |
| Images | `next/image` in unoptimized mode, with images pre-sized by a small `sharp` build script (AVIF/WebP + widths) | Static export can't use Next's on-demand optimizer. |
| 3D (later) | React Three Fiber, lazy-loaded only on pages that need it | Keeps the base bundle small. |
| Quality | ESLint, Prettier, `tsc`, Playwright smoke tests and an axe accessibility check on key pages | |
| Analytics | **Open decision.** The old `UA-64514566-1` Google Analytics ID has been dead since 2023. | |

### Hosting

**Vercel's free Hobby plan is not allowed for this site.** Hobby is limited to non-commercial personal use, and Vercel counts a business's promotional website as commercial. Using Vercel would mean **Pro at $20/month per seat**.

**Decided: Cloudflare Workers with static assets (free).** One Worker serves the static `out/` build and the single `/api/contact` endpoint.

- Commercial sites are allowed on the free plan. Static asset requests are free and unlimited, and Worker requests are free up to 100,000 a day.
- Each branch gets a preview URL.
- A `_redirects` file handles the 301s from old tag/category URLs.
- The build stays a static export, so the host can still be swapped later.

The DNS for `webondevices.com` moves to Cloudflare at launch, not before. Email Routing needs it there. Copy any existing MX records across first. The domain can stay with its current registrar. The leftover GitHub Pages `CNAME` file is removed at launch.

GitHub Pages (no real redirects or branch previews) and Vercel (Hobby doesn't allow commercial sites, Pro is $20/month) were considered and rejected.

### Contact

**Decided: a contact form that emails you. No chat assistant.** Visitors are meant to contact you directly.

- `/contact/` has a short form: name, email, message, and an optional picker for the four disciplines.
- **Cloudflare Turnstile** (free, usually invisible) stops spam. The page carries the public site key, and the Worker checks the token with the secret key before sending anything.
- The Worker validates the submission and emails it to you with the **Email Routing `send_email` binding**, which sends only to verified addresses. Reply-To is the visitor, so you can just hit Reply. If DNS can't move to Cloudflare, **Resend** (free tier) can send instead.
- A `mailto:` link stays on the page as a fallback.
- "Let's build ↗" and the contact CTA sections all lead to `/contact/`.

An LLM chat assistant was considered and dropped for now. It could be added later as another endpoint on the same Worker.

---

## 2. Visual system (from the mock)

- **Canvas:** soft warm off-white (around `#F4F3F0`), near-black type (around `#111`), mid-grey secondary text.
- **Signature gradient:** soft, blurred **orange** (around `#FF7A3D`) and **teal/cyan** (around `#2BA7C9`) glows. They are used at section level: hero corner, the "approach" band, and the AI discipline card. They are never put on buttons or cards. They are built as layered radial gradients (no images), so they cost nothing to load and can drift slowly where motion is allowed.
- **Type scale:** display headlines are around 64–96px at weight 300–400, with tight tracking (−0.03em). The last line of a heading is set in grey ("working together.", "for a more interesting world."). Eyebrow labels are about 11px uppercase with +0.2em tracking and a short rule after them. Body text is about 15–16px.
- **UI:** pill buttons (solid black "Let's build ↗", outline "View all projects ↗"), circular ↗ icon buttons, hairline dividers, almost no shadows.
- **Layout:** a 12-column grid with max width around 1280px and generous gutters. Image tiles are full-bleed or near-full-bleed. Sections alternate light and dark only where the content earns it.
- **Logo:** traced from `logo-sheet.jpg` into a clean **SVG** (`WodMark`, plus `WodLockup` with the "Web on Devices" subtext). It is solid black or white and uses `currentColor`. The favicon and OG image are generated from it. **Please send the original vector if you have it.** A trace is a stopgap.

Tokens live in `src/styles/tokens.css`: colours, gradient stops, type scale, spacing scale (4px base), radii, motion durations and easing. Reduced-motion turns off gradient drift and reveal animations.

---

## 3. Information architecture and routes

The mock's nav has seven items (Home, Spatial, Hardware, Software, Development, Projects, About). The brief warns against a crowded nav, so the plan follows the brief:

```
/                                   Home
/projects/                          All projects, filterable by discipline + tag
/projects/[slug]/                   Case study
/expertise/                         Four disciplines overview
/expertise/spatial-experiences/
/expertise/hardware-electronics/
/expertise/ai-automation/
/expertise/software-engineering/
/about/
/contact/
/writing/                           Archive index of the old posts (new, low-key)
/[old-post-slug]/                   26 old posts, at their EXISTING URLs
/book/                              JS electronics book page
/download/*.pdf                     Book PDFs, unchanged paths
/posts/*                            Old post images, unchanged paths
```

Nav: **Projects · Expertise (menu with the four disciplines) · About · Contact**, plus a **Let's build ↗** pill. "Writing" goes in the footer only.

Discipline names follow the brief, not the mock: Spatial Experiences, Hardware & Electronics, **AI & Automation**, **Software Engineering**. The mock's "Intelligent Software" and "Full-Stack Development" are older names.

---

## 4. Content model

```
content/
  projects/<slug>.mdx       frontmatter: title, summary, hero (image|video), discipline (primary),
                            disciplines[], tags[], type (client|internal|product|prototype|experiment),
                            status (concept|in-development|completed|live), year, featured, order,
                            links[], related[]
  disciplines/<slug>.mdx    title, tagline, hero, capabilities[], approach, relatedDisciplines[]
  writing/<slug>.mdx        migrated old posts (title, date, slug, tags, cover)
```

- Frontmatter is validated with zod at build time, so a bad field fails the build instead of breaking a page.
- One project file appears under every discipline and tag it lists. Nothing is duplicated.
- MDX components for case studies: `FullBleedImage`, `Gallery`, `Video`, `BeforeAfter`, `Embed`, `ModelViewer` (lazy R3F), `Diagram`, `Code` (Shiki), `Stats`, `Callout`.
- **Placeholder content:** about 4–6 example projects drawn from the brief's table, clearly marked `status: concept` and `draft: true`. Drafts render in dev and are excluded from the production build, so no fake claims go live.

---

## 5. Legacy content: keeping links and SEO alive

There are 33 live URLs today: 26 posts, `/about/`, 3 tag pages, 1 category page and 2 more. Plan:

1. **Migrate all 26 posts** from `content/posts/*` to `content/writing/*.mdx`. Each keeps its exact current URL (`/<kebab-case-title>/`, which is how the old `gatsby-node.js` built them; the title overrides the `slug` field).
2. A **URL parity test** compares the old `docs/**/index.html` list against the new build output and fails if any old post URL disappears.
3. Rewrite absolute `http://www.webondevices.com/posts/...` image URLs to relative `/posts/...`. Keep `static/posts` and `static/download` at the same paths.
4. Posts use a simple **"Writing" article template** in the new header, footer and type. The banner reads "From the Web on Devices archive", with links back to Projects and the book.
5. Old `/tags/*` and `/categories/*` pages get 301s to `/writing/?tag=…` via `_redirects`.
6. Keep a `/rss.xml` for the writing archive so existing subscribers don't break.
7. The book (`HomeBookCard`) moves to a `/book/` page and gets a footer link.
8. Disqus comments are dropped. Old post pages get canonical URLs and an updated `sitemap.xml`.

---

## 6. Repo layout

The Gatsby app is replaced in place on this branch. `docs/` (old build output) is kept until launch as the URL parity source, then removed.

```
reference/            brief, images, this plan
content/              projects/, disciplines/, writing/
public/               fonts (if any), posts/, download/, og images, _redirects
src/
  app/                routes (above)
  components/         Header, Footer, Hero, GradientField, SectionHeading, Eyebrow,
                      PillButton, ArrowButton, DisciplineCard, ProjectCard, ProjectGrid,
                      ProjectFilters, ProjectMeta, CTASection, WodMark, WodLockup, mdx/*
  lib/                content loading + zod schemas, seo helpers
  styles/             tokens.css, globals.css
worker/               Cloudflare Worker: static assets + /api/contact (Turnstile check, send_email)
scripts/              image pipeline, url-parity check
tests/                Playwright smoke + axe
```

---

## 7. Phases and what "done" means

**Phase 1: Foundation**
- Scaffold Next.js/TS, lint, format and the static-export build. Remove Gatsby.
- SVG logo, favicon, tokens, fonts, grid, and the site shell (header with Expertise menu and mobile menu, footer).
- Primitives: PillButton, ArrowButton, Eyebrow, SectionHeading, GradientField.
- *Done when:* `npm run build` produces a static site whose shell matches the mock's header at desktop and 375px, and lint, tsc and axe pass.

**Phase 2: Homepage** (built to the mock)
- Hero (headline, intro, Explore + Contact CTAs, gradient, image), four discipline cards, Selected Projects rail, Approach band, a short expertise section and a contact CTA.
- *Done when:* the home page sits side by side with the mock at 1440px and matches closely, holds up at 375px, scores Lighthouse ≥ 95 for performance and accessibility, and has no layout shift from fonts or images.

**Phase 3: Projects + disciplines**
- Content loader and schemas, `/projects` with discipline and tag filters (client-side and URL-synced), the case study template with MDX components, and the four discipline pages plus `/expertise`.
- *Done when:* adding one `.mdx` file makes a project appear in every listing it belongs to, with no code change.

**Phase 4: Legacy migration**
- The steps in section 5: migrate posts, writing template, `/writing`, `/book`, redirects, RSS, sitemap, URL parity test.
- *Done when:* the parity test passes for all 26 posts and spot-checked posts render cleanly in the new style.

**Phase 5: About, Contact, polish**
- About page, and the Contact page with its form, Turnstile and the `/api/contact` Worker (see Contact in section 1), reveal and hover motion with reduced-motion support, OG images and metadata.

**Phase 6: Launch**
- Cloudflare Worker setup, preview deploy, DNS move to Cloudflare (MX records first), Email Routing and Turnstile keys, a 404 page, Search Console resubmission of the sitemap.

Real project content and photography (the brief's Phase 3) are owned by you and can run in parallel from Phase 3 onward. The site ships with as many real projects as are ready.

---

## 8. Open decisions

Hosting and the contact workflow are settled (section 1).

1. **Contact address:** which email address should enquiries go to?
2. **Analytics:** none, privacy-friendly (Plausible or Cloudflare Web Analytics, which is free), or GA4.
3. **Logo source:** an original SVG, or approval of a trace from the sheet.
4. **Imagery:** the mock's photos are AI renders. Use your real photos where they exist, and gradient-only placeholders elsewhere until real images arrive? (The brief prefers authentic imagery.)
5. **Homepage headline:** the mock's "Software, hardware and intelligence working together." is one of the brief's working options. Use it for now?
6. **Launch projects:** which 3–6 real projects go first?
