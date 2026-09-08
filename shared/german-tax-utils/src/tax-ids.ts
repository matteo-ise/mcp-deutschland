/**
 * Validates a German VAT ID (USt-IdNr).
 * Format: DE + 9 digits.
 */
export function validateUStId(vatId: string): boolean {
  if (!/^DE\d{9}$/.test(vatId)) {
    return false;
  }
  return true; // Simplified for this implementation
}

/**
 * Validates a German Steuernummer.
 * This varies by state, but commonly 10 or 11 digits.
 */
export function validateSteuernummer(taxId: string): boolean {
  const cleaned = taxId.replace(/[\/\s]/g, '');
  return /^\d{10,11}$/.test(cleaned);
}
