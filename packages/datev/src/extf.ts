export function generateExtf(data: any): string {
  // EXTF Header Row 1
  // EXTF;Version;Datenkategorie;Formatname;Formatversion;Erzeugt am;...
  const dateStr = new Date().toISOString().replace(/[:\-T]/g, '').slice(0, 14);
  const header1 = `EXTF;700;21;Buchungsstapel;12;${dateStr};;${data.beraternummer};${data.mandantennummer};20260101;4;20260101;;;;;;;;;;;;;;;;`;
  
  // EXTF Header Row 2
  const header2 = `"Umsatz (ohne Soll/Haben-Kz)";"Soll/Haben-Kennzeichen";"Konto";"Gegenkonto (ohne BU-Schlüssel)";"BU-Schlüssel";"Belegdatum";"Belegfeld 1";"Buchungstext"`;
  
  // Data rows
  const rows = data.entries.map((entry: any) => {
    return `"${entry.amount}";"${entry.sh}";"${entry.account}";"${entry.counterAccount}";"${entry.buKey || ''}";"${entry.date}";"${entry.docNumber || ''}";"${entry.text || ''}"`;
  });
  
  return [header1, header2, ...rows].join('\n');
}

export function parseExtf(csv: string): any {
  const lines = csv.split('\n');
  if (lines.length < 2) throw new Error('Invalid EXTF format');
  
  const header1 = lines[0].split(';');
  if (header1[0] !== 'EXTF') throw new Error('Not an EXTF file');
  
  const entries = lines.slice(2).filter(l => l.trim().length > 0).map(line => {
    const fields = line.split(';');
    return {
      amount: fields[0]?.replace(/"/g, ''),
      sh: fields[1]?.replace(/"/g, ''),
      account: fields[2]?.replace(/"/g, '')
    };
  });
  
  return {
    beraternummer: header1[7],
    mandantennummer: header1[8],
    entries
  };
}

export function validateExtf(csv: string): boolean {
  try {
    const lines = csv.split('\n');
    if (lines.length < 2) return false;
    const header1 = lines[0].split(';');
    return header1[0] === 'EXTF';
  } catch {
    return false;
  }
}
