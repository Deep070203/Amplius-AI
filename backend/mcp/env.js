"use strict";
// TODO: Move to .env file
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG = exports.MCP_SERVER_ARGS = exports.MCP_SERVER_COMMAND = void 0;
const MCP_SERVER_COMMAND = process.env.MCP_SERVER_COMMAND;
exports.MCP_SERVER_COMMAND = MCP_SERVER_COMMAND;
const MCP_SERVER_ARGS = JSON.parse(process.env.MCP_SERVER_ARGS || "[]");
exports.MCP_SERVER_ARGS = MCP_SERVER_ARGS;
const DEBUG = process.env.DEBUG === "true";
exports.DEBUG = DEBUG;
if (!MCP_SERVER_COMMAND) {
    throw new Error("MCP_SERVER_COMMAND is not set");
}
if (!MCP_SERVER_ARGS) {
    throw new Error("MCP_SERVER_ARGS is not set");
}
