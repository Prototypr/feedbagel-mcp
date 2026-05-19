# feedbagel-mcp directory submissions

## Canonical metadata (reuse everywhere)

- **Name:** Feedbagel
- **Package:** `feedbagel-mcp` (npm)
- **Repo:** https://github.com/Prototypr/feedbagel-mcp
- **Homepage:** https://feedbagel.com/docs#mcp
- **License:** MIT
- **Language:** TypeScript
- **Transport:** stdio
- **Auth:** API key (`FEEDBAGEL_API_KEY`)
- **Category:** RSS / Content / Productivity

### One-liners

- **Short (under 80 chars):** "Follow RSS feeds and manage webhook subscriptions through Feedbagel."
- **Medium:** "MCP server for Feedbagel. Search feeds, follow them, and route new entries to webhooks. 18 tools, stdio, API-key auth."
- **Long:** "Feedbagel is a feed reader with a clean v1 API. This MCP server gives agents 18 tools to search the feed catalog, follow feeds on the user's behalf, and create webhook subscriptions that push new entries to any URL. Useful for content monitoring, newsletter automation, and research workflows."

### Tags
`rss`, `atom`, `feeds`, `content`, `webhooks`, `monitoring`, `news`, `automation`

---

## PR-accepting directories (I can draft the PR for you)

### 1. modelcontextprotocol/servers (official)
- Repo: https://github.com/modelcontextprotocol/servers
- File: `README.md` — community servers section, alphabetical
- Entry:
  ```markdown
  - **[Feedbagel](https://github.com/Prototypr/feedbagel-mcp)** - Follow RSS feeds and manage webhook subscriptions through the Feedbagel API.
  ```

### 2. punkpeye/awesome-mcp-servers
- Repo: https://github.com/punkpeye/awesome-mcp-servers
- Section: under a content/RSS category (likely `## Browser Automation` or `## Productivity` — confirm at PR time)
- Entry:
  ```markdown
  - [Prototypr/feedbagel-mcp](https://github.com/Prototypr/feedbagel-mcp) 🟨 🏠 - Follow RSS feeds and route new entries to webhooks via the Feedbagel API.
  ```
  (🟨 = TypeScript, 🏠 = self-hosted/API-backed)

### 3. wong2/awesome-mcp-servers
- Repo: https://github.com/wong2/awesome-mcp-servers
- Section: Community Servers
- Entry:
  ```markdown
  - [feedbagel-mcp](https://github.com/Prototypr/feedbagel-mcp) - RSS feed search, follows, and webhook subscriptions for agents.
  ```

### 4. appcypher/awesome-mcp-servers
- Repo: https://github.com/appcypher/awesome-mcp-servers
- Section: alphabetical under a content category
- Entry:
  ```markdown
  - [feedbagel-mcp](https://github.com/Prototypr/feedbagel-mcp) - Feedbagel RSS reader: search, follow, and webhook routing.
  ```

### 5. cursor.directory/mcp
- Repo: https://github.com/pontusab/cursor.directory
- Submits via PR adding a JSON/TSX entry. Format varies; check `src/data/mcps` at PR time.

---

## Web-form / auto-indexed directories

| Directory | URL | Method |
|---|---|---|
| Smithery | https://smithery.ai/new | Auto-pulls from GitHub once submitted; add a `smithery.yaml` for richer listing |
| mcp.so | https://mcp.so/submit | Web form |
| Glama | https://glama.ai/mcp/servers | Auto-discovers npm packages tagged `mcp`; usually no action needed |
| PulseMCP | https://www.pulsemcp.com/submit | Web form |
| MCP Market | https://mcpmarket.com/submit | Web form |
| mcpservers.org | https://mcpservers.org/submit | Web form |
| MCP Hub (mcp-hub.com) | https://mcp-hub.com/submit | Web form |
| Awesome MCP (sindresorhus-style aggregators) | various | PR — covered above |

---

## Optional: smithery.yaml for richer listing

If we want a polished Smithery card, add `smithery.yaml` to the MCP repo:

```yaml
startCommand:
  type: stdio
  configSchema:
    type: object
    required: [FEEDBAGEL_API_KEY]
    properties:
      FEEDBAGEL_API_KEY:
        type: string
        description: "API key from https://feedbagel.com/dashboard/keys (Agent scope)"
  commandFunction: |-
    (config) => ({
      command: 'npx',
      args: ['-y', 'feedbagel-mcp'],
      env: { FEEDBAGEL_API_KEY: config.FEEDBAGEL_API_KEY }
    })
```

---

## Prereqs before submitting

- [ ] Push `README.md` to https://github.com/Prototypr/feedbagel-mcp (currently 404s)
- [ ] Confirm npm package is published and current (`npm view feedbagel-mcp version`)
- [ ] Add `mcp`, `model-context-protocol`, `rss`, `feeds` topics to the GitHub repo
- [ ] Optional: add a screenshot/demo gif for richer cards
