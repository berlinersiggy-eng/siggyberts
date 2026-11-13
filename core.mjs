// SYBS Produktkatalog-MCP – gemeinsamer Kern (lokal und Vercel)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { z } from "zod";

const HIER = dirname(fileURLToPath(import.meta.url));
const KANDIDATEN = [join(HIER, "products.json"), join(process.cwd(), "products.json")];

async function laden() {
  let letzterFehler;
  for (const pfad of KANDIDATEN) {
    try {
      return { pfad, produkte: JSON.parse(await readFile(pfad, "utf8")) };
    } catch (e) {
      letzterFehler = e;
    }
  }
  throw letzterFehler;
}

const text = (obj) => ({ content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] });
const fehler = (msg) => ({ isError: true, content: [{ type: "text", text: msg }] });

// Prüft den Bearer-Token. Ohne gesetzten MCP_TOKEN wird ALLES abgelehnt (fail closed).
export function pruefeZugriff(req) {
  const token = process.env.MCP_TOKEN;
  if (!token) return { ok: false, status: 503, msg: "Server nicht konfiguriert: MCP_TOKEN fehlt." };
  if (req.headers.authorization !== `Bearer ${token}`) return { ok: false, status: 401, msg: "Unauthorized" };
  return { ok: true };
}

export function baueServer() {
  const server = new McpServer({ name: "sybs-produktkatalog", version: "1.0.0" });

  server.registerTool(
    "produkte_auflisten",
    {
      description: "Listet alle Produkte im Katalog. Nur Produkte mit status 'verkaufen' dürfen beworben werden.",
      inputSchema: { nur_verkaeuflich: z.boolean().optional().describe("true = nur Produkte mit status 'verkaufen'") },
      annotations: { readOnlyHint: true },
    },
    async ({ nur_verkaeuflich }) => {
      const { produkte } = await laden();
      return text(nur_verkaeuflich ? produkte.filter((p) => p.status === "verkaufen") : produkte);
    }
  );

  server.registerTool(
    "produkt_abrufen",
    {
      description: "Gibt ein einzelnes Produkt anhand seiner id zurück.",
      inputSchema: { id: z.string().describe("z.B. 'buchbuendel'") },
      annotations: { readOnlyHint: true },
    },
    async ({ id }) => {
      const { produkte } = await laden();
      const p = produkte.find((x) => x.id === id);
      return p ? text(p) : fehler(`Kein Produkt mit id '${id}' gefunden.`);
    }
  );

  server.registerTool(
    "produkt_hinzufuegen",
    {
      description:
        "Legt ein neues Produkt an. Startet immer mit status 'nicht_verkaufen' und muss von Siggy freigegeben werden. Funktioniert nur, wenn der Server schreiben darf (nicht auf Vercel).",
      inputSchema: {
        id: z.string().regex(/^[a-z0-9-]+$/).describe("Kurze id, nur Kleinbuchstaben, Zahlen, Bindestrich"),
        name: z.string(),
        beschreibung: z.string(),
        zielgruppe: z.string(),
        preis: z.number().nullable().optional(),
        link: z.string().optional().describe("Verkaufslink, z.B. Amazon"),
      },
    },
    async ({ id, name, beschreibung, zielgruppe, preis, link }) => {
      const { pfad, produkte } = await laden();
      if (produkte.some((p) => p.id === id)) return fehler(`id '${id}' existiert schon.`);
      const neu = { id, name, beschreibung, zielgruppe, preis: preis ?? null, link: link ?? "", status: "nicht_verkaufen" };
      produkte.push(neu);
      try {
        await writeFile(pfad, JSON.stringify(produkte, null, 2) + "\n", "utf8");
      } catch {
        return fehler("Speichern nicht möglich: Dieser Server ist schreibgeschützt (z. B. auf Vercel). Produkte bitte direkt in products.json eintragen.");
      }
      return text(neu);
    }
  );

  return server;
}
