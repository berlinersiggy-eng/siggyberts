# siggyberts – SYBS Produktkatalog (MCP-Server)

Kleiner MCP-Server für die Marketing-Bots von MarketingFlowHub. Er liefert den Produktkatalog von Siggy-Berts (SYBS).

- Adresse: `https://siggyberts.vercel.app/mcp`
- Anmeldung: Header `Authorization: Bearer <Token>`

## Katalog ändern

Die Produkte stehen in `products.json`. Dort Name, Beschreibung, Preis, Link und Status ändern und speichern ("Commit changes"). Ist das Repository mit Vercel verbunden, wird danach automatisch neu veröffentlicht.

- `status: "verkaufen"` – die Bots dürfen das Produkt bewerben
- `status: "nicht_verkaufen"` – die Bots lassen es weg

## Werkzeuge

| Werkzeug | Zweck |
|---|---|
| `produkte_auflisten` | alle Produkte, optional nur verkäufliche |
| `produkt_abrufen` | ein Produkt per `id` |
| `produkt_hinzufuegen` | auf Vercel schreibgeschützt, Produkte stattdessen in `products.json` eintragen |

## Sicherheit

Das Token steht **nicht** in diesem Repository. Es liegt nur bei Vercel in der Variable `MCP_TOKEN`. Ohne gesetztes Token lehnt der Server jede Anfrage ab. Niemals Tokens oder API-Keys in eine Datei hier schreiben.

## Lokal starten

```
npm install
MCP_TOKEN=einpasswort node server.mjs --http
```
