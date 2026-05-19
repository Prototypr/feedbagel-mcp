// Tool definitions for the MCP server.
//
// Each entry is a JSON-schema'd input shape + an async handler that calls
// the v1 API. Scopes here are informational (the server enforces them);
// they're included so an agent inspecting the catalog knows which tools
// will hit write caps.
import { z } from "zod";
const FeedIdInput = z.object({
    feed_id: z.number().int().positive().describe("Numeric feed id"),
});
const WebhookIdInput = z.object({
    webhook_id: z.string().describe("Webhook subscriber UUID"),
});
export const TOOLS = [
    {
        name: "list_subscriptions",
        description: "Unified list of the user's feed follows and webhook subscriptions. Each item is tagged kind: 'follow' or 'webhook'.",
        scope: "read",
        inputSchema: z.object({}),
        handler: (_, c) => c.request("GET", "/api/v1/subscriptions"),
    },
    {
        name: "follow_feed",
        description: "Add a feed to the user's follow list. Idempotent. Counts against the subscription cap.",
        scope: "write",
        inputSchema: FeedIdInput,
        handler: (input, c) => c.request("POST", "/api/v1/follow", input),
    },
    {
        name: "unfollow_feed",
        description: "Remove a feed from the user's follow list.",
        scope: "write",
        inputSchema: FeedIdInput,
        handler: ({ feed_id }, c) => c.request("DELETE", `/api/v1/follow/${feed_id}`),
    },
    {
        name: "list_webhooks",
        description: "List all webhook subscriptions owned by the user.",
        scope: "read",
        inputSchema: z.object({}),
        handler: (_, c) => c.request("GET", "/api/v1/webhooks"),
    },
    {
        name: "create_webhook",
        description: "Create a webhook subscription. The response includes webhook_secret ONCE; the bot must persist it for HMAC validation. Counts against the subscription cap.",
        scope: "write",
        inputSchema: z.object({
            webhook_url: z.string().url(),
            subscriber_name: z.string().max(120).optional(),
            notes: z.string().max(500).optional(),
        }),
        handler: (input, c) => c.request("POST", "/api/v1/webhooks", input),
    },
    {
        name: "delete_webhook",
        description: "Delete a webhook subscription and all its feed attachments.",
        scope: "write",
        inputSchema: WebhookIdInput,
        handler: ({ webhook_id }, c) => c.request("DELETE", `/api/v1/webhooks/${webhook_id}`),
    },
    {
        name: "pause_webhook",
        description: "Pause deliveries for a webhook subscription. Existing attachments stay; the poller skips this subscriber until resumed.",
        scope: "write",
        inputSchema: WebhookIdInput,
        handler: ({ webhook_id }, c) => c.request("POST", `/api/v1/webhooks/${webhook_id}/pause`),
    },
    {
        name: "resume_webhook",
        description: "Resume deliveries for a paused webhook subscription.",
        scope: "write",
        inputSchema: WebhookIdInput,
        handler: ({ webhook_id }, c) => c.request("POST", `/api/v1/webhooks/${webhook_id}/resume`),
    },
    {
        name: "attach_feed_to_webhook",
        description: "Attach a feed to a webhook subscription so its new entries get delivered.",
        scope: "write",
        inputSchema: WebhookIdInput.merge(FeedIdInput),
        handler: ({ webhook_id, feed_id }, c) => c.request("POST", `/api/v1/webhooks/${webhook_id}/feeds`, {
            feed_id,
        }),
    },
    {
        name: "detach_feed_from_webhook",
        description: "Stop delivering a feed's entries to a webhook subscription.",
        scope: "write",
        inputSchema: WebhookIdInput.merge(FeedIdInput),
        handler: ({ webhook_id, feed_id }, c) => c.request("DELETE", `/api/v1/webhooks/${webhook_id}/feeds/${feed_id}`),
    },
    {
        name: "me",
        description: "Return the authenticated account's email, plan, and status. Use as a smoke test before other calls.",
        scope: "read",
        inputSchema: z.object({}),
        handler: (_, c) => c.request("GET", "/api/v1/me"),
    },
    // --- discovery (public reads, but the MCP still authenticates) -------
    {
        name: "search_feeds",
        description: "Search the feed catalog by keyword. Matches feed titles, urls, and hostnames. Returns up to 20 results with recency stats.",
        scope: "read",
        inputSchema: z.object({
            query: z.string().min(1).max(120),
        }),
        handler: ({ query }, c) => c.request("GET", `/api/v1/search-feeds/keyword/${encodeURIComponent(query)}`),
    },
    {
        name: "search_feeds_by_url",
        description: "Find feeds at a specific hostname or URL fragment. Use this when the user already knows the site (e.g. 'theverge.com') and wants its feeds.",
        scope: "read",
        inputSchema: z.object({
            url_or_host: z.string().min(1).max(200),
        }),
        handler: ({ url_or_host }, c) => c.request("GET", `/api/v1/search-feeds/url/${encodeURIComponent(url_or_host)}`),
    },
    {
        name: "get_host_metadata",
        description: "Get metadata (title, description, favicon, feed list) for a host domain.",
        scope: "read",
        inputSchema: z.object({
            host: z.string().min(1).max(200),
        }),
        handler: ({ host }, c) => c.request("GET", `/api/v1/host/${encodeURIComponent(host)}/metadata`),
    },
    {
        name: "list_entries",
        description: "List recent entries across all feeds, paginated. Use sort_by='published' (default) for newest first.",
        scope: "read",
        inputSchema: z.object({
            page: z.number().int().positive().default(1),
            per_page: z.number().int().min(1).max(100).default(20),
            sort_by: z.enum(["published", "created"]).default("published"),
            sort_order: z.enum(["asc", "desc"]).default("desc"),
        }),
        handler: (input, c) => {
            const qs = new URLSearchParams({
                page: String(input.page),
                per_page: String(input.per_page),
                sort_by: input.sort_by,
                sort_order: input.sort_order,
            }).toString();
            return c.request("GET", `/api/v1/entries?${qs}`);
        },
    },
    {
        name: "get_entry",
        description: "Fetch a single entry by numeric id.",
        scope: "read",
        inputSchema: z.object({
            entry_id: z.number().int().positive(),
        }),
        handler: ({ entry_id }, c) => c.request("GET", `/api/v1/entry/${entry_id}`),
    },
    {
        name: "get_entry_by_slug",
        description: "Fetch a single entry by its URL slug (matches /post/<slug> on the site).",
        scope: "read",
        inputSchema: z.object({
            slug: z.string().min(1).max(300),
        }),
        handler: ({ slug }, c) => c.request("GET", `/api/v1/entry/slug/${encodeURIComponent(slug)}`),
    },
];
//# sourceMappingURL=tools.js.map