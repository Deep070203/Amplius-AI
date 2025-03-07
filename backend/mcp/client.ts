import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { MCP_SERVER_ARGS, MCP_SERVER_COMMAND } from "./env";

const transport = new StdioClientTransport({
  command: MCP_SERVER_COMMAND,
  args: MCP_SERVER_ARGS,
});

const mcpClient = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

mcpClient.connect(transport).catch((error) => {
  console.error("Failed to connect to MCP server:", error);
  process.exit(1);
});

console.log(mcpClient.listTools());

export { mcpClient };
