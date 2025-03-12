import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { getMcpConfigs } from "../utils/mcpConfig";

const mcpClient = new Client(
  {
    name: "amplius-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

const mcpConfigs = getMcpConfigs();
// console.log(mcpConfigs);

for (const MCPserver of mcpConfigs) {
  const transport = new StdioClientTransport({command: MCPserver.command, args: MCPserver.args});
  mcpClient.connect(transport).catch((error) => {
    console.error("Failed to connect to MCP server:", error);
    process.exit(1);
  });
}

console.log(mcpClient.listTools());

export { mcpClient };
