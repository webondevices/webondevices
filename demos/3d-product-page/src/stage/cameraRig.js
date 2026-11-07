import { SHOTS } from './shots'
import { stage } from './store'
import { BAND_TOP, MOBILE_MAX, zoneLine } from './mobile'

/**
 * Scroll camera + shoe turntable. Each frame call `update(w, h, dt, opts)`
 * and apply the returned pose:
 *   pos / target – camera, world space
 *   shift / lift – screen offset of the image as a fraction of width / height
 *                  (apply as an off-axis projection so perspective is kept)
 *   spin / roll  – shoe yaw / roll in degrees
 *
 * Keyframes come from the DOM: every element with data-shot="<name>" is a
 * keyframe at its document y, optionally with data-spin="<deg>".
 */
const lerp = (a, b, t) => a + (b - a) * t
const lerp3 = (a, b, t, out) => {
  for (let i = 0; i < 3; i++) out[i] = lerp(a[i], b[i], t)
  return out
}
const ease = (t) => t * t * (3 - 2 * t)
const clamp01 = (t) => Math.min(1, Math.max(0, t))

function readKeyframes() {
  const y0 = window.scrollY
  const keys = [...document.querySelectorAll('[data-shot]')]
    .map((el) => ({
      y: el.getBoundingClientRect().top + y0,
      shot: SHOTS[el.dataset.shot],
      spin: el.dataset.spin,
    }))
    .filter((k) => k.shot)
    .sort((a, b) => a.y - b.y)

  // Resolve spin: an explicit data-spin is literal (so 0 → 360 is a full
  // turn); otherwise the shot's spin is unwrapped to the nearest equivalent
  // of the previous keyframe, so the shoe never unwinds a turn it just made.
  let prev = 0
  for (const k of keys) {
    if (k.spin != null) {
      k.spin = Number(k.spin)
      k.literal = true
    } else {
      const s = k.shot.spin ?? 0
      k.spin = s + 360 * Math.round((prev - s) / 360)
    }
    prev = k.spin
  }
  return keys
}

export function createCameraRig() {
  const want = { pos: [0, 0, 0], target: [0, 0, 0], shift: 0, lift: 0, spin: 0, roll: 0 }
  const cur = { ...want, pos: [0, 0, 0], target: [0, 0, 0] }
  let first = true
  let keys = []
  let keysAt = -1

  const computeWanted = (w, h, dt, idleSpeed, fov) => {
    const now = performance.now()
    if (now - keysAt > 500 || !keys.length) {
      keys = readKeyframes()
      keysAt = now
    }
    if (!keys.length) return
    const y = window.scrollY
    let i = 0
    while (i < keys.length - 1 && y >= keys[i + 1].y) i++
    const a = keys[i]
    const b = keys[Math.min(i + 1, keys.length - 1)]
    const span = b.y - a.y || 1
    const raw = clamp01((y - a.y) / span)
    const t = ease(raw)

    lerp3(a.shot.pos, b.shot.pos, t, want.pos)
    lerp3(a.shot.target, b.shot.target, t, want.target)
    want.roll = lerp(a.shot.roll ?? 0, b.shot.roll ?? 0, t)

    // Hero turntable. heroYaw is the boot's own angle at the top of the page
    // (idle spin + drag; a flick coasts with heroVel and the idle spin waits
    // until heroHold). Scrolling away blends it out *with the scroll*, by the
    // shortest way round, so the boot never spins a full turn on its own —
    // and scrolling back up returns it to the angle you left it at.
    const atTop = y < h * 0.05
    if (atTop) {
      if (stage.heroVel) {
        stage.heroYaw += stage.heroVel * dt
        stage.heroVel *= Math.pow(0.04, dt)
        if (Math.abs(stage.heroVel) < 2) stage.heroVel = 0
      }
      if (idleSpeed > 0 && now >= stage.heroHold) stage.heroYaw += idleSpeed * dt
      // keep it in (−180, 180] (invisible here: whole turns, applied to the
      // smoothed pose too) so the blend below is always the short way
      const wrapped = stage.heroYaw - 360 * Math.round(stage.heroYaw / 360)
      cur.spin += wrapped - stage.heroYaw
      stage.heroYaw = wrapped
    } else {
      stage.heroVel = 0
      stage.heroHold = 0
    }
    const heroWeight = 1 - ease(clamp01((y - h * 0.05) / (h * 0.55)))
    const idle = stage.heroYaw * heroWeight
    want.spin = lerp(a.spin, b.spin, a.literal && b.literal ? raw : t) + idle

    // Drag-to-orbit (Explore). Outside it, ease back to the nearest full turn.
    const k = Math.min(1, dt * 3.5)
    if (!stage.explore) {
      const home = 360 * Math.round(stage.userYaw / 360)
      stage.userYaw = lerp(stage.userYaw, home, k)
      stage.userPitch = lerp(stage.userPitch, 0, k)
    } else {
      if (stage.yawGoal != null) stage.userYaw = lerp(stage.userYaw, stage.yawGoal, k)
      if (stage.pitchGoal != null) stage.userPitch = lerp(stage.userPitch, stage.pitchGoal, k)
    }
    want.spin += stage.userYaw
    if (stage.userPitch) {
      // orbit the camera up/down around the target
      const dx = want.pos[0] - want.target[0]
      const dy = want.pos[1] - want.target[1]
      const dz = want.pos[2] - want.target[2]
      const r = Math.hypot(dx, dy, dz)
      const flat = Math.hypot(dx, dz)
      const el = Math.max(-1.2, Math.min(1.35, Math.atan2(dy, flat) + (stage.userPitch * Math.PI) / 180))
      want.pos[0] = want.target[0] + (dx / flat) * Math.cos(el) * r
      want.pos[2] = want.target[2] + (dz / flat) * Math.cos(el) * r
      want.pos[1] = want.target[1] + Math.sin(el) * r
    }

    // Phones: centre the boot in the band under the nav (BAND_TOP → zone
    // line) and pull back so each shot's framing fits that band — the copy
    // lives below the zone line.
    const mobile = w < MOBILE_MAX
    want.shift = mobile ? 0 : lerp(a.shot.shift, b.shot.shift, t)
    if (mobile) {
      const zone = zoneLine(h)
      const band = Math.max(120, zone - BAND_TOP)
      want.lift = (h / 2 - (BAND_TOP + zone) / 2) / h
      // Pull back (never in) until the boot fits the band's height and the
      // phone's width: half-extents of ~0.15 m vertical and ~0.2 m across
      // cover it from any of the shots' angles.
      const tanV = Math.tan(((fov / 2) * Math.PI) / 180)
      const tanBand = (tanV * band) / h
      const tanW = (tanV * w) / h
      const dx = want.pos[0] - want.target[0]
      const dy = want.pos[1] - want.target[1]
      const dz = want.pos[2] - want.target[2]
      const d = Math.hypot(dx, dy, dz)
      const k = Math.max(d, 0.15 / tanBand, 0.2 / tanW) / d
      want.pos[0] = want.target[0] + dx * k
      want.pos[1] = want.target[1] + dy * k
      want.pos[2] = want.target[2] + dz * k
    } else {
      want.lift = lerp(a.shot.lift ?? 0, b.shot.lift ?? 0, t)
    }
  }

  return {
    update(w, h, dt, { damping = 0.08, idleSpin = 16, fov = 30 } = {}) {
      // a hidden/background tab can report a 0×0 viewport; skip until sized,
      // otherwise NaN gets into the smoothed pose and never leaves
      if (!(w > 0 && h > 0)) return cur
      computeWanted(w, h, dt, idleSpin, fov)
      if (!Number.isFinite(cur.pos[0] + cur.spin + cur.shift)) first = true
      // frame-rate independent smoothing (damping is "per 60 fps frame")
      const d = first ? 1 : 1 - Math.pow(1 - damping, dt * 60)
      first = false
      lerp3(cur.pos, want.pos, d, cur.pos)
      lerp3(cur.target, want.target, d, cur.target)
      for (const k of ['shift', 'lift', 'spin', 'roll']) cur[k] = lerp(cur[k], want[k], d)
      return cur
    },
  }
}
