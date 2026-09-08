import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { generateExtf, parseExtf, validateExtf } from './extf.js';

const server = new Server(
  {
    name: 'mcp-datev',
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
        name: 'generate_extf',
        description: 'Generates a valid DATEV EXTF CSV file from journal entries',
        inputSchema: {
          type: 'object',
          properties: {
            beraternummer: { type: 'string' },
            mandantennummer: { type: 'string' },
            entries: { type: 'array' }
          },
          required: ['beraternummer', 'mandantennummer', 'entries']
        }
      },
      {
        name: 'parse_extf',
        description: 'Parses an existing EXTF file into structured data',
        inputSchema: {
          type: 'object',
          properties: {
            csv: { type: 'string' }
          },
          required: ['csv']
        }
      },
      {
        name: 'validate_extf',
        description: 'Validates EXTF header and data rows',
        inputSchema: {
          type: 'object',
          properties: {
            csv: { type: 'string' }
          },
          required: ['csv']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'generate_extf') {
    const csv = generateExtf(request.params.arguments as any);
    return {
      content: [{ type: 'text', text: csv }]
    };
  }
  if (request.params.name === 'parse_extf') {
    const data = parseExtf(request.params.arguments?.csv as string);
    return {
      content: [{ type: 'text', text: JSON.stringify(data) }]
    };
  }
  if (request.params.name === 'validate_extf') {
    const isValid = validateExtf(request.params.arguments?.csv as string);
    return {
      content: [{ type: 'text', text: JSON.stringify({ valid: isValid }) }]
    };
  }
  throw new Error('Tool not found');
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DATEV MCP Server running on stdio');
}
main().catch(console.error);
