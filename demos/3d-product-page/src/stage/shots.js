/**
 * Named camera shots. Shoe frame (metres, baked into every splat file):
 *   +x toe, −x heel, +y up (sole on y = 0), z across the foot.
 *   Length 0.37, height 0.23, width 0.18.
 *
 *  pos / target – camera position and look-at point
 *  shift        – horizontal screen offset as a fraction of viewport width
 *                 (+ moves the shoe right). Ignored below 820px.
 *  spin         – shoe yaw in degrees (turntable). A marker can override it
 *                 with data-spin to drive a literal turn (e.g. 0 → 360).
 *  lift         – vertical screen offset (+ up), desktop. Default 0.
 *  (Phones ignore shift/lift: the boot is centred in the top band — see
 *  mobile.js.)
 *  roll         – shoe roll about its long axis in degrees (−90 shows the sole
 *                 to a camera on +z).
 *
 * The DOM decides when each shot is used: any element with data-shot="<name>"
 * is a keyframe at its scroll position (see cameraRig). Two consecutive
 * markers with the same shot = a hold.
 */
export const SHOTS = {
  hero: { pos: [0.5, 0.3, 0.78], target: [0, 0.09, 0], shift: -0.19 },


  // Feature tour (pinned)
  lacing: { pos: [0.28, 0.46, 0.34], target: [0.02, 0.13, 0], shift: -0.2 },
  upper: { pos: [0.22, 0.17, 0.62], target: [0.05, 0.09, 0], shift: -0.2 },
  heel: { pos: [-0.52, 0.24, 0.36], target: [-0.08, 0.11, 0], shift: -0.2 },
  toe: { pos: [0.62, 0.24, 0.44], target: [0.08, 0.07, 0], shift: -0.21 },
  midsole: { pos: [0.12, 0.06, 0.84], target: [0.0, 0.07, 0], shift: -0.22 },

  // Sole: the shoe rolls over to show its outsole, then we push in on the lugs
  sole: { pos: [0.02, 0.1, 0.82], target: [0, 0.1, 0], shift: 0.2, roll: -100 },
  lugs: { pos: [-0.04, 0.17, 0.6], target: [-0.09, 0.1, 0.1], shift: 0.22, roll: -100 },

  explore: { pos: [0.45, 0.32, 0.8], target: [0, 0.09, 0], shift: 0 },

  // same three-quarter front view as the hero, mirrored to the right
  buy: { pos: [0.57, 0.33, 0.89], target: [0, 0.09, 0], shift: 0.2 },
}
