/**
 * Tiny shared state between the DOM sections and the render loop. Mutated
 * directly every frame (no React re-renders); sections that need to react
 * subscribe to named events.
 */
export const stage = {
  /** Explore section is on screen: drag orbits the shoe, hotspots show. */
  explore: false,
  /** Hotspot ids to highlight outside Explore (the feature tour's current one). */
  focus: null,
  /** User orbit from dragging, degrees. Eases back to 0 outside Explore. */
  userYaw: 0,
  userPitch: 0,
  /** Where Explore wants the orbit to glide to (null = free drag). */
  yawGoal: null,
  pitchGoal: null,
  /** Hero turntable angle (deg), its drag fling velocity (deg/s) and the
   *  time (performance.now) before which the idle spin stays paused. */
  heroYaw: 0,
  heroVel: 0,
  heroHold: 0,
  /** Hotspot DOM elements by id (registered by <Hotspots />). */
  hotspotEls: new Map(),
  shadowEl: null,
}

const listeners = new Map()
export const on = (ev, fn) => {
  if (!listeners.has(ev)) listeners.set(ev, new Set())
  listeners.get(ev).add(fn)
  return () => listeners.get(ev).delete(fn)
}
export const emit = (ev, data) => listeners.get(ev)?.forEach((fn) => fn(data))
