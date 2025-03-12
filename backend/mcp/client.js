"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const mcpConfig_1 = require("../utils/mcpConfig");
const mcpClient = new index_js_1.Client({
    name: "amplius-client",
    version: "1.0.0",
}, {
    capabilities: {},
});
exports.mcpClient = mcpClient;
const mcpConfigs = (0, mcpConfig_1.getMcpConfigs)();
// console.log(mcpConfigs);
for (const MCPserver of mcpConfigs) {
    const transport = new stdio_js_1.StdioClientTransport({ command: MCPserver.command, args: MCPserver.args });
    mcpClient.connect(transport).catch((error) => {
        console.error("Failed to connect to MCP server:", error);
        process.exit(1);
    });
}
console.log(mcpClient.listTools());
