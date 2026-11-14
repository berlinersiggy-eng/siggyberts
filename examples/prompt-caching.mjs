// Prompt caching demo (automatic caching via top-level cache_control).
// Run: ANTHROPIC_API_KEY=... node examples/prompt-caching.mjs
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";

const client = new Anthropic();
const MODEL = "claude-opus-5-5";

// Stable, large prefix: the product catalog repeated until it is well over the
// minimum cacheable size (a short prefix silently won't cache).
const catalog = readFileSync(new URL("../products.json", import.meta.url), "utf8");
const system =
  "You are a helpful assistant for a product catalog. Catalog data follows.\n\n" +
  Array.from({ length: 40 }, (_, i) => `--- copy ${i + 1} ---\n${catalog}`).join("\n");

async function ask(question) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    output_config: { effort: "low" },
    cache_control: { type: "ephemeral" }, // auto-caches the last cacheable block
    system,
    messages: [{ role: "user", content: question }],
  });

  if (response.stop_reason === "refusal") {
    console.log("Refused:", response.stop_details?.category);
    return;
  }
  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  const u = response.usage;
  console.log(`Q: ${question}\nA: ${text.slice(0, 120).replace(/\n/g, " ")}...`);
  console.log(
    `   uncached=${u.input_tokens} cache_write=${u.cache_creation_input_tokens} cache_read=${u.cache_read_input_tokens}\n`,
  );
}

try {
  // Call 1 writes the cache; call 2 (same prefix, new question) should read it.
  await ask("How many products are in the catalog?");
  await ask("Which product is the cheapest?");
} catch (err) {
  if (err instanceof Anthropic.AuthenticationError) console.error("Set ANTHROPIC_API_KEY.");
  else if (err instanceof Anthropic.RateLimitError) console.error("Rate limited; retry later.");
  else if (err instanceof Anthropic.APIError) console.error(`API error ${err.status}: ${err.message}`);
  else throw err;
}
