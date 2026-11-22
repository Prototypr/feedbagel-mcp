// Admin tools for operating the feed poller. Registered only when
// FEEDBAGEL_ADMIN=1, and every call needs an Internal (admin) key: the
// /api/v1/admin/* routes return 403 for any other key type.
import { z } from "zod";
const ERROR_KINDS = [
    "proxy",
    "robots",
    "not_found",
    "parse",
    "ssl",
    "server_error",
    "forbidden",
    "other",
    "unknown",
];
const FeedIds = z
    .array(z.number().int().positive())
    .min(1)
    .max(500)
    .describe("Feed ids (up to 500)");
function query(params) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null)
            qs.set(k, String(v));
    }
    const s = qs.toString();
    return s ? `?${s}` : "";
}
export const ADMIN_TOOLS = [
    {
        name: "admin_poller_stats",
        description: "Poller health: polling feed count, how many are due now, the oldest overdue age, blocked/failing/never-polled counts and polls in the last hour. The scheduler dispatches 40 feeds a minute.",
        scope: "read",
        inputSchema: z.object({}),
        handler: (_, c) => c.request("GET", "/api/v1/admin/poller"),
    },
    {
        name: "admin_proxy_status",
        description: "Floxy proxy account as last checked by the hourly plan guard: balance, every active plan with GB left and expiry, warnings, automatic spend this month, the feeds allowed to use the residential fallback, and last runs of the poller's scheduled jobs.",
        scope: "read",
        inputSchema: z.object({}),
        handler: (_, c) => c.request("GET", "/api/v1/admin/proxy"),
    },
    {
        name: "admin_feed_status",
        description: "Full indexing state of one feed by id or exact URL: tier, AI flag, blocked/failures, last error (proxy credentials redacted), schedule and saved entry counts.",
        scope: "read",
        inputSchema: z.object({
            feed_id: z.number().int().positive().optional(),
            url: z.string().url().optional(),
        }),
        handler: ({ feed_id, url }, c) => {
            if (!feed_id && !url)
                throw new Error("Pass feed_id or url");
            return c.request("GET", `/api/v1/admin/feeds${query({ id: feed_id, url })}`);
        },
    },
    {
        name: "admin_list_failed_feeds",
        description: "Polling feeds that are blocked or failing, with counts per error kind (proxy, robots, not_found, parse, ssl, server_error, forbidden, other). Each row carries its tier and featured flag. Filter by kind and/or tier (tier_a = the curated feeds readers see); page with limit/offset.",
        scope: "read",
        inputSchema: z.object({
            kind: z.enum(ERROR_KINDS).optional(),
            tier: z.enum(["tier_a", "tier_b", "coverage"]).optional(),
            blocked_only: z.boolean().optional(),
            limit: z.number().int().min(1).max(500).optional(),
            offset: z.number().int().min(0).optional(),
        }),
        handler: ({ kind, tier, blocked_only, limit, offset }, c) => c.request("GET", `/api/v1/admin/feeds/failed${query({
            kind,
            tier,
            blocked_only: blocked_only ? 1 : undefined,
            limit,
            offset,
        })}`),
    },
    {
        name: "admin_poll_now",
        description: "Queue feeds for the next scheduler tick (jumps the backlog) and clear their failure breaker, which unblocks them. Feeds with polling off are skipped.",
        scope: "write",
        inputSchema: z.object({ feed_ids: FeedIds }),
        handler: (input, c) => c.request("POST", "/api/v1/admin/feeds/poll", input),
    },
    {
        name: "admin_set_feed_settings",
        description: "Change feeds' indexing. Target either feed_ids or select_tier (every feed currently in that tier, e.g. slow the whole coverage tier). tier: tier_a (poll + crawl + AI), tier_b (poll, raw entries), coverage (headline-only, hidden from readers), off. ai_enabled toggles the AI summary/rating pass (costs an AI call per entry). Setting tier_a turns AI on unless ai_enabled is false. proxy_residential_ok lets the poller fall back to metered residential IPs ($2/GB) for a feed that datacenter IPs cannot reach (Cloudflare 403); used only after the datacenter proxy is blocked.",
        scope: "write",
        inputSchema: z.object({
            feed_ids: FeedIds.optional(),
            select_tier: z.enum(["tier_a", "tier_b", "coverage", "off"]).optional(),
            tier: z.enum(["tier_a", "tier_b", "coverage", "off"]).optional(),
            ai_enabled: z.boolean().optional(),
            poll_interval_minutes: z.number().int().min(5).max(43200).optional(),
            proxy_residential_ok: z.boolean().optional(),
        }),
        handler: (input, c) => {
            if (!input.feed_ids && !input.select_tier)
                throw new Error("Pass feed_ids or select_tier");
            return c.request("POST", "/api/v1/admin/feeds/settings", input);
        },
    },
    {
        name: "admin_add_feed",
        description: "Add a feed by URL (or re-enable an existing one) with polling and crawl on, and queue its first poll. AI stays off unless ai_enabled is true.",
        scope: "write",
        inputSchema: z.object({
            url: z.string().url(),
            ai_enabled: z.boolean().optional(),
        }),
        handler: (input, c) => c.request("POST", "/api/v1/admin/feeds/add", input),
    },
];
//# sourceMappingURL=admin-tools.js.map