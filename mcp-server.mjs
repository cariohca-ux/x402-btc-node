import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import http from "http";

// --- Configuration ---
const BASE = "https://btcnode.uk";
const PORT = parseInt(process.env.MCP_PORT || "3100");
const MODE = process.env.MCP_MODE || "http"; // "http" or "stdio"

// --- Tool definitions (17 tools) ---
const TOOLS = [
  // --- FREE tools (no payment required) ---
  { name: "btc_info", description: "Get Bitcoin blockchain info (block height, chain tip, difficulty). FREE.",
    inputSchema: { type: "object", properties: {}, required: [] } },
  { name: "btc_fees", description: "Bitcoin fee rate estimates (fastest, half hour, hour). FREE.",
    inputSchema: { type: "object", properties: {}, required: [] } },
  { name: "btc_mempool", description: "Bitcoin mempool status (pending tx count, size, fee distribution). FREE.",
    inputSchema: { type: "object", properties: {}, required: [] } },
  // --- Paid tools ---
  { name: "btc_tx", description: "Lookup Bitcoin transaction by hash. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { hash: { type: "string", description: "64-char hex tx hash" } }, required: ["hash"] } },
  { name: "btc_addr", description: "Get Bitcoin address portfolio (balance, UTXOs, tx history). Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { address: { type: "string", description: "Bitcoin address" } }, required: ["address"] } },
  { name: "btc_trace", description: "Trace Bitcoin transaction flow (2 hops). Forensics. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { txid: { type: "string", description: "Bitcoin tx ID" } }, required: ["txid"] } },
  { name: "btc_fees_predict", description: "Predict Bitcoin fee rates for future blocks. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: {}, required: [] } },
  { name: "btc_whales", description: "Monitor large Bitcoin movements — whale transactions. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { min_btc: { type: "number" }, limit: { type: "number" } }, required: [] } },
  { name: "sec_insider", description: "SEC insider trades (Form 4/3/5) for any ticker. No API key. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { ticker: { type: "string", description: "Stock ticker (e.g. AAPL)" } }, required: ["ticker"] } },
  { name: "web_scrape", description: "Scrape URL to clean markdown text. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { url: { type: "string", description: "URL to scrape" } }, required: ["url"] } },
  { name: "ai_summarize", description: "AI text summarization. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { text: { type: "string", description: "Text to summarize" } }, required: ["text"] } },
  { name: "systems_theory", description: "Systems theory analysis through 6 lenses. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { topic: { type: "string", description: "Topic to analyze" } }, required: ["topic"] } },
  { name: "game_theory", description: "Game theory analysis of any scenario. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { scenario: { type: "string", description: "Scenario to analyze" } }, required: ["scenario"] } },
  { name: "capital_flows", description: "Trace capital flows across markets & economies. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "Search query for capital flows" } }, required: ["query"] } },
  { name: "reddit_hot", description: "Hot posts from any subreddit. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { subreddit: { type: "string" }, limit: { type: "number" } }, required: ["subreddit"] } },
  { name: "reddit_search", description: "Search Reddit by keyword. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "number" } }, required: ["query"] } },
  { name: "reddit_trending", description: "Trending subreddits & topics on Reddit. Cost: $0.001 USDC via x402.",
    inputSchema: { type: "object", properties: {}, required: [] } },
];

const ROUTES = {
  btc_info: { method: "GET", path: "/api/info" },
  btc_fees: { method: "GET", path: "/api/fees" },
  btc_mempool: { method: "GET", path: "/api/mempool" },
  btc_tx: { method: "GET", path: (a) => `/api/tx/${a.hash}` },
  btc_addr: { method: "GET", path: (a) => `/api/addr/${a.address}` },
  btc_trace: { method: "GET", path: (a) => `/api/trace/${a.txid}` },
  btc_fees_predict: { method: "GET", path: "/api/fees/predict" },
  btc_whales: { method: "GET", path: "/api/whales", q: (a) => ({ min_btc: a.min_btc, limit: a.limit }) },
  sec_insider: { method: "GET", path: (a) => `/api/sec/insider/${a.ticker}` },
  web_scrape: { method: "POST", path: "/api/scrape", b: (a) => ({ url: a.url }) },
  ai_summarize: { method: "POST", path: "/api/summarize", b: (a) => ({ text: a.text }) },
  systems_theory: { method: "POST", path: "/api/systems-theory", b: (a) => ({ topic: a.topic }) },
  game_theory: { method: "POST", path: "/api/game-theory", b: (a) => ({ scenario: a.scenario }) },
  capital_flows: { method: "POST", path: "/api/capital-flows", b: (a) => ({ query: a.query }) },
  reddit_hot: { method: "GET", path: (a) => `/api/reddit/hot/${a.subreddit}`, q: (a) => ({ limit: a.limit }) },
  reddit_search: { method: "GET", path: "/api/reddit/search", q: (a) => ({ q: a.query, limit: a.limit }) },
  reddit_trending: { method: "GET", path: "/api/reddit/trending" },
};

// Build a fresh server instance (SDK limitation: one transport per instance)
function createServer() {
  const srv = new Server(
    { name: "irclaw-btc-node", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  srv.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  srv.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const route = ROUTES[name];
    if (!route) throw new Error(`Unknown tool: ${name}`);

    try {
      const path = typeof route.path === "function" ? route.path(args || {}) : route.path;
      let qs = "";
      if (route.q) {
        const p = new URLSearchParams();
        Object.entries(route.q(args || {})).forEach(([k, v]) => { if (v != null) p.append(k, String(v)); });
        qs = p.toString();
      }
      const url = `${BASE}${path}${qs ? "?" + qs : ""}`;
      const opts = { method: route.method, headers: { "Content-Type": "application/json" } };
      if (route.b && args) opts.body = JSON.stringify(route.b(args));

      const resp = await fetch(url, opts);
      const text = await resp.text();

      if (!resp.ok && resp.status !== 402) {
        throw new Error(`API error ${resp.status}: ${text.substring(0, 200)}`);
      }

      return { content: [{ type: "text", text }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  });

  return srv;
}

// --- HTTP/SSE mode ---
async function startHttp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let transport = null;

  app.get("/sse", async (req, res) => {
    const srv = createServer();
    transport = new SSEServerTransport("/messages", res);
    await srv.connect(transport);
  });

  app.post("/messages", async (req, res) => {
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).json({ error: "No active SSE connection. Connect to /sse first." });
    }
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok", tools: TOOLS.length });
  });

  app.get("/tools", (req, res) => {
    res.json({ tools: TOOLS.map(t => ({ name: t.name, description: t.description })) });
  });

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.error(`✅ IRONCLAW BTC Node MCP Server (HTTP/SSE)`);
      console.error(`   SSE:    http://localhost:${PORT}/sse`);
      console.error(`   Health: http://localhost:${PORT}/health`);
      console.error(`   Tools:  http://localhost:${PORT}/tools`);
      console.error(`   Mode:   HTTP/SSE`);
      resolve();
    });
  });
}

// --- stdio mode ---
async function startStdio() {
  const srv = createServer();
  const transport = new StdioServerTransport();
  await srv.connect(transport);
  console.error(`✅ IRONCLAW BTC Node MCP Server (stdio)`);
}

// --- Main ---
async function main() {
  if (MODE === "stdio") {
    await startStdio();
  } else {
    await startHttp();
  }
}

main().catch((err) => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});
