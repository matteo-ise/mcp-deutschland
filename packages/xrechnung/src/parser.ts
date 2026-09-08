import { XMLParser } from 'fast-xml-parser';

export function parseInvoice(xml: string): any {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  
  if (!parsed.Invoice) {
    throw new Error('Invalid Invoice XML');
  }

  const invoice = parsed.Invoice;
  
  return {
    id: invoice['cbc:ID'],
    issueDate: invoice['cbc:IssueDate'],
    currency: invoice['cbc:DocumentCurrencyCode'],
    totalAmount: invoice['cac:LegalMonetaryTotal']?.['cbc:PayableAmount']
  };
}
