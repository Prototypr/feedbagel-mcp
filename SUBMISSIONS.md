# feedbagel-mcp directory submissions

> Landscape as of 2026-06-04. The big GitHub "awesome" lists have mostly moved
> off PRs: the official `modelcontextprotocol/servers` retired its community
> list in favour of the registry, `wong2` and `cursor.directory` now take
> web-form submissions. Only `punkpeye` and `appcypher` still accept PRs.

## Canonical metadata (reuse everywhere)

- **Name:** Feedbagel
- **Registry name:** `io.github.prototypr/feedbagel`
- **Package:** `feedbagel-mcp` (npm)
- **Repo:** https://github.com/Prototypr/feedbagel-mcp
- **Homepage:** https://feedbagel.com/docs#mcp
- **License:** MIT
- **Language:** TypeScript
- **Transport:** stdio
- **Auth:** API key (`FEEDBAGEL_API_KEY`, prefix `fb_…`, Agent scope)
- **Tools:** 17 (6 read discovery, 1 read account, 10 write follows/webhooks)
- **Category:** RSS / Content / Search / Productivity

### One-liners

- **Short (under 80 chars):** "Follow RSS feeds and manage webhook subscriptions through Feedbagel."
- **Medium:** "MCP server for Feedbagel. Search feeds, follow them, and route new entries to webhooks. 17 tools, stdio, API-key auth."
- **Long:** "Feedbagel is a feed reader with a clean v1 API. This MCP server gives agents 17 tools to search the feed catalog, follow feeds on the user's behalf, and create webhook subscriptions that push new entries to any URL. Useful for content monitoring, newsletter automation, and research workflows."

### Tags
`rss`, `atom`, `feeds`, `content`, `webhooks`, `monitoring`, `news`, `automation`

---

## 1. Official MCP Registry (registry.modelcontextprotocol.io)

Namespace `io.github.prototypr/*` — validated via GitHub auth (Graeme is a
Prototypr org admin). Prereqs already done in this repo: `mcpName` in
package.json + `server.json`.

```bash
# package must be on npm first, carrying the mcpName field
npm publish --access public          # publishes 0.1.1 with mcpName

mcp-publisher login github           # device-auth in browser
mcp-publisher publish                # reads ./server.json

# verify
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.prototypr/feedbagel"
```

This one feeds Glama, cursor.directory auto-detection, and several others
downstream, so it is the highest-leverage submission.

---

## 2. PR-based directories

### punkpeye/awesome-mcp-servers  — ACCEPTS PRs
- Section: `### 🔎 Search & Data Extraction` (already hosts other RSS servers)
- Icons: `📇` TypeScript, `☁️` Cloud Service
- Entry:
  ```markdown
  - [Prototypr/feedbagel-mcp](https://github.com/Prototypr/feedbagel-mcp) 📇 ☁️ - Search a curated RSS feed index, follow feeds, and route new entries to webhooks. 17 tools, run via `npx -y feedbagel-mcp`.
  ```

### appcypher/awesome-mcp-servers  — ACCEPTS PRs
- Section: `## 🔍 Search & Web`, append to the BOTTOM of the category
- Icon `<img>` required; one entry per PR; alphabetised by maintainer later
- Entry:
  ```markdown
  - <img src="https://feedbagel.com/favicon.ico" height="14"/> [Feedbagel](https://github.com/Prototypr/feedbagel-mcp) - Search a curated RSS feed index, follow feeds, and route new entries to webhooks via the Feedbagel API.
  ```

---

## 3. Web-form / auto-indexed directories (no PR)

| Directory | URL | Method |
|---|---|---|
| Smithery | https://smithery.ai/new | Sign in, point at the GitHub repo; add `smithery.yaml` for a richer card (template below) |
| mcp.so | https://mcp.so/submit | Web form |
| Glama | https://glama.ai/mcp/servers | Auto-discovers from npm/registry; usually no action |
| PulseMCP | https://www.pulsemcp.com/submit | Web form |
| MCP Market | https://mcpmarket.com/submit | Web form |
| wong2/awesome-mcp-servers | https://mcpservers.org/submit | Web form (repo says "we do not accept PRs") |
| cursor.directory | https://cursor.directory/plugins/new | Web form; paste repo URL — it auto-detects the repo's `.mcp.json` (already added) and runs a security scan |

---

## smithery.yaml (optional, for a richer Smithery card)

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

## Status checklist

- [x] README pushed to GitHub repo
- [x] npm package published (`npm view feedbagel-mcp version`)
- [x] GitHub repo topics: mcp, model-context-protocol, rss, feeds, …
- [x] GitHub repo homepage + description set
- [x] `mcpName` added to package.json, `server.json` created
- [x] `.mcp.json` added for cursor.directory auto-detection
- [ ] npm 0.1.1 published (carries mcpName) — needs `npm login` as prototypr
- [ ] Official registry publish (`mcp-publisher publish`)
- [ ] punkpeye PR opened
- [ ] appcypher PR opened
- [ ] Web forms: Smithery, mcp.so, PulseMCP, MCP Market, mcpservers.org, cursor.directory
