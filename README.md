# IRONCLAW Bitcoin Blockchain MCP Server

Real Bitcoin full node data for AI agents via MCP (Model Context Protocol).

**17 tools — zero install, pay-per-call in USDC on Base mainnet.**

## Quick Start

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

## Tools

| Tool | Description | Cost |
|------|-------------|------|
| `btc_info` | Blockchain info (height, difficulty) | FREE |
| `btc_fees` | Fee rate estimates | FREE |
| `btc_mempool` | Mempool status | FREE |
| `btc_tx` | Transaction lookup | $0.001 |
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

## Requirements

- Node.js 18+
- A wallet with USDC on Base mainnet (for paid tools)
- Free tools require no wallet

## Architecture

```
MCP Client (Claude Desktop, etc.)
        │
        ▼  SSE (mcp.btcnode.uk/sse)
Bitcoin Full Node + LND
        │
        ▼  x402 Protocol (USDC micropayments)
HTTP API (btcnode.uk)
```

## Deployment

```bash
git clone https://github.com/cariohca-ux/x402-btc-node.git
cd x402-btc-node
npm install
cp .env.example .env
# Edit .env with your settings
node mcp-server.mjs
```

## Links

- **SSE Endpoint:** https://mcp.btcnode.uk/sse
- **API:** https://btcnode.uk
- **Status:** https://btcnode.uk/health
- **MCP Registry:** https://registry.modelcontextprotocol.io
