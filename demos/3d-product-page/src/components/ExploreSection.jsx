import { useEffect, useRef, useState } from 'react'
import { HOTSPOTS } from '../stage/hotspots'
import { SHOTS } from '../stage/shots'
import { emit, on, stage } from '../stage/store'
import { Close, Drag, Rotate } from './Icons'

const TRACK = 0.9 // hold distance, viewport heights
const DEG = 180 / Math.PI

/** Shoe yaw (deg) that turns a hotspot's normal towards the Explore camera. */
function yawToFace(h) {
  const { pos, target } = SHOTS.explore
  const cam = Math.atan2(pos[0] - target[0], pos[2] - target[2])
  const [nx, , nz] = h.normal[0]
  if (Math.hypot(nx, nz) < 0.2) return null // points up/down: no yaw helps
  return (cam - Math.atan2(nx, nz)) * DEG
}

export default function ExploreSection() {
  const ref = useRef(null)
  const [selected, setSelected] = useState(null)
  const [active, setActive] = useState(false)
  const drag = useRef(null)
  const h = HOTSPOTS.find((x) => x.id === selected)

  useEffect(() => on('select', setSelected), [])

  // Active while the pinned stage is on screen
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const p = (window.scrollY - el.offsetTop) / window.innerHeight
      const now = p > -0.25 && p < TRACK + 0.3
      if (now !== stage.explore) {
        stage.explore = now
        emit('explore', now)
        setActive(now)
        if (!now) {
          stage.yawGoal = stage.pitchGoal = null
          emit('select', null)
        }
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      stage.explore = false
    }
  }, [])

  function select(id) {
    emit('select', id)
    const hs = HOTSPOTS.find((x) => x.id === id)
    const yaw = yawToFace(hs)
    if (yaw != null) {
      // nearest equivalent angle to where the user has it now
      stage.yawGoal = yaw + 360 * Math.round((stage.userYaw - yaw) / 360)
      stage.pitchGoal = hs.normal[0][1] > 0.6 ? 20 : 0
    } else {
      stage.pitchGoal = hs.normal[0][1] < 0 ? -55 : 30
    }
  }
  // the + markers on the boot route through the same path as the chips
  const selectRef = useRef(select)
  selectRef.current = select
  useEffect(() => on('pick', (id) => selectRef.current(id)), [])

  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, touch: e.pointerType === 'touch' }
    stage.yawGoal = stage.pitchGoal = null
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) > 4) {
      d.moved = true
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    d.x = e.clientX
    d.y = e.clientY
    stage.userYaw += dx * 0.45
    if (!d.touch) stage.userPitch = Math.max(-60, Math.min(45, stage.userPitch + dy * 0.25))
  }
  const onUp = () => (drag.current = null)

  const reset = () => {
    emit('select', null)
    stage.yawGoal = 360 * Math.round(stage.userYaw / 360)
    stage.pitchGoal = 0
  }

  return (
    <section id="explore" ref={ref} className="explore" style={{ height: `${100 + TRACK * 100}vh` }}>
      <span className="marker" data-shot="explore" style={{ top: 0 }} />
      <span className="marker" data-shot="explore" style={{ top: `${TRACK * 100}vh` }} />

      <div className="explore__pin">
        <div
          className={`explore__drag ${active ? 'is-on' : ''}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-hidden="true"
        />

        <div className="container explore__grid">
          <div className="explore__copy">
            <p className="eyebrow eyebrow--accent">Explore in 3D</p>
            <h2 className="h2">Take a closer look.</h2>
            <p className="lead">
              Drag to turn the boot. Tap a <span className="inline-plus">+</span> or a
              part below to jump straight to it.
            </p>
            <div className="chips chips--light">
              {HOTSPOTS.map((x) => (
                <button key={x.id} className={`chip ${selected === x.id ? 'is-active' : ''}`} onClick={() => select(x.id)}>
                  {x.label}
                </button>
              ))}
            </div>
            <button className="btn btn--ghost btn--sm" onClick={reset}>
              <Rotate width={16} height={16} /> Reset view
            </button>
          </div>

          <div className={`explore__card ${h ? 'is-on' : ''}`} aria-live="polite">
            {h && (
              <>
                <button className="explore__close" onClick={() => emit('select', null)} aria-label="Close">
                  <Close width={18} height={18} />
                </button>
                <p className="eyebrow eyebrow--accent">{h.label}</p>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </>
            )}
          </div>
        </div>

        <div className={`explore__hint ${active && !selected ? 'is-on' : ''}`}>
          <Drag width={20} height={20} /> Drag to rotate
        </div>
      </div>
    </section>
  )
}
