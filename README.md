# feedbagel-mcp

Model Context Protocol server for the [Feedbagel](https://feedbagel.com) API. Lets agents follow RSS feeds, manage webhook subscriptions, and read entries on a user's behalf.

## Install

```bash
npm install -g feedbagel-mcp
```

Or run via `npx feedbagel-mcp` without installing.

## Setup

1. Mint an API key at https://feedbagel.com/dashboard/keys (pick the "Agent" scope).
2. Add the server to your MCP client config.

### Claude Desktop / Cursor / Windsurf

```json
{
  "mcpServers": {
    "feedbagel": {
      "command": "npx",
      "args": ["-y", "feedbagel-mcp"],
      "env": {
        "FEEDBAGEL_API_KEY": "fbk_..."
      }
    }
  }
}
```

## Tools

18 tools across discovery, follows, webhooks, and entry reads.

**Discovery (read)**
- `search_feeds` — keyword search across the catalog
- `search_feeds_by_url` — find feeds at a given host
- `get_host_metadata` — title, favicon, and feed list for a host
- `list_entries` — recent entries, paginated
- `get_entry`, `get_entry_by_slug` — fetch a single entry

**Follows (write)**
- `list_subscriptions` — unified follow + webhook list
- `follow_feed`, `unfollow_feed`

**Webhooks (write)**
- `list_webhooks`, `create_webhook`, `delete_webhook`
- `pause_webhook`, `resume_webhook`
- `attach_feed_to_webhook`, `detach_feed_from_webhook`

**Account (read)**
- `me` — account email, plan, status (use as a smoke test)

## Environment

- `FEEDBAGEL_API_KEY` (required)
- `FEEDBAGEL_API_BASE` (optional, defaults to production)

## License

MIT
