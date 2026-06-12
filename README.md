<div align="center">
  <h1>🥩 IRONCLAW BTC Node</h1>
  <p><strong>Bitcoin Blockchain Data — 17 MCP Tools for AI Agents</strong></p>
  <p>Real full node data via x402 micropayments in USDC on Base mainnet.</p>
  <p><strong>3 free tools · 14 paid at $0.001 each · No API keys · No subscriptions</strong></p>

  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"></a>
    <a href="https://btcnode.uk"><img src="https://img.shields.io/badge/Status-Live-brightgreen" alt="Live"></a>
    <a href="https://glama.ai/mcp/servers/cariohca-ux/x402-btc-node"><img src="https://img.shields.io/badge/Glama-Listed-blue" alt="Glama"></a>
    <a href="https://mcp.so/server/ironclaw-btc-node"><img src="https://img.shields.io/badge/mcp.so-Listed-blue" alt="mcp.so"></a>
    <img src="https://img.shields.io/badge/Bitcoin-F7931A?logo=bitcoin&logoColor=white" alt="Bitcoin">
    <img src="https://img.shields.io/badge/MCP-Server-blue" alt="MCP Server">
    <img src="https://img.shields.io/badge/x402-Enabled-8A2BE2" alt="x402">
    <img src="https://img.shields.io/badge/USDC-Base-0052FF" alt="USDC Base">
  </p>
</div>

---

## 🔥 Quick Start

Add to your `claude_desktop_config.json` or any MCP client:

```json
{
  "mcpServers": {
    "btc-node": {
      "type": "sse",
      "url": "https://mcp.btcnode.uk/sse"
    }
  }
}
```

**That's it.** No install. No API keys. No setup. Free tools work immediately.

---

## 🆓 Free Tools (No Payment Required)

| Tool | Description | Cost |
|------|-------------|------|
| `btc_info` | Blockchain info (block height, difficulty, peers) | **FREE** |
| `btc_fees` | Fee rate estimates (high/medium/low sat/vB) | **FREE** |
| `btc_mempool` | Mempool status (pending tx, size MB) | **FREE** |

```bash
# Try them right now — no payment, no API key
curl https://btcnode.uk/api/info
curl https://btcnode.uk/api/fees
curl https://btcnode.uk/api/mempool
```

---

## 💰 Paid Tools ($0.001 each via x402)

| Tool | Description | Cost |
|------|-------------|------|
| `btc_tx` | Transaction lookup by hash | $0.001 |
| `btc_addr` | Address portfolio (balance, UTXOs, history) | $0.001 |
| `btc_trace` | Transaction flow tracing (2 hops) | $0.001 |
| `btc_fees_predict` | Fee rate prediction | $0.001 |
| `btc_whales` | Large Bitcoin movement alerts (10K+ BTC) | $0.001 |
| `sec_insider` | SEC insider trades (Form 4/3/5) | $0.001 |
| `web_scrape` | URL to clean markdown | $0.001 |
| `ai_summarize` | AI text summarization | $0.001 |
| `systems_theory` | Systems theory analysis (6 lenses) | $0.001 |
| `game_theory` | Game theory analysis | $0.001 |
| `capital_flows` | Capital flow tracing across markets | $0.001 |
| `reddit_hot` | Hot posts from any subreddit | $0.001 |
| `reddit_search` | Search Reddit by keyword | $0.001 |
| `reddit_trending` | Trending topics on Reddit | $0.001 |

Paid tools use **x402 protocol** — pay $0.001 USDC per call on **Base mainnet**. Your wallet approves the payment directly in the MCP client.

---

## 🏗 Architecture

```
MCP Client (Claude Desktop, Cursor, etc.)
        │
        ▼  SSE (mcp.btcnode.uk/sse)
   ┌──────────────┐
   │  MCP Server   │  17 tools, x402 payment middleware
   └──────┬───────┘
          │  HTTP API
   ┌──────┴───────┐
   │  BTC API      │  REST endpoints, paywall enforcement
   └──────┬───────┘
          │  RPC
   ┌──────┴───────┐
   │  Bitcoin Core │  Full node (953K+ blocks, 10 peers)
   │  LND          │  Lightning Network (12K sats)
   └──────────────┘
```

---

## 🚀 Self-Hosted Deployment

```bash
git clone https://github.com/cariohca-ux/x402-btc-node.git
cd x402-btc-node
npm install
cp .env.example .env
# Edit .env with your settings
node mcp-server.mjs
```

Requirements: Node.js 18+, a synced Bitcoin Core node (or use the hosted endpoint at `btcnode.uk`).

---

## 📋 Listings

| Platform | Status | URL |
|----------|--------|-----|
| **Glama** | ✅ Live | [glama.ai/mcp/servers/cariohca-ux/x402-btc-node](https://glama.ai/mcp/servers/cariohca-ux/x402-btc-node) |
| **mcp.so** | ✅ Live | [mcp.so/server/ironclaw-btc-node](https://mcp.so/server/ironclaw-btc-node) |
| **PayAPI Market** | ✅ Live | [payapi.market](https://payapi.market) |
| **MCP Registry** | 🔄 Auto-published via PayAPI | [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io) |

---

## 📄 License

MIT — do what you want. Built by [cariohca-ux](https://github.com/cariohca-ux). Bitcoin data served from a real full node.
