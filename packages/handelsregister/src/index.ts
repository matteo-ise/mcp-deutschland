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

export function searchCompany(query: string) {
  return [{ name: 'Test GmbH', registerNumber: 'HRB 12345' }];
}

export function getCompanyProfile(registerNumber: string) {
  return { name: 'Test GmbH', registerNumber, status: 'active' };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_company') {
    return {
      content: [{ type: 'text', text: JSON.stringify(searchCompany(request.params.arguments?.query as string)) }]
    };
  }
  if (request.params.name === 'get_company_profile') {
    return {
      content: [{ type: 'text', text: JSON.stringify(getCompanyProfile(request.params.arguments?.registerNumber as string)) }]
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
