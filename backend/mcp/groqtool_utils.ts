import Groq from "groq-sdk";
import { callTool } from "./mcp";
import { mcpClient } from "./client";

type GroqToolsInputType = {
    type: "function",
    function: {
        name: string,
        description?: string,
        parameters: Record<string, unknown>
    }
}

export type ToolsListServerResponseType = {
    tools: {
        name: string,
        description?: string,
        inputSchema: Record<string, unknown>
    }[];
}

export type ResponseType = Groq.Chat.ChatCompletionToolMessageParam

export const mapToolstoGroqTools = (toolList: ToolsListServerResponseType): GroqToolsInputType[] => {
    return toolList.tools.map((tool) => ({
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
        }
    }));
};

export const applyToolCalls = async (response: Groq.Chat.ChatCompletion): Promise<ResponseType[]> => {
    if (!response.choices?.[0]?.message?.tool_calls?.length) {
        return [];
    }

    const toolResponse: ResponseType[] = [];
        

    for (const toolCall of response.choices[0].message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = toolCall.function.arguments;
        const toolCallId = toolCall.id;

        const [err, result] = await callTool(mcpClient, toolName, toolArgs);
        
        if (err) {
            toolResponse.push({
              role: "tool",
              content: `ERROR: Tool call failed - ${err}`,
              tool_call_id: toolCallId,
            });
            continue;
        }
        
        if (!result.content?.length) {
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
              throw new Error(
                "Unknown content type returned from tool:" + result.content
              );
          }
        }
      
        return toolResponse;
}