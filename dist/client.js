// Thin HTTP wrapper around the feedbagel v1 API.
//
// Every request goes out with the user's Bearer token. The server enforces
// auth, scopes, and rate limits; this client is intentionally dumb.
const DEFAULT_BASE = "https://api.feedbagel.com";
export class FeedbagelClient {
    apiKey;
    baseUrl;
    constructor(opts) {
        if (!opts.apiKey)
            throw new Error("FEEDBAGEL_API_KEY is required");
        this.apiKey = opts.apiKey;
        this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE).replace(/\/$/, "");
    }
    async request(method, path, body) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
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