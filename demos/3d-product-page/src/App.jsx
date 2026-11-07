import { useState } from 'react'
import ShoeStage from './stage/ShoeStage'
import { DEFAULTS, SPLAT_URL } from './stage/settings'
import Nav from './components/Nav'
import Hero from './components/Hero'
import FeaturesSection from './components/FeaturesSection'
import GripSection from './components/GripSection'
import ExploreSection from './components/ExploreSection'
import SpecsSection from './components/SpecsSection'
import Footer from './components/Footer'
import Hotspots from './components/Hotspots'
import BackLink from './components/BackLink'

export default function App() {
  const [cart, setCart] = useState(1)
  const add = () => setCart((n) => n + 1)

  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <div className="stage__topo" />
        <div className="stage__sun" />
      </div>
      <div className="stage" aria-hidden="true">
        {/* phones: a copy of the backdrop over the top band, above the page
            copy and below the boot, fading out at the zone line */}
        <div className="stage__veil">
          <div className="stage__topo" />
          <div className="stage__sun" />
        </div>
        <ShoeStage src={SPLAT_URL} settings={DEFAULTS} />
      </div>
      <Hotspots />
      <Nav cart={cart} onAdd={add} />
      <main>
        <Hero onAdd={add} />
        <FeaturesSection />
        <GripSection />
        <ExploreSection />
        <SpecsSection onAdd={add} />
      </main>
      <Footer />
      <BackLink />
    </>
  )
}
