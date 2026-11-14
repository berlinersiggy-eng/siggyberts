// SYBS Produktkatalog-MCP – lokaler Start
//   node server.mjs          -> stdio (für lokale Clients)
//   node server.mjs --http   -> http://localhost:3000/mcp (braucht MCP_TOKEN)
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";
import { baueServer, pruefeZugriff } from "./core.mjs";

if (process.argv.includes("--http")) {
  const port = Number(process.env.PORT || 3000);
  createServer(async (req, res) => {
    if (!req.url?.startsWith("/mcp")) return void res.writeHead(404).end();
    const zugriff = pruefeZugriff(req);
    if (!zugriff.ok) return void res.writeHead(zugriff.status).end(zugriff.msg);
    const server = baueServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => { transport.close(); server.close(); });
    await server.connect(transport);
    await transport.handleRequest(req, res);
  }).listen(port, () => console.error(`SYBS-MCP läuft auf http://localhost:${port}/mcp`));
} else {
  await baueServer().connect(new StdioServerTransport());
}
