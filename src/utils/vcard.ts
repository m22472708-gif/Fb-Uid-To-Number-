import { ContactRecord } from '../types';

export function generateVCard(contact: ContactRecord): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.name}${contact.banglaName ? ` (${contact.banglaName})` : ''}`,
    `N:${contact.name};;;;`,
    `TEL;TYPE=CELL,VOICE:${contact.phone}`,
    contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : '',
    contact.location ? `ADR;TYPE=HOME:;;;${contact.location};;;Bangladesh` : '',
    contact.fbUid ? `NOTE:Facebook UID: ${contact.fbUid}\\nVerified Directory Entry` : '',
    contact.fbProfileUrl || `https://facebook.com/${contact.fbUid}` ? `URL:https://facebook.com/${contact.fbUid}` : '',
    'END:VCARD'
  ].filter(Boolean);

  return lines.join('\r\n');
}

export function downloadVCard(contact: ContactRecord): void {
  const vcard = generateVCard(contact);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${contact.name.replace(/\s+/g, '_')}_contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
