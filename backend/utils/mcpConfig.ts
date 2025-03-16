import { readFileSync } from 'fs';
import { join } from 'path';

interface McpServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

interface Config {
  mcpServers: McpServerConfig[];
}

export function getMcpConfigs(): McpServerConfig[] {
  try {
    const configPath = join(process.cwd(), 'config.json');
    const configFile = readFileSync(configPath, 'utf8');
    // console.log(configFile);
    const config: Config = JSON.parse(configFile);
    // console.log(config.mcpServers);
    return config.mcpServers;
  } catch (error) {
    console.error('Error reading MCP configuration:', error);
    return [];
  }
}

export function getMcpServerConfig(index: number = 0): McpServerConfig | null {
  const configs = getMcpConfigs();
  return configs[index] || null;
}

