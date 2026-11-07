/**
 * Hotspot anchors in shoe-local metres, measured from orthographic renders of
 * the capture with a 2 cm grid (see README). Each feature may have mirrored
 * anchors on both sides of the foot; the one facing the camera wins, and a
 * hotspot hides when every anchor faces away (so nothing floats over the
 * wrong side of the shoe).
 *
 *  at     – [[x, y, z], ...] candidate positions on the surface
 *  normal – [[x, y, z], ...] outward surface normal per candidate
 */
export const HOTSPOTS = [
  {
    id: 'lacing',
    label: 'Quick-lace system',
    title: 'Locks in, lets go fast',
    body: 'Hard-wearing round laces run through wide webbing loops that glide as you pull, so the boot snugs evenly from toe to ankle in seconds.',
    at: [[0.035, 0.135, 0]],
    normal: [[0.35, 1, 0]],
  },
  {
    id: 'tongue',
    label: 'Gusseted tongue',
    title: 'Keeps grit out',
    body: 'The tongue is stitched to the upper along its sides, so trail grit and water can’t slip in through the lacing. The pull loop helps you slide it on.',
    at: [[-0.045, 0.205, 0]],
    normal: [[0.6, 0.8, 0]],
  },
  {
    id: 'upper',
    label: 'Waterproof upper',
    title: 'Dry feet, all day',
    body: 'A nubuck leather upper over a waterproof, breathable membrane keeps rain and puddles out and lets sweat escape.',
    at: [[0.085, 0.075, 0.056], [0.085, 0.075, -0.056]],
    normal: [[0.1, 0.1, 1], [0.1, 0.1, -1]],
  },
  {
    id: 'collar',
    label: 'Padded collar',
    title: 'Soft around the ankle',
    body: 'A thickly padded, soft-touch collar cushions the ankle bone and stops rubbing on long descents.',
    at: [[-0.105, 0.15, 0.046], [-0.105, 0.15, -0.046]],
    normal: [[0, 0.3, 1], [0, 0.3, -1]],
  },
  {
    id: 'heel',
    label: 'Heel counter',
    title: 'A heel that holds',
    body: 'A stiff, moulded heel counter wraps the back of the foot to stop it sliding and steady each step on rough ground.',
    at: [[-0.13, 0.07, 0.05], [-0.13, 0.07, -0.05]],
    normal: [[-0.3, 0, 1], [-0.3, 0, -1]],
  },
  {
    id: 'pull',
    label: 'Heel pull loop',
    title: 'On in a second',
    body: 'A sturdy rear loop makes the boot easy to pull on, even with cold fingers.',
    at: [[-0.152, 0.198, 0]],
    normal: [[-1, 0.2, 0]],
  },
  {
    id: 'toe',
    label: 'Toe bumper',
    title: 'Kicks back at rocks',
    body: 'A rubber toe cap and stone guard wrap the front of the boot to protect your toes from roots and rocks.',
    at: [[0.178, 0.045, 0]],
    normal: [[1, 0.25, 0]],
  },
  {
    id: 'midsole',
    label: 'EVA midsole',
    title: 'Cushioning that lasts',
    body: 'A thick EVA foam midsole absorbs impact on every step, so you finish long days feeling fresher.',
    at: [[0.02, 0.035, 0.064], [0.02, 0.035, -0.064]],
    normal: [[0, 0, 1], [0, 0, -1]],
  },
  {
    id: 'outsole',
    label: 'Outsole',
    title: 'Grip on mixed terrain',
    body: 'Deep lugs in a grippy rubber compound bite into dirt, gravel and rock, and shed mud as you walk.',
    at: [[0.08, 0.0, 0]],
    normal: [[0, -1, 0]],
  },
]
