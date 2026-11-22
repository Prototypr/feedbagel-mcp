// Thin HTTP wrapper around the feedbagel v1 API.
//
// Every request goes out with the user's Bearer token. The server enforces
// auth, scopes, and rate limits; this client is intentionally dumb.

const DEFAULT_BASE = "https://api.feedbagel.com";
export const VERSION = "0.1.3";

export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class FeedbagelClient {
  private apiKey: string;
  private baseUrl: string;
  // Sent as X-FeedBagel-Client so the API can tell which agent host (Claude,
  // Cursor, ...) is behind a key. Refined once the MCP handshake names it.
  private clientLabel = `feedbagel-mcp/${VERSION}`;

  constructor(opts: ClientOptions) {
    if (!opts.apiKey) throw new Error("FEEDBAGEL_API_KEY is required");
    this.apiKey = opts.apiKey;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE).replace(/\/$/, "");
  }

  setHost(name?: string, version?: string): void {
    const host = name ? `${name}${version ? `/${version}` : ""}` : "";
    this.clientLabel = host ? `feedbagel-mcp/${VERSION} (${host})` : `feedbagel-mcp/${VERSION}`;
  }

  async request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "X-FeedBagel-Client": this.clientLabel,
        "User-Agent": this.clientLabel,
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let json: unknown = undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      // Surface 429 and 4xx details verbatim so the agent sees the cap info.
      const err: Error & { status?: number; body?: unknown } = new Error(
        `HTTP ${res.status} ${res.statusText}`,
      );
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json;
  }
}
