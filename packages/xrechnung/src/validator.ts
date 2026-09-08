import { XMLParser } from 'fast-xml-parser';

export function validateInvoice(xml: string): boolean {
  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);
    
    // Check basic EN 16931 rules
    if (!parsed.Invoice) return false;
    if (parsed.Invoice['cbc:CustomizationID'] !== 'urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0') return false;
    if (!parsed.Invoice['cbc:ID']) return false;
    
    return true;
  } catch (err) {
    return false;
  }
}
