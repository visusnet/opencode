import z from "zod"
import { Tool } from "./tool"
import { MCP } from "../mcp"
import DESCRIPTION from "./mcp-list-resources.txt"

export const McpListResourcesTool = Tool.define("mcp_list_resources", {
  description: DESCRIPTION,
  parameters: z.object({
    server: z.string().optional().describe("Filter by MCP server name"),
  }),
  async execute(params) {
    const match = (s: { client: string }) => !params.server || s.client === params.server

    const [tpls, res] = await Promise.all([MCP.resourceTemplates(), MCP.resources()])

    const templates = Object.values(tpls)
      .filter(match)
      .map((t) => ({ server: t.client, name: t.name, uriTemplate: t.uriTemplate, description: t.description }))

    const resources = Object.values(res)
      .filter(match)
      .map((r) => ({ server: r.client, name: r.name, uri: r.uri, description: r.description }))

    const items = [...templates, ...resources]

    if (items.length === 0) {
      return {
        title: "MCP Resources",
        output: "No resources or resource templates found",
        metadata: {},
      }
    }

    return {
      title: "MCP Resources",
      output: JSON.stringify(items, null, 2),
      metadata: {},
    }
  },
})
