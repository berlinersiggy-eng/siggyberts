import products from "../products.json"
import { ProductCard } from "./product-card"

export default function HomePage() {
  const activeCount = products.filter((product) => product.status === "verkaufen").length

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#start" aria-label="Siggy-Berts Startseite">
          SIGGY<span>—</span>BERTS
        </a>
        <nav className="site-nav" aria-label="Hauptnavigation">
          <a href="#sortiment">Sortiment</a>
          <a href="#kontakt">MCP-Server</a>
        </nav>
        <span className="header-index">PRODUKTKATALOG · 2026</span>
      </header>

      <section className="hero" id="start" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow"><span className="eyebrow__line" /> UNABHÄNGIG. UNVERWECHSELBAR.</p>
          <h1 id="hero-title">Gute Ideen.<br /><em>Klare Kante.</em></h1>
          <p className="hero__description">
            Produkte mit Charakter, gemacht für Menschen, die nicht einfach irgendwas wollen.
            Willkommen bei Siggy-Berts.
          </p>
          <a className="hero__link" href="#sortiment">
            Das Sortiment entdecken <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero__aside" aria-label={`${activeCount} Produkte aktuell im Sortiment`}>
          <span className="hero__aside-label">KLEINER KATALOG.<br />GROSSE IDEEN.</span>
          <span className="hero__aside-count">0{activeCount}<span> Produkte<br />im Sortiment</span></span>
          <span className="hero__aside-mark" aria-hidden="true">S.</span>
        </div>
        <span className="hero__vertical" aria-hidden="true">HANDVERLESEN SEIT TAG EINS</span>
      </section>

      <section className="catalog" id="sortiment" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow__line" /> UNSERE AUSWAHL</p>
            <h2 id="catalog-title">Das Sortiment<span>.</span></h2>
          </div>
          <p className="section-heading__note">Drei Ideen. Jede mit eigenem Kopf.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="server-note" id="kontakt" aria-labelledby="server-title">
        <div>
          <p className="eyebrow"><span className="eyebrow__line" /> FÜR MENSCHEN UND MASCHINEN</p>
          <h2 id="server-title">Unser Katalog.<br /><em>Auch für Bots.</em></h2>
        </div>
        <div className="server-note__detail">
          <p>
            Der Siggy-Berts Produktkatalog ist auch als MCP-Server verfügbar – damit
            Marketing-Assistenten unsere aktuellen Produkte direkt entdecken können.
          </p>
          <div className="endpoint"><span>ENDPOINT</span><code>/mcp</code><span className="endpoint__type">STREAMABLE HTTP</span></div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark wordmark--footer" href="#start">SIGGY<span>—</span>BERTS</a>
        <span>Mit Haltung gemacht. © 2026 Siggy-Berts</span>
        <a href="#start" className="back-to-top">Zurück nach oben ↑</a>
      </footer>
    </main>
  )
}
