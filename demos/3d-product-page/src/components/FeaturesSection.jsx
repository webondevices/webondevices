import { useEffect, useRef, useState } from 'react'
import { stage } from '../stage/store'
import { Drop, Heel, Laces, Layers } from './Icons'

const FEATURES = [
  {
    id: 'lacing',
    hotspots: ['lacing', 'tongue'],
    icon: Laces,
    eyebrow: 'Key feature',
    title: 'Secure, supportive lacing',
    short: 'Quick-lace support',
    body: 'Grippy round laces glide through wide webbing loops, so the boot snugs evenly from toe to ankle. A gusseted tongue keeps grit out.',
  },
  {
    id: 'heel',
    hotspots: ['collar', 'heel', 'pull'],
    icon: Heel,
    eyebrow: 'Support',
    title: 'Locked-in heel and ankle',
    short: 'Heel support',
    body: 'A moulded heel counter cups the heel for a steady stride, and a padded collar cushions the ankle on long descents.',
  },
  {
    id: 'upper',
    hotspots: ['upper'],
    icon: Drop,
    eyebrow: 'Weatherproof',
    title: 'Dry feet, rain or shine',
    short: 'Waterproof upper',
    body: 'Nubuck leather over a waterproof, breathable membrane keeps puddles and rain out while letting sweat escape.',
  },
  {
    id: 'midsole',
    hotspots: ['midsole'],
    icon: Layers,
    eyebrow: 'Comfort',
    title: 'Cushioning that goes the distance',
    short: 'EVA midsole',
    body: 'A thick EVA foam midsole soaks up impact on every step. Part of the EVA is made from sugar-cane co-products.',
  },
]

/*
 * Scroll track (viewport heights): each feature gets STEP — the camera holds
 * for HOLD, then travels to the next. Then the pin releases.
 */
const STEP = 1
const HOLD = 0.4
const TRACK = FEATURES.length * STEP

export default function FeaturesSection() {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)
  const f = FEATURES[index]

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const vh = window.innerHeight
      const p = (window.scrollY - el.offsetTop) / vh
      const i = Math.min(FEATURES.length - 1, Math.max(0, Math.floor((p - (HOLD + (STEP - HOLD) / 2)) / STEP) + 1))
      setIndex(i)
      // show the feature's hotspots only while the camera rests on it
      const local = p - i * STEP
      const resting = p > -0.15 && p < TRACK - 0.2 && local > -0.2 && local < HOLD + 0.15
      stage.focus = resting ? FEATURES[i].hotspots : null
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      stage.focus = null
    }
  }, [])

  const goTo = (i) => {
    const el = ref.current
    window.scrollTo({ top: el.offsetTop + i * STEP * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section id="features" ref={ref} className="features" style={{ height: `${100 + TRACK * 100}vh` }}>
      {FEATURES.flatMap((item, i) => [
        <span key={`${item.id}-in`} className="marker" data-shot={item.id} style={{ top: `${i * STEP * 100}vh` }} />,
        <span key={`${item.id}-out`} className="marker" data-shot={item.id} style={{ top: `${(i * STEP + HOLD) * 100}vh` }} />,
      ])}

      <div className="features__pin">
        <div className="container features__grid">
          <div className="features__copy">
            <div className="features__head" key={f.id}>
              <p className="eyebrow eyebrow--accent">{f.eyebrow}</p>
              <h2 className="h2">{f.title}</h2>
              <p className="lead">{f.body}</p>
            </div>

            <ol className="flist">
              {FEATURES.map((item, i) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button className={`fitem ${i === index ? 'is-active' : ''}`} onClick={() => goTo(i)}>
                      <span className="fitem__icon"><Icon width={22} height={22} /></span>
                      <span className="fitem__text">
                        <strong>{item.short}</strong>
                        <span>{item.body}</span>
                      </span>
                      <span className="fitem__num">{String(i + 1).padStart(2, '0')}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
