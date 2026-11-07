export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="wordmark wordmark--sm">QUECHUA</span>
        <p>
          Concept product page rendered in real time with{' '}
          <a href="https://playcanvas.com" target="_blank" rel="noreferrer">PlayCanvas</a> Gaussian splatting.
        </p>
        <p className="footer__credit">
          3D capture: “
          <a href="https://superspl.at/scene/f83d530f" target="_blank" rel="noreferrer">QUECHUA - Webviewer</a>
          ” by{' '}
          <a href="https://superspl.at/user?id=schindelar3d" target="_blank" rel="noreferrer">Christoph Schindelar</a>,
          licensed{' '}
          <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.
          Re-oriented, re-scaled and compressed for this page.
        </p>
      </div>
    </footer>
  )
}
