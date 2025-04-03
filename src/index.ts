#!/usr/bin/env node

/**
 * MCP server for Bear note-taking app.
 * Implements tools to interact with Bear via x-callback-url.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BearClient } from "./bear.js";

/**
 * Parse command line arguments
 * Example: node index.js --param=value
 */
function parseArgs() {
  const args: Record<string, string> = {};
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      args[key] = value;
    }
  });
  return args;
}

// Create a Bear client
const bearClient = new BearClient();

/**
 * Create an MCP server with tool capabilities for Bear notes interaction
 */
const server = new Server(
  {
    name: "mcp-server-bear",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes tools for Bear note-taking app interaction.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "write_note",
        description: "Write a note to Bear",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the note"
            },
            text: {
              type: "string",
              description: "Text content of the note with markdown format"
            },
            tags: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Tags for the note (optional)"
            }
          },
          required: ["title", "text"]
        }
      },
      {
        name: "open_note",
        description: "Open a note in Bear",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the note to open (mutually exclusive with id)"
            },
            id: {
              type: "string",
              description: "ID of the note to open (mutually exclusive with title)"
            }
          },
          required: []
        }
      },
      {
        name: "search_notes",
        description: "Search for notes in Bear",
        inputSchema: {
          type: "object",
          properties: {
            term: {
              type: "string",
              description: "Search term"
            },
            tag: {
              type: "string",
              description: "Specific tag to search in (optional)"
            }
          },
          required: ["term"]
        }
      }
    ]
  };
});

/**
 * Handler for Bear tools.
 * Handle different tools based on their name.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "write_note": {
      const title = String(request.params.arguments?.title || "");
      const text = String(request.params.arguments?.text || "");
      let tags: string[] = [];
      
      if (request.params.arguments?.tags && Array.isArray(request.params.arguments.tags)) {
        tags = request.params.arguments.tags.map(tag => String(tag));
      }

      if (!title || !text) {
        throw new Error("Title and text are required");
      }

      const result = await bearClient.createNote({ title, text, tags });

      return {
        content: [{
          type: "text",
          text: `Note created in Bear: ${title}`
        }]
      };
    }

    case "open_note": {
      const title = request.params.arguments?.title ? String(request.params.arguments.title) : undefined;
      const id = request.params.arguments?.id ? String(request.params.arguments.id) : undefined;

      if (!title && !id) {
        throw new Error("Either title or id must be provided");
      }

      const result = await bearClient.openNote({ title, id });

      return {
        content: [{
          type: "text",
          text: `Bear note opened: ${title || `ID: ${id}`}`
        }]
      };
    }

    case "search_notes": {
      const term = String(request.params.arguments?.term || "");
      const tag = request.params.arguments?.tag ? String(request.params.arguments.tag) : undefined;

      if (!term) {
        throw new Error("Search term is required");
      }

      const result = await bearClient.searchNotes({ term, tag });

      return {
        content: [{
          type: "text",
          text: `Search executed in Bear for: ${term}${tag ? ` with tag: ${tag}` : ''}`
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
