/**
 * Per-splat colour grade, run as GLSL inside PlayCanvas' gsplat work-buffer
 * modifier. `u(key)` names the uniform for a given setting.
 */
export const GRADE_FLOATS = [
  'exposure', 'brightness', 'contrast', 'saturation', 'vibrance', 'hue',
  'temperature', 'tint', 'gamma', 'toneAmount', 'toneBalance', 'opacity',
]
export const GRADE_COLORS = ['shadowTone', 'highlightTone']

/** GLSL statements that grade `vec3 c` and `float a` in place. */
export const gradeGLSL = (u) => `
  {
    const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
    // white balance
    c *= vec3(1.0 + ${u('temperature')} * 0.25, 1.0 + ${u('tint')} * 0.2, 1.0 - ${u('temperature')} * 0.25);
    // exposure (stops) + brightness offset
    c = c * exp2(${u('exposure')}) + ${u('brightness')};
    // contrast around mid grey
    c = (c - 0.5) * ${u('contrast')} + 0.5;
    // hue rotation around the grey axis
    float hr = radians(${u('hue')});
    vec3 k = vec3(0.57735);
    c = c * cos(hr) + cross(k, c) * sin(hr) + k * dot(k, c) * (1.0 - cos(hr));
    // saturation + vibrance (boosts muted colours more)
    float l = dot(c, LUMA);
    float chroma = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
    c = mix(vec3(l), c, ${u('saturation')} * (1.0 + ${u('vibrance')} * (1.0 - clamp(chroma, 0.0, 1.0))));
    // split toning, luminance preserving
    l = dot(c, LUMA);
    float w = smoothstep(0.0, 1.0, clamp(l + ${u('toneBalance')}, 0.0, 1.0));
    vec3 tone = mix(${u('shadowTone')}, ${u('highlightTone')}, w);
    c = mix(c, c * tone / max(dot(tone, LUMA), 1e-3), ${u('toneAmount')});
    // gamma
    c = pow(max(c, 0.0), vec3(1.0 / max(${u('gamma')}, 0.01)));
    a *= ${u('opacity')};
  }
`

export const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/* ---------- panel schema ---------- */

export const GRADE_GROUPS = [
  {
    title: 'Light',
    controls: [
      { key: 'exposure', label: 'Exposure', min: -3, max: 3, step: 0.05, def: 0, unit: 'EV' },
      { key: 'brightness', label: 'Brightness', min: -0.5, max: 0.5, step: 0.01, def: 0 },
      { key: 'contrast', label: 'Contrast', min: 0, max: 2.5, step: 0.01, def: 1 },
      { key: 'gamma', label: 'Gamma', min: 0.3, max: 2.5, step: 0.01, def: 1 },
    ],
  },
  {
    title: 'Colour',
    controls: [
      { key: 'saturation', label: 'Saturation', min: 0, max: 2.5, step: 0.01, def: 1 },
      { key: 'vibrance', label: 'Vibrance', min: -1, max: 2, step: 0.01, def: 0 },
      { key: 'hue', label: 'Hue shift', min: -180, max: 180, step: 1, def: 0, unit: '°' },
      { key: 'temperature', label: 'Temperature', min: -1, max: 1, step: 0.01, def: 0 },
      { key: 'tint', label: 'Tint', min: -1, max: 1, step: 0.01, def: 0 },
    ],
  },
  {
    title: 'Colour tone',
    controls: [
      { key: 'toneAmount', label: 'Split-tone amount', min: 0, max: 1, step: 0.01, def: 0 },
      { key: 'toneBalance', label: 'Balance', min: -0.5, max: 0.5, step: 0.01, def: 0 },
      { key: 'shadowTone', label: 'Shadows', type: 'color', def: '#3fa8b8' },
      { key: 'highlightTone', label: 'Highlights', type: 'color', def: '#ffc89a' },
    ],
  },
]

/** Filter presets built from the grade alone. */
export const GRADE_PRESETS = {
  Original: {},
  Studio: { exposure: 0.15, contrast: 1.12, saturation: 0.9, temperature: -0.08 },
  Alpine: {
    contrast: 1.1, saturation: 0.9, temperature: -0.2, toneAmount: 0.35,
    shadowTone: '#3a5f8f', highlightTone: '#f4f8ff', exposure: 0.08,
  },
  Cinematic: {
    contrast: 1.2, saturation: 0.9, toneAmount: 0.55, toneBalance: -0.05,
    shadowTone: '#2a8f9e', highlightTone: '#ffb27a', gamma: 0.95,
  },
  Noir: { saturation: 0, contrast: 1.45, exposure: -0.1, gamma: 0.9 },
  'Golden hour': { temperature: 0.35, saturation: 1.1, exposure: 0.1 },
  Vintage: {
    saturation: 0.6, contrast: 0.85, brightness: 0.04, toneAmount: 0.4,
    shadowTone: '#5a6f8a', highlightTone: '#f2d8a7', temperature: 0.15,
  },
}

/** Flatten groups → controls (default target 'grade') and defaults. */
export function buildSchema(groups) {
  const controls = groups.flatMap((g) => g.controls).map((c) => ({ target: 'grade', ...c }))
  const defaults = Object.fromEntries(controls.map((c) => [c.key, c.def]))
  return { controls, defaults }
}
