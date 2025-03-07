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
exports.callTool = void 0;
const callTool = (client, toolName, inputArgs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const args = JSON.parse(inputArgs);
        const resourceContent = yield client.callTool({
            name: toolName,
            arguments: args,
        });
        return [null, resourceContent];
    }
    catch (error) {
        // console.error("Error parsing arguments:", error);
        return [error.message, null];
    }
});
exports.callTool = callTool;
