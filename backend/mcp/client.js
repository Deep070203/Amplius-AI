"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const env_1 = require("./env");
const transport = new stdio_js_1.StdioClientTransport({
    command: env_1.MCP_SERVER_COMMAND,
    args: env_1.MCP_SERVER_ARGS,
});
const mcpClient = new index_js_1.Client({
    name: "example-client",
    version: "1.0.0",
}, {
    capabilities: {},
});
exports.mcpClient = mcpClient;
mcpClient.connect(transport).catch((error) => {
    console.error("Failed to connect to MCP server:", error);
    process.exit(1);
});
console.log(mcpClient.listTools());
