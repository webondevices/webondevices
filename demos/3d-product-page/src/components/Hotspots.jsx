import { useEffect, useState } from 'react'
import { HOTSPOTS } from '../stage/hotspots'
import { emit, on, stage } from '../stage/store'
import { Plus } from './Icons'

/**
 * One fixed layer of "+" markers. The render loop positions them every frame
 * from their 3D anchors (see ShoeStage) and toggles .is-on; this component
 * only renders them and forwards clicks (as 'pick') to Explore, which turns
 * the boot towards the part and opens its card — same as the chips.
 */
export default function Hotspots() {
  const [interactive, setInteractive] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => on('explore', setInteractive), [])
  useEffect(() => on('select', setSelected), [])

  return (
    <div className={`hotspots ${interactive ? 'is-interactive' : ''}`}>
      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          ref={(el) => (el ? stage.hotspotEls.set(h.id, el) : stage.hotspotEls.delete(h.id))}
          className={`hotspot ${selected === h.id ? 'is-selected' : ''}`}
          onClick={() => emit('pick', h.id)}
          tabIndex={interactive ? 0 : -1}
          aria-label={h.label}
        >
          <span className="hotspot__dot"><Plus width={14} height={14} /></span>
          <span className="hotspot__label">{h.label}</span>
        </button>
      ))}
    </div>
  )
}
