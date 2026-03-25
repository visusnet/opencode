import z from "zod"
import { Tool } from "./tool"
import { MCP } from "../mcp"
import DESCRIPTION from "./mcp-resource.txt"

export const McpReadResourceTool = Tool.define("mcp_read_resource", {
  description: DESCRIPTION,
  parameters: z.object({
    server: z.string().describe("The MCP server name"),
    uri: z.string().describe("The resource URI to read"),
  }),
  async execute(params) {
    const result = await MCP.readResource(params.server, params.uri)
    if (!result) {
      return {
        title: params.uri,
        output: `Resource not found or server "${params.server}" not connected`,
        metadata: {},
      }
    }

    const output = result.contents
      .map((c) => ("text" in c && c.text ? c.text : `[Binary content: ${c.mimeType}]`))
      .join("\n")

    return {
      title: params.uri,
      output,
      metadata: {},
    }
  },
})
