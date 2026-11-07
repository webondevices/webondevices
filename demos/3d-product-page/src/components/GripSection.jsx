import { useEffect, useRef, useState } from 'react'
import { stage } from '../stage/store'
import { Grip, Leaf, Mountain } from './Icons'

/*
 * The boot rolls over to show its outsole (shot "sole"), holds, then the
 * camera pushes in on the forefoot lugs (shot "lugs").
 */
const TRACK = 2.2
const KEYS = [
  ['sole', 0],
  ['sole', 0.55],
  ['lugs', 1.35],
  ['lugs', TRACK],
]

const STATS = [
  { value: '5', unit: 'mm', label: 'Lug depth' },
  { value: '30', unit: '%', label: 'Recycled or bio-sourced rubber*' },
]

const TERRAIN = [
  { icon: Mountain, title: 'Rock & gravel', body: 'Chunky lugs and a rubber stone guard up front take the hits from rough ground.' },
  { icon: Grip, title: 'Dirt & mud', body: 'Deep lugs with open gaps between them bite into soft ground.' },
  { icon: Leaf, title: 'Damp trails', body: 'A grippy rubber compound made for mixed, wet-weather walking.' },
]

export default function GripSection() {
  const ref = useRef(null)
  const [stage2, setStage2] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const p = (window.scrollY - el.offsetTop) / window.innerHeight
      setStage2(p > 0.95)
      // the outsole hotspot is useful while the sole faces the camera
      if (p > 0.1 && p < TRACK) stage.focus = ['outsole']
      else if (stage.focus?.[0] === 'outsole') stage.focus = null
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="grip" ref={ref} className="grip" style={{ height: `${100 + TRACK * 100}vh` }}>
      {KEYS.map(([shot, at]) => (
        <span key={at} className="marker" data-shot={shot} style={{ top: `${at * 100}vh` }} />
      ))}

      <div className="grip__pin">
        <div className="container grip__grid">
          <div className="grip__copy">
            <p className="eyebrow eyebrow--accent">Outdoor Contact outsole</p>
            <h2 className="display display--md">
              Grip you can<br />feel underfoot.
            </h2>
            <p className="lead">
              Flip it over: a deep-lugged rubber outsole built to hold on dirt,
              rock and wet trails — and to keep holding, season after season.
            </p>

            <div className={`grip__swap ${stage2 ? 'is-2' : ''}`}>
              <ul className="stats">
                {STATS.map((s) => (
                  <li key={s.label} className="stat">
                    <span className="stat__value">{s.value}<small>{s.unit}</small></span>
                    <span className="stat__label">{s.label}</span>
                  </li>
                ))}
              </ul>
              <ul className="terrain">
                {TERRAIN.map(({ icon: Icon, title, body }) => (
                  <li key={title}>
                    <Icon width={22} height={22} />
                    <div><strong>{title}</strong><span>{body}</span></div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="footnote">*Depending on country of production.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
