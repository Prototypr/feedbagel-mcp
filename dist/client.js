// Thin HTTP wrapper around the feedbagel v1 API.
//
// Every request goes out with the user's Bearer token. The server enforces
// auth, scopes, and rate limits; this client is intentionally dumb.
const DEFAULT_BASE = "https://api.feedbagel.com";
export const VERSION = "0.1.4";
export class FeedbagelClient {
    apiKey;
    baseUrl;
    // Sent as X-FeedBagel-Client so the API can tell which agent host (Claude,
    // Cursor, ...) is behind a key. Refined once the MCP handshake names it.
    clientLabel = `feedbagel-mcp/${VERSION}`;
    constructor(opts) {
        if (!opts.apiKey)
            throw new Error("FEEDBAGEL_API_KEY is required");
        this.apiKey = opts.apiKey;
        this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE).replace(/\/$/, "");
    }
    // The tool behind the next requests (X-FeedBagel-Tool), so the API's
    // ledger can say "search_feeds from claude-ai" rather than just the path.
    tool = null;
    forTool(name) {
        const c = new FeedbagelClient({ apiKey: this.apiKey, baseUrl: this.baseUrl });
        c.clientLabel = this.clientLabel;
        c.tool = name;
        return c;
    }
    setHost(name, version) {
        const host = name ? `${name}${version ? `/${version}` : ""}` : "";
        this.clientLabel = host ? `feedbagel-mcp/${VERSION} (${host})` : `feedbagel-mcp/${VERSION}`;
    }
    async request(method, path, body) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "X-FeedBagel-Client": this.clientLabel,
                "User-Agent": this.clientLabel,
                ...(this.tool ? { "X-FeedBagel-Tool": this.tool } : {}),
                ...(body !== undefined ? { "content-type": "application/json" } : {}),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        const text = await res.text();
        let json = undefined;
        try {
            json = text ? JSON.parse(text) : undefined;
        }
        catch {
            json = { raw: text };
        }
        if (!res.ok) {
            // Surface 429 and 4xx details verbatim so the agent sees the cap info.
            const err = new Error(`HTTP ${res.status} ${res.statusText}`);
            err.status = res.status;
            err.body = json;
            throw err;
        }
        return json;
    }
}
//# sourceMappingURL=client.js.map