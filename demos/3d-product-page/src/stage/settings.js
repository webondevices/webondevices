import { GRADE_GROUPS, buildSchema } from './grade'

/**
 * The page's look: colour grade (work-buffer modifier) + PlayCanvas splat
 * params (app.scene.gsplat) + CameraFrame post-processing, all fixed at their
 * tuned defaults. target: 'grade' (default) | 'gsplat' | 'frame' | 'motion'
 */

/** SOG (WebP-packed) with SH3 view-dependent colour, 7.4 MB. */
export const SPLAT_URL = `${import.meta.env.BASE_URL}shoe.sog`

const TONEMAPS = [
  [0, 'Linear'], [1, 'Filmic'], [2, 'Hejl'], [3, 'ACES'], [4, 'ACES 2'], [5, 'Neutral'], [6, 'None'],
]

export const GROUPS = [
  ...GRADE_GROUPS,
  {
    title: 'Splats',
    controls: [
      { key: 'opacity', label: 'Opacity', min: 0, max: 2, step: 0.01, def: 1 },
      { key: 'splatScale', label: 'Splat size', min: 0.2, max: 2.5, step: 0.01, def: 1 },
    ],
  },
  {
    title: 'PlayCanvas splats',
    controls: [
      { key: 'alphaClipForward', label: 'Alpha cutoff', min: 0, max: 0.3, step: 0.001, def: 1 / 255, target: 'gsplat' },
      { key: 'minPixelSize', label: 'Min pixel size', min: 0, max: 8, step: 0.1, def: 2, target: 'gsplat' },
      { key: 'minContribution', label: 'Min contribution', min: 0, max: 20, step: 0.1, def: 3, target: 'gsplat' },
      { key: 'antiAlias', label: 'Anti-alias (Mip-Splatting)', type: 'toggle', def: false, target: 'gsplat' },
      { key: 'radialSorting', label: 'Radial sort', type: 'toggle', def: false, target: 'gsplat' },
      // PlayCanvas caches view-dependent (SH) colour and only refreshes it after
      // the camera has turned this many degrees (engine default 10) — that shows
      // as lighting "jumps" while the shoe spins. 0 = refresh on every move.
      { key: 'colorUpdateAngle', label: 'SH refresh angle (°)', min: 0, max: 15, step: 0.5, def: 0, target: 'gsplat' },
    ],
  },
  {
    title: 'Motion',
    note: 'Scroll-driven camera and the hero turntable.',
    controls: [
      { key: 'idleSpin', label: 'Hero spin (°/s)', min: 0, max: 90, step: 1, def: 16, target: 'motion' },
      { key: 'damping', label: 'Camera smoothing', min: 0.02, max: 0.4, step: 0.01, def: 0.08, target: 'motion' },
      { key: 'fov', label: 'Field of view (°)', min: 15, max: 60, step: 1, def: 30, target: 'motion' },
      { key: 'shadow', label: 'Ground shadow', type: 'toggle', def: true, target: 'motion' },
      { key: 'debugHotspots', label: 'Show all hotspot anchors', type: 'toggle', def: false, target: 'motion' },
    ],
  },
  {
    title: 'Camera post FX',
    note: 'PlayCanvas CameraFrame — screen-space effects applied after the splats render.',
    controls: [
      { key: 'postFx', label: 'Enable post FX', type: 'toggle', def: false, target: 'frame' },
      { key: 'toneMapping', label: 'Tone mapping', type: 'select', options: TONEMAPS, def: 0, target: 'frame' },
      { key: 'sharpness', label: 'Sharpen', min: 0, max: 1, step: 0.01, def: 0, target: 'frame' },
      { key: 'taa', label: 'TAA', type: 'toggle', def: false, target: 'frame' },
    ],
  },
  {
    title: 'Bloom',
    controls: [
      { key: 'bloomIntensity', label: 'Intensity', min: 0, max: 0.2, step: 0.001, def: 0, target: 'frame' },
      { key: 'bloomBlurLevel', label: 'Blur level', min: 1, max: 16, step: 1, def: 16, target: 'frame' },
    ],
  },
  {
    title: 'Grading (screen)',
    controls: [
      { key: 'gradingEnabled', label: 'Enable', type: 'toggle', def: false, target: 'frame' },
      { key: 'gradingBrightness', label: 'Brightness', min: 0, max: 3, step: 0.01, def: 1, target: 'frame' },
      { key: 'gradingContrast', label: 'Contrast', min: 0, max: 3, step: 0.01, def: 1, target: 'frame' },
      { key: 'gradingSaturation', label: 'Saturation', min: 0, max: 3, step: 0.01, def: 1, target: 'frame' },
      { key: 'gradingTint', label: 'Tint', type: 'color', def: '#ffffff', target: 'frame' },
    ],
  },
  {
    title: 'Colour enhance',
    controls: [
      { key: 'enhanceEnabled', label: 'Enable', type: 'toggle', def: false, target: 'frame' },
      { key: 'enhanceShadows', label: 'Shadows', min: -1, max: 1, step: 0.01, def: 0, target: 'frame' },
      { key: 'enhanceMidtones', label: 'Midtones', min: -1, max: 1, step: 0.01, def: 0, target: 'frame' },
      { key: 'enhanceHighlights', label: 'Highlights', min: -1, max: 1, step: 0.01, def: 0, target: 'frame' },
      { key: 'enhanceVibrance', label: 'Vibrance', min: -1, max: 1, step: 0.01, def: 0, target: 'frame' },
      { key: 'enhanceDehaze', label: 'Dehaze', min: -1, max: 1, step: 0.01, def: 0, target: 'frame' },
    ],
  },
  {
    title: 'Lens',
    controls: [
      { key: 'vignetteIntensity', label: 'Vignette', min: 0, max: 1, step: 0.01, def: 0, target: 'frame' },
      { key: 'vignetteInner', label: 'Vignette inner', min: 0, max: 1, step: 0.01, def: 0.5, target: 'frame' },
      { key: 'vignetteOuter', label: 'Vignette outer', min: 0, max: 2, step: 0.01, def: 1, target: 'frame' },
      { key: 'vignetteCurvature', label: 'Vignette curvature', min: 0.1, max: 5, step: 0.01, def: 0.5, target: 'frame' },
      { key: 'fringing', label: 'Chromatic fringing', min: 0, max: 50, step: 0.5, def: 0, target: 'frame' },
    ],
  },
  {
    title: 'Depth of field',
    controls: [
      { key: 'dofEnabled', label: 'Enable', type: 'toggle', def: false, target: 'frame' },
      { key: 'dofFocusDistance', label: 'Focus distance', min: 0.1, max: 3, step: 0.01, def: 0.8, target: 'frame' },
      { key: 'dofFocusRange', label: 'Focus range', min: 0, max: 1, step: 0.01, def: 0.15, target: 'frame' },
      { key: 'dofBlurRadius', label: 'Blur radius', min: 0, max: 10, step: 0.1, def: 3, target: 'frame' },
      { key: 'dofNearBlur', label: 'Near blur', type: 'toggle', def: false, target: 'frame' },
    ],
  },
]

/** Tuned look for this capture (overrides the neutral schema defaults). */
const LOOK = {
  contrast: 1.04,
  saturation: 1.05,
  vibrance: 0.1,
}

const schema = buildSchema(GROUPS)
export const CONTROLS = schema.controls
export const DEFAULTS = { ...schema.defaults, ...LOOK }
