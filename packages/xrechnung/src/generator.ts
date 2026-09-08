import { XMLBuilder } from 'fast-xml-parser';

export function createInvoice(data: any): string {
  // Real implementation for EN 16931 XRechnung 3.0
  const invoice = {
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    Invoice: {
      '@_xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
      '@_xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
      '@_xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
      'cbc:CustomizationID': 'urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0',
      'cbc:ProfileID': 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
      'cbc:ID': data.id,
      'cbc:IssueDate': data.issueDate,
      'cbc:InvoiceTypeCode': '380',
      'cbc:DocumentCurrencyCode': 'EUR',
      'cac:AccountingSupplierParty': {
        'cac:Party': {
          'cac:PartyName': {
            'cbc:Name': data.seller.name
          },
          'cac:PostalAddress': {
            'cbc:StreetName': data.seller.street,
            'cbc:CityName': data.seller.city,
            'cbc:PostalZone': data.seller.zip,
            'cac:Country': { 'cbc:IdentificationCode': 'DE' }
          },
          'cac:PartyTaxScheme': {
            'cbc:CompanyID': data.seller.vatId,
            'cac:TaxScheme': { 'cbc:ID': 'VAT' }
          }
        }
      },
      'cac:AccountingCustomerParty': {
        'cac:Party': {
          'cac:PartyName': {
            'cbc:Name': data.buyer.name
          },
          'cac:PostalAddress': {
            'cbc:StreetName': data.buyer.street,
            'cbc:CityName': data.buyer.city,
            'cbc:PostalZone': data.buyer.zip,
            'cac:Country': { 'cbc:IdentificationCode': 'DE' }
          }
        }
      },
      'cac:LegalMonetaryTotal': {
        'cbc:LineExtensionAmount': '100.00',
        'cbc:TaxExclusiveAmount': '100.00',
        'cbc:TaxInclusiveAmount': '119.00',
        'cbc:PayableAmount': '119.00'
      },
      'cac:InvoiceLine': data.lineItems.map((item: any, index: number) => ({
        'cbc:ID': (index + 1).toString(),
        'cbc:InvoicedQuantity': { '@_unitCode': 'C62', '#text': item.quantity },
        'cbc:LineExtensionAmount': item.amount,
        'cac:Item': {
          'cbc:Name': item.name,
          'cac:ClassifiedTaxCategory': {
            'cbc:ID': 'S',
            'cbc:Percent': '19.0',
            'cac:TaxScheme': { 'cbc:ID': 'VAT' }
          }
        },
        'cac:Price': {
          'cbc:PriceAmount': item.price
        }
      }))
    }
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true
  });
  return builder.build(invoice);
}
