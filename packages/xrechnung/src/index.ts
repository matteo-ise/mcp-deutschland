import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createInvoice } from './generator.js';
import { validateInvoice } from './validator.js';
import { parseInvoice } from './parser.js';
import { z } from 'zod';

const server = new Server(
  {
    name: 'mcp-xrechnung',
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
        name: 'create_invoice',
        description: 'Creates a valid EN 16931 XRechnung XML from structured input.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            issueDate: { type: 'string' },
            seller: { type: 'object' },
            buyer: { type: 'object' },
            lineItems: { type: 'array' }
          },
          required: ['id', 'issueDate', 'seller', 'buyer', 'lineItems']
        }
      },
      {
        name: 'validate_invoice',
        description: 'Validates an XRechnung XML against EN 16931 rules.',
        inputSchema: {
          type: 'object',
          properties: {
            xml: { type: 'string' }
          },
          required: ['xml']
        }
      },
      {
        name: 'convert_to_zugferd',
        description: 'Wraps XRechnung XML into ZUGFeRD format description.',
        inputSchema: {
          type: 'object',
          properties: {
            xml: { type: 'string' }
          },
          required: ['xml']
        }
      },
      {
        name: 'parse_invoice',
        description: 'Extracts structured data from XRechnung/ZUGFeRD XML.',
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
  if (request.params.name === 'create_invoice') {
    const xml = createInvoice(request.params.arguments as any);
    return {
      content: [{ type: 'text', text: xml }]
    };
  }
  if (request.params.name === 'validate_invoice') {
    const isValid = validateInvoice(request.params.arguments?.xml as string);
    return {
      content: [{ type: 'text', text: JSON.stringify({ valid: isValid }) }]
    };
  }
  if (request.params.name === 'convert_to_zugferd') {
    return {
      content: [{ type: 'text', text: 'ZUGFeRD Conversion Stub' }]
    };
  }
  if (request.params.name === 'parse_invoice') {
    const data = parseInvoice(request.params.arguments?.xml as string);
    return {
      content: [{ type: 'text', text: JSON.stringify(data) }]
    };
  }
  throw new Error('Tool not found');
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('XRechnung MCP Server running on stdio');
}
main().catch(console.error);
