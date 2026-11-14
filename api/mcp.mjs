// Vercel-Funktion: erreichbar unter /mcp (siehe vercel.json)
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { baueServer, pruefeZugriff } from "../core.mjs";

export default async function handler(req, res) {
  const zugriff = pruefeZugriff(req);
  if (!zugriff.ok) {
    res.statusCode = zugriff.status;
    res.end(zugriff.msg);
    return;
  }
  const server = baueServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
