import { useEffect, useRef, useState } from 'react'
import * as pc from 'playcanvas'
import { createCameraRig } from './cameraRig'
import { GRADE_COLORS, GRADE_FLOATS, gradeGLSL, hexToRgb } from './grade'
import { HOTSPOTS } from './hotspots'
import { zoneLine } from './mobile'
import { CONTROLS } from './settings'
import { stage } from './store'

const FLOATS = [...GRADE_FLOATS, 'splatScale']
const uname = (k) => `uGrade_${k}`

/** Colour grade + splat size as a PlayCanvas work-buffer modifier. */
const MODIFIER_GLSL = `
${FLOATS.map((k) => `uniform float ${uname(k)};`).join('\n')}
${GRADE_COLORS.map((k) => `uniform vec3 ${uname(k)};`).join('\n')}

void modifySplatCenter(inout vec3 center) {}

void modifySplatRotationScale(vec3 originalCenter, vec3 modifiedCenter, inout vec4 rotation, inout vec3 scale) {
  scale *= ${uname('splatScale')};
}

void modifySplatColor(vec3 center, inout vec4 color) {
  vec3 c = color.rgb;
  float a = color.a;
  ${gradeGLSL(uname)}
  color = vec4(c, a);
}
`

/** Height of the roll pivot: the shoe rolls about its own middle, not the sole. */
const PIVOT_Y = 0.1

function applyGrade(s, gsplat) {
  if (!gsplat) return
  FLOATS.forEach((k) => gsplat.setParameter(uname(k), s[k]))
  GRADE_COLORS.forEach((k) => gsplat.setParameter(uname(k), hexToRgb(s[k])))
  gsplat.workBufferUpdate = pc.WORKBUFFER_UPDATE_ONCE
}

/** True when any CameraFrame effect is switched on (tone mapping works without it). */
function needsFrame(s) {
  return (
    s.sharpness > 0 || s.taa || s.bloomIntensity > 0 || s.gradingEnabled || s.enhanceEnabled ||
    s.vignetteIntensity > 0 || s.fringing > 0 || s.dofEnabled
  )
}

function applyScene(s, app, camera, frame) {
  const gp = app.scene.gsplat
  for (const c of CONTROLS) if (c.target === 'gsplat') gp[c.key] = s[c.key]
  gp.sceneDepthWrite = !!s.dofEnabled
  camera.camera.fov = s.fov
  camera.camera.toneMapping = s.toneMapping
  if (!frame) return
  // CameraFrame's HDR compose doesn't keep colour/alpha consistent for faint
  // splats over a transparent canvas — only route through it when needed.
  frame.enabled = s.postFx && needsFrame(s)
  frame.rendering.toneMapping = s.toneMapping
  frame.rendering.sharpness = s.sharpness
  frame.rendering.sceneDepthMap = !!s.dofEnabled
  frame.taa.enabled = s.taa
  frame.bloom.intensity = s.bloomIntensity
  frame.bloom.blurLevel = s.bloomBlurLevel
  Object.assign(frame.grading, {
    enabled: s.gradingEnabled,
    brightness: s.gradingBrightness,
    contrast: s.gradingContrast,
    saturation: s.gradingSaturation,
  })
  frame.grading.tint = new pc.Color(...hexToRgb(s.gradingTint), 1)
  Object.assign(frame.colorEnhance, {
    enabled: s.enhanceEnabled,
    shadows: s.enhanceShadows,
    midtones: s.enhanceMidtones,
    highlights: s.enhanceHighlights,
    vibrance: s.enhanceVibrance,
    dehaze: s.enhanceDehaze,
  })
  Object.assign(frame.vignette, {
    intensity: s.vignetteIntensity,
    inner: s.vignetteInner,
    outer: s.vignetteOuter,
    curvature: s.vignetteCurvature,
  })
  frame.fringing.intensity = s.fringing
  Object.assign(frame.dof, {
    enabled: s.dofEnabled,
    focusDistance: s.dofFocusDistance,
    focusRange: s.dofFocusRange,
    blurRadius: s.dofBlurRadius,
    nearBlur: s.dofNearBlur,
  })
  frame.update()
}

/* ---------- screen projection helpers (respect the off-axis projection) ---------- */
const _vp = new pc.Mat4()
const _v4 = new pc.Vec4()
function project(p, w, h, out) {
  _v4.set(p.x, p.y, p.z, 1)
  _vp.transformVec4(_v4, _v4)
  if (_v4.w <= 0) return null
  out.x = (_v4.x / _v4.w * 0.5 + 0.5) * w
  out.y = (1 - (_v4.y / _v4.w * 0.5 + 0.5)) * h
  return out
}

/**
 * The shoe on a fixed, transparent PlayCanvas canvas behind the page.
 * Node tree: spin (yaw) → roll (about the shoe's long axis) → holder → splat.
 */
export default function ShoeStage({ src, onLoaded, settings }) {
  const mountRef = useRef(null)
  const shadowRef = useRef(null)
  const ctxRef = useRef(null)
  const shoeRef = useRef(null)
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  // ---- app, camera, post FX, render loop (once) ----
  useEffect(() => {
    const mount = mountRef.current
    const canvas = document.createElement('canvas')
    mount.appendChild(canvas)

    const app = new pc.Application(canvas, {
      graphicsDeviceOptions: { alpha: true, antialias: false, deviceTypes: [pc.DEVICETYPE_WEBGL2] },
    })
    app.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio, 2)
    app.setCanvasFillMode(pc.FILLMODE_NONE)
    app.setCanvasResolution(pc.RESOLUTION_AUTO)

    const camera = new pc.Entity('camera')
    camera.addComponent('camera', {
      clearColor: new pc.Color(0, 0, 0, 0),
      fov: 30,
      nearClip: 0.01,
      farClip: 20,
    })
    app.root.addChild(camera)

    const spin = new pc.Entity('spin')
    const roll = new pc.Entity('roll')
    roll.setLocalPosition(0, PIVOT_Y, 0)
    const holder = new pc.Entity('holder')
    holder.setLocalPosition(0, -PIVOT_Y, 0)
    app.root.addChild(spin)
    spin.addChild(roll)
    roll.addChild(holder)

    const frame = new pc.CameraFrame(app, camera.camera)
    // Default HDR target has no alpha (black background). Keep alpha.
    frame.rendering.renderFormats = [pc.PIXELFORMAT_RGBA16F, pc.PIXELFORMAT_RGBA32F]

    let w = 0, h = 0
    const resize = () => {
      w = mount.clientWidth
      h = mount.clientHeight
      app.resizeCanvas(w, h)
      // phone layout: CSS positions the copy and the veil from the same line
      document.documentElement.style.setProperty('--zone', `${zoneLine(h)}px`)
    }
    resize()
    window.addEventListener('resize', resize)

    // Off-axis projection: shift/lift move the image without changing perspective.
    const rig = createCameraRig()
    let pose = rig.update(w, h, 0, settingsRef.current)
    camera.camera.calculateProjection = (mat) => {
      const cam = camera.camera
      mat.setPerspective(cam.fov, w / h, cam.nearClip, cam.farClip)
      mat.data[8] -= 2 * pose.shift
      mat.data[9] -= 2 * pose.lift
    }

    const target = new pc.Vec3()
    const pw = new pc.Vec3()
    const nw = new pc.Vec3()
    const toCam = new pc.Vec3()
    const sp = { x: 0, y: 0 }
    const tmp = new pc.Vec3()
    const local = new pc.Vec3()
    const pts = [[0, 0], [0.215, 0], [-0.215, 0], [0, 0.115], [0, -0.115]].map(() => ({ x: 0, y: 0 }))

    app.on('update', (dt) => {
      const s = settingsRef.current
      pose = rig.update(w, h, Math.min(dt, 0.1), s)
      camera.setPosition(pose.pos[0], pose.pos[1], pose.pos[2])
      camera.lookAt(target.set(pose.target[0], pose.target[1], pose.target[2]))
      spin.setLocalEulerAngles(0, pose.spin, 0)
      roll.setLocalEulerAngles(pose.roll, 0, 0)
      if (import.meta.env.DEV) window.__pose = pose
    })
    if (import.meta.env.DEV) window.__app = app

    // DOM overlays after the camera matrices are final for this frame
    app.on('postrender', () => {
      const s = settingsRef.current
      const cam = camera.camera
      _vp.mul2(cam.projectionMatrix, cam.viewMatrix)
      const m = holder.getWorldTransform()
      const camPos = camera.getPosition()

      // hotspots
      const showAll = stage.explore || s.debugHotspots
      for (const hs of HOTSPOTS) {
        const el = stage.hotspotEls.get(hs.id)
        if (!el) continue
        const wanted = showAll || (stage.focus && stage.focus.includes(hs.id))
        let best = -1, bx = 0, by = 0
        if (wanted && shoeRef.current) {
          hs.at.forEach((a, i) => {
            m.transformPoint(local.set(a[0], a[1], a[2]), pw)
            m.transformVector(local.set(...hs.normal[i]), nw).normalize()
            const facing = nw.dot(toCam.sub2(camPos, pw).normalize())
            if (facing > best && project(pw, w, h, sp)) {
              best = facing; bx = sp.x; by = sp.y
            }
          })
        }
        const on = best > (s.debugHotspots ? -2 : 0.12)
        el.classList.toggle('is-on', on)
        if (on) el.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`
      }

      // ground shadow: an ellipse fitted to the projected footprint
      const sh = shadowRef.current
      if (sh) {
        const fade = Math.max(0, 1 - Math.abs(pose.roll) / 35)
        const op = s.shadow && shoeRef.current ? fade : 0
        sh.style.opacity = op.toFixed(3)
        if (op > 0) {
          const foot = [[0, 0], [0.215, 0], [-0.215, 0], [0, 0.115], [0, -0.115]]
          let ok = true
          foot.forEach(([x, z], i) => {
            m.transformPoint(tmp.set(x, 0, z), pw)
            if (!project(pw, w, h, pts[i])) ok = false
          })
          if (ok) {
            const [c, px, nx, pz, nz] = pts
            const ax = (px.x - nx.x) / 2, ay = (px.y - nx.y) / 2
            const bx2 = (pz.x - nz.x) / 2, by2 = (pz.y - nz.y) / 2
            // element is 200×200 centred on the origin → scale by 1/100
            sh.style.transform = `matrix(${ax / 100}, ${ay / 100}, ${bx2 / 100}, ${by2 / 100}, ${c.x}, ${c.y})`
          }
        }
      }
    })

    app.start()
    ctxRef.current = { app, camera, frame, holder }
    applyScene(settingsRef.current, app, camera, frame)
    setReady(true)

    return () => {
      window.removeEventListener('resize', resize)
      ctxRef.current = null
      shoeRef.current = null
      frame.destroy()
      app.destroy()
      canvas.remove()
    }
  }, [])

  // ---- the shoe (swapped when src changes) ----
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ready || !ctx || !src) return
    const { app, holder } = ctx
    let cancelled = false
    setLoading(true)
    const t0 = performance.now()

    const asset = new pc.Asset(`shoe:${src}`, 'gsplat', { url: src })
    app.assets.add(asset)
    asset.ready(() => {
      if (cancelled) return
      const loadMs = Math.round(performance.now() - t0)
      const shoe = new pc.Entity('shoe')
      shoe.addComponent('gsplat', { asset })
      shoe.gsplat.setWorkBufferModifier({ glsl: MODIFIER_GLSL })
      applyGrade(settingsRef.current, shoe.gsplat)
      holder.children.slice().forEach((old) => old.destroy())
      holder.addChild(shoe)
      shoeRef.current = shoe
      setLoading(false)
      onLoaded?.(loadMs)
    })
    app.assets.load(asset)

    return () => {
      cancelled = true
      // keep the old shoe on screen until the next one is ready
      if (!asset.loaded && app.assets) app.assets.remove(asset)
    }
  }, [src, ready])

  // ---- live settings ----
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    applyScene(settings, ctx.app, ctx.camera, ctx.frame)
    applyGrade(settings, shoeRef.current?.gsplat)
  }, [settings])

  return (
    <>
      <div ref={shadowRef} className="stage__shadow" />
      <div ref={mountRef} className="stage__canvas" />
      <div className={`stage__loading ${loading ? 'is-on' : ''}`}>
        <span className="stage__spinner" /> Loading MH500 3D
      </div>
    </>
  )
}
