# Quechua MH500 Mid — 3D product page

Scroll-driven product page for a Gaussian-splat capture of a Quechua hiking
boot, rendered with **PlayCanvas only** (no three.js / Spark).

```bash
npm install
npm run dev          # http://localhost:5174/demos/3d-product-page/
```

## Story

| Section  | What the shoe does |
|----------|--------------------|
| Hero     | Idle turntable; drag to spin — it holds where you leave it, then resumes after 8 s |
| Features | Pinned tour: lacing → heel → upper → midsole, each with its hotspots |
| Grip     | The boot rolls over to show the outsole, then pushes in on the lugs |
| Explore  | Drag to orbit; every hotspot is live; part chips rotate the boot to face you |
| Specs    | Settles beside the spec table and buy box |

Camera shots live in `src/stage/shots.js`; the DOM places them (`data-shot`
markers, see `src/stage/cameraRig.js`).

## Hotspots

Anchors in `src/stage/hotspots.js` are in shoe-local metres, measured from
orthographic renders of the capture on a 2 cm grid. Each frame they are
projected through the real (off-axis) camera matrix, so they stay glued to the
surface while the shoe spins. A hotspot hides when its surface normal faces
away from the camera, and mirrored features (upper, collar, heel counter,
midsole) pick whichever side is visible.

## On webondevices.com

Served at `/demos/3d-product-page/`, with the write-up at
`/projects/3d-product-page/`. `npm run build` here (or `npm run build` in the
site root, which runs it first) writes into the site's `public/demos/`.

The page loads one splat: `public/shoe.sog` (SOG, 7.4 MB, SH3). The other
formats and the splat settings panel live in the original POC in
`~/POC_apps/3d-sites/quechua`.

## Credit

3D capture “QUECHUA - Webviewer” by Christoph Schindelar
(https://superspl.at/scene/f83d530f), licensed CC BY 4.0. Credited in the page
footer.
