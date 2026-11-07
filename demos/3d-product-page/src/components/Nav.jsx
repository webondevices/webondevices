import { useEffect, useState } from 'react'
import { Cart, Search, User } from './Icons'

const TABS = [
  ['overview', 'Overview'],
  ['features', 'Features'],
  ['grip', 'Grip'],
  ['explore', 'Explore'],
  ['specs', 'Specs'],
]

export default function Nav({ cart, onAdd }) {
  const [active, setActive] = useState('overview')
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    TABS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  return (
    <header className={`nav ${sticky ? 'nav--sticky' : ''}`}>
      <div className="nav__main">
        <div className="container nav__inner">
          <a href="#overview" className="wordmark" aria-label="Quechua home">QUECHUA</a>
          <nav className="nav__links" aria-label="Shop">
            {['Men', 'Women', 'Kids', 'Gear', 'Explore'].map((l) => (
              <a key={l} href="#overview" className="nav__link">{l}</a>
            ))}
          </nav>
          <div className="nav__icons">
            <button aria-label="Search"><Search /></button>
            <button aria-label="Account"><User /></button>
            <button aria-label={`Cart, ${cart} item${cart === 1 ? '' : 's'}`} className="nav__cart">
              <Cart />
              {cart > 0 && <span className="nav__badge">{cart}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="nav__bar" aria-hidden={!sticky}>
        <div className="container nav__bar-inner">
          <nav className="tabs" aria-label="Sections">
            {TABS.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={`tabs__tab ${active === id ? 'is-active' : ''}`} tabIndex={sticky ? 0 : -1}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav__product">
            <span className="nav__product-name">MH500 Mid</span>
            <span className="nav__product-price">£69.99</span>
            <button className="btn btn--primary btn--sm" onClick={onAdd} tabIndex={sticky ? 0 : -1}>
              <Cart width={18} height={18} /> Add to cart
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
