import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'mcp-handelsregister',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_company',
        description: 'Search for a company by name, location, or register number',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          },
          required: ['query']
        }
      },
      {
        name: 'get_company_profile',
        description: 'Get structured company profile data',
        inputSchema: {
          type: 'object',
          properties: {
            registerNumber: { type: 'string' }
          },
          required: ['registerNumber']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_company') {
    // Stub implementation
    return {
      content: [{ type: 'text', text: JSON.stringify([{ name: 'Test GmbH', registerNumber: 'HRB 12345' }]) }]
    };
  }
  if (request.params.name === 'get_company_profile') {
    // Stub implementation
    return {
      content: [{ type: 'text', text: JSON.stringify({ name: 'Test GmbH', registerNumber: request.params.arguments?.registerNumber, status: 'active' }) }]
    };
  }
  throw new Error('Tool not found');
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Handelsregister MCP Server running on stdio');
}
main().catch(console.error);
