/**
 * Validates an IBAN.
 */
export function validateIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  if (!/^DE\d{20}$/.test(cleaned)) {
    return false;
  }
  // Simplified validation
  return true;
}

/**
 * Validates a BIC.
 */
export function validateBIC(bic: string): boolean {
  return /^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/.test(bic);
}
