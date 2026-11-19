type Product = {
  id: string
  name: string
  beschreibung: string
  zielgruppe: string
  preis: number | null
  link: string
  status: string
}

const productDetails: Record<string, { number: string; category: string; mark: string }> = {
  buchbuendel: { number: "01", category: "Kreativität", mark: "P." },
  "living-set": { number: "02", category: "Wohnen", mark: "L." },
  getraenk: { number: "03", category: "Genuss", mark: "S." },
}

export function ProductCard({ product }: { product: Product }) {
  const details = productDetails[product.id] ?? {
    number: "00",
    category: "Kollektion",
    mark: product.name.slice(0, 2),
  }
  const isAvailable = product.status === "verkaufen"

  return (
    <article className={`product-card${isAvailable ? " product-card--active" : ""}`}>
      <div className="product-card__topline">
        <span className="product-card__number">{details.number} / 03</span>
        <span className={`status${isAvailable ? " status--active" : ""}`}>
          <span className="status__dot" aria-hidden="true" />
          {isAvailable ? "Im Sortiment" : "In Entwicklung"}
        </span>
      </div>

      <div className="product-card__art" aria-hidden="true">
        <span className="product-card__category">{details.category}</span>
        <span className="product-card__mark">{details.mark}</span>
        <span className="product-card__art-note">SIGGY BERTS · ORIGINALS</span>
      </div>

      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p className="product-card__description">{product.beschreibung}</p>
        <div className="product-card__details">
          <span>Zielgruppe</span>
          <span>{product.zielgruppe}</span>
        </div>
        <div className="product-card__bottom">
          <span className="product-card__price">
            {product.preis == null ? "Preis auf Anfrage" : `${product.preis.toFixed(2)} €`}
          </span>
          <span className="product-card__arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </article>
  )
}
