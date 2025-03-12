"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMcpConfigs = getMcpConfigs;
exports.getMcpServerConfig = getMcpServerConfig;
const fs_1 = require("fs");
const path_1 = require("path");
function getMcpConfigs() {
    try {
        const configPath = (0, path_1.join)(process.cwd(), 'config.json');
        const configFile = (0, fs_1.readFileSync)(configPath, 'utf8');
        // console.log(configFile);
        const config = JSON.parse(configFile);
        // console.log(config.mcpServers);
        return config.mcpServers;
    }
    catch (error) {
        console.error('Error reading MCP configuration:', error);
        return [];
    }
}
function getMcpServerConfig(index = 0) {
    const configs = getMcpConfigs();
    return configs[index] || null;
}
