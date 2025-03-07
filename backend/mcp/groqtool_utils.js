"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyToolCalls = exports.mapToolstoGroqTools = void 0;
const mcp_1 = require("./mcp");
const client_1 = require("./client");
const mapToolstoGroqTools = (toolList) => {
    return toolList.tools.map((tool) => ({
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
        }
    }));
};
exports.mapToolstoGroqTools = mapToolstoGroqTools;
const applyToolCalls = (response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    if (!((_d = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.tool_calls) === null || _d === void 0 ? void 0 : _d.length)) {
        return [];
    }
    const toolResponse = [];
    for (const toolCall of response.choices[0].message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = toolCall.function.arguments;
        const toolCallId = toolCall.id;
        const [err, result] = yield (0, mcp_1.callTool)(client_1.mcpClient, toolName, toolArgs);
        if (err) {
            toolResponse.push({
                role: "tool",
                content: `ERROR: Tool call failed - ${err}`,
                tool_call_id: toolCallId,
            });
            continue;
        }
        if (!((_e = result.content) === null || _e === void 0 ? void 0 : _e.length)) {
            toolResponse.push({
                role: "tool",
                content: `WARNING: No content returned from tool`,
                tool_call_id: toolCallId,
            });
            continue;
        }
        switch (result.content[0].type) {
            case "text":
                toolResponse.push({
                    role: "tool",
                    content: result.content[0].text,
                    tool_call_id: toolCallId,
                });
                break;
            default:
                // console.log("Unknown content type returned from tool:", result.content);
                throw new Error("Unknown content type returned from tool:" + result.content);
        }
    }
    return toolResponse;
});
exports.applyToolCalls = applyToolCalls;
