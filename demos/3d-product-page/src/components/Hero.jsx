import { useEffect, useRef, useState } from 'react'
import { stage } from '../stage/store'
import { Box, Cart, Chevron, Drag, Heart, Shield, Star, Truck } from './Icons'

const RESUME_MS = 8000
const lerpVel = (v, n) => v + (n - v) * 0.5

const SIZES = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10']

export default function Hero({ onAdd }) {
  const [size, setSize] = useState('8')
  const [liked, setLiked] = useState(false)
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)
  const [atTop, setAtTop] = useState(true)

  // the "Drag to spin" label only shows right at the top of the page
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Drag the boot to spin it. It stays where you leave it, then the
  // turntable picks up again from that angle after RESUME_MS.
  const onDown = (e) => {
    if (e.button > 0 || e.target.closest('.hero__copy, .crumbs, a, button')) return
    // stop the browser starting a text selection as the pointer sweeps
    // across the copy (touch keeps native vertical scroll via touch-action)
    if (e.pointerType === 'mouse') e.preventDefault()
    window.getSelection()?.removeAllRanges()
    drag.current = { x: e.clientX, t: performance.now(), id: e.pointerId }
    stage.heroHold = Infinity
    stage.heroVel = 0
    setDragging(true)
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    if (dx && !d.captured) {
      d.captured = true
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    }
    const now = performance.now()
    const dt = Math.max(1, now - d.t) / 1000
    stage.heroYaw += dx * 0.45
    stage.heroVel = lerpVel(stage.heroVel, (dx * 0.45) / dt)
    d.x = e.clientX
    d.t = now
  }
  const onUp = (e) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    // no flick if the pointer rested before letting go
    if (performance.now() - d.t > 80) stage.heroVel = 0
    drag.current = null
    stage.heroHold = performance.now() + RESUME_MS
    setDragging(false)
  }

  return (
    <section
      id="overview"
      className={`section hero ${dragging ? 'is-dragging' : ''}`}
      data-shot="hero"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="container hero__grid">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="#overview">Home</a><Chevron dir="right" width={12} height={12} />
          <a href="#overview">Footwear</a><Chevron dir="right" width={12} height={12} />
          <a href="#overview">Hiking boots</a><Chevron dir="right" width={12} height={12} />
          <span aria-current="page">MH500 Mid</span>
        </nav>

        <div className="hero__copy">
          <p className="eyebrow">Quechua</p>
          <h1 className="hero__title">MH500 Mid</h1>
          <p className="hero__sub">Waterproof hiking boot</p>
          <p className="hero__lead">
            A versatile, comfortable and durable mid-cut boot for day hikes and
            mountain trails. Built for grip, ankle support and dry feet — mile
            after mile.
          </p>

          <div className="hero__price-row">
            <span className="price">£69.99</span>
            <a href="#specs" className="rating" aria-label="Rated 4.6 out of 5 from 1,248 reviews">
              {[1, 1, 1, 1, 0.6].map((f, i) => <Star key={i} fill={f} width={17} height={17} />)}
              <span>4.6 <small>(1,248)</small></span>
            </a>
          </div>

          <div className="picker">
            <div className="picker__label picker__label--row">
              <span>Size (UK)</span>
              <a href="#specs" className="link">Size guide</a>
            </div>
            <div className="sizes" role="radiogroup" aria-label="Size">
              {SIZES.map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={size === s}
                  className={`size ${size === s ? 'is-active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" onClick={onAdd}>
              <Cart width={20} height={20} /> Add to cart
            </button>
            <button
              className={`btn btn--icon ${liked ? 'is-liked' : ''}`}
              onClick={() => setLiked((l) => !l)}
              aria-pressed={liked}
              aria-label="Save to wishlist"
            >
              <Heart width={22} height={22} />
            </button>
          </div>

          <ul className="perks">
            <li><Truck width={22} height={22} /> Free shipping<br />over £50</li>
            <li><Box width={22} height={22} /> 60-day<br />returns</li>
            <li><Shield width={22} height={22} /> 2-year<br />warranty</li>
          </ul>
        </div>
      </div>

      <p className={`hero__drag-hint ${atTop ? '' : 'is-off'}`} aria-hidden="true">
        <Drag width={18} height={18} /> Drag to spin
      </p>

      <a href="#features" className="scroll-cue" aria-label="Scroll to explore">
        <span>Scroll to explore</span>
        <Chevron width={20} height={20} />
      </a>
    </section>
  )
}
