import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { generateUstvaXml, validateUstva } from './ustva.js';

const server = new Server(
  {
    name: 'mcp-elster',
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
        name: 'generate_ustva_xml',
        description: 'Generates USt-VA XML from input data',
        inputSchema: {
          type: 'object',
          properties: {
            year: { type: 'number' },
            period: { type: 'string' },
            revenue: { type: 'number' },
            tax: { type: 'number' }
          },
          required: ['year', 'period', 'revenue', 'tax']
        }
      },
      {
        name: 'validate_ustva',
        description: 'Validates the generated USt-VA XML',
        inputSchema: {
          type: 'object',
          properties: {
            xml: { type: 'string' }
          },
          required: ['xml']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'generate_ustva_xml') {
    const xml = generateUstvaXml(request.params.arguments as any);
    return {
      content: [{ type: 'text', text: xml }]
    };
  }
  if (request.params.name === 'validate_ustva') {
    const isValid = validateUstva(request.params.arguments?.xml as string);
    return {
      content: [{ type: 'text', text: JSON.stringify({ valid: isValid }) }]
    };
  }
  throw new Error('Tool not found');
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ELSTER MCP Server running on stdio');
}
main().catch(console.error);
