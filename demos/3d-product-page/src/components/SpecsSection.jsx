import { Cart, Leaf, Shield, Star } from './Icons'

const SPECS = [
  ['Upper', 'Nubuck leather with textile panels'],
  ['Lining', 'Waterproof, breathable membrane'],
  ['Midsole', 'EVA foam, partly from sugar-cane co-products'],
  ['Outsole', 'Outdoor Contact rubber, 5 mm lugs'],
  ['Protection', 'Rubber toe bumper and front stone guard'],
  ['Height', 'Mid-cut, padded collar'],
  ['Closure', 'Laces through webbing loops, gusseted tongue'],
  ['Best for', 'Day hikes and mountain trails'],
]

export default function SpecsSection({ onAdd }) {
  return (
    <section id="specs" className="section specs" data-shot="buy">
      <div className="container specs__grid">
        <div className="specs__copy">
          <p className="eyebrow eyebrow--accent">Specs</p>
          <h2 className="h2">Made for real trails.</h2>

          <dl className="spec-table">
            {SPECS.map(([k, v]) => (
              <div key={k} className="spec-table__row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="footnote">Specifications vary slightly by market and size. Check your local product page.</p>

          <div className="eco">
            <Leaf width={26} height={26} />
            <div>
              <strong>Designed to last, built with less.</strong>
              <span>Part-recycled rubber in the outsole and part bio-sourced EVA in the midsole.</span>
            </div>
          </div>

          <div className="buy">
            <div>
              <p className="buy__name">Quechua MH500 Mid</p>
              <p className="buy__meta">
                <Star fill={1} width={15} height={15} /> 4.6 · 1,248 reviews
              </p>
            </div>
            <span className="price price--sm">£69.99</span>
            <button className="btn btn--primary" onClick={onAdd}>
              <Cart width={18} height={18} /> Add to cart
            </button>
            <p className="buy__perk"><Shield width={16} height={16} /> 2-year warranty · free returns within 60 days</p>
          </div>
        </div>
      </div>
    </section>
  )
}
