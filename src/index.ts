#!/usr/bin/env node
// feedbagel-mcp — Model Context Protocol server for the feedbagel API.
//
// Reads FEEDBAGEL_API_KEY from env and exposes the v1 tool surface over
// stdio. Agents register this binary as an MCP server; their LLM can
// then invoke tools that hit api.feedbagel.com on the user's behalf.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

import { FeedbagelClient } from "./client.js";
import { TOOLS } from "./tools.js";

const apiKey = process.env.FEEDBAGEL_API_KEY;
if (!apiKey) {
  console.error(
    "feedbagel-mcp: FEEDBAGEL_API_KEY is not set. Mint a key at https://feedbagel.com/dashboard/keys (pick 'Agent') and add it to your MCP server config.",
  );
  process.exit(1);
}

const client = new FeedbagelClient({
  apiKey,
  baseUrl: process.env.FEEDBAGEL_API_BASE,
});

const server = new Server(
  { name: "feedbagel-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map((t) => ({
    name: t.name,
    description: `[${t.scope}] ${t.description}`,
    inputSchema: zodToJsonSchema(t.inputSchema, { target: "openApi3" }),
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find((t) => t.name === req.params.name);
  if (!tool) {
    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }],
    };
  }
  const parsed = tool.inputSchema.safeParse(req.params.arguments ?? {});
  if (!parsed.success) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Invalid arguments: ${parsed.error.message}`,
        },
      ],
    };
  }
  try {
    const result = await tool.handler(parsed.data, client);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    const e = err as Error & { status?: number; body?: unknown };
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { error: e.message, status: e.status, body: e.body },
            null,
            2,
          ),
        },
      ],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
