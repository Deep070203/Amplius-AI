// TODO: Move to .env file

const MCP_SERVER_COMMAND = process.env.MCP_SERVER_COMMAND!;
const MCP_SERVER_ARGS = JSON.parse(process.env.MCP_SERVER_ARGS || "[]")!;
const DEBUG = process.env.DEBUG === "true";

if (!MCP_SERVER_COMMAND) {
  throw new Error("MCP_SERVER_COMMAND is not set");
}

if (!MCP_SERVER_ARGS) {
  throw new Error("MCP_SERVER_ARGS is not set");
}

export {
  MCP_SERVER_COMMAND,
  MCP_SERVER_ARGS,
  DEBUG
};