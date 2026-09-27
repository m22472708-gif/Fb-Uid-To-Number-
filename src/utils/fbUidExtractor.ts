/**
 * Detect Bangladesh mobile network operator by phone prefix
 */
export function detectBdOperator(phone: string): { name: string; color: string; badgeClass: string } {
  const clean = phone.replace(/[^0-9]/g, '');
  
  // Normalize 8801... or 01...
  let prefix = '';
  if (clean.startsWith('8801')) {
    prefix = clean.substring(2, 5); // e.g. 019
  } else if (clean.startsWith('01')) {
    prefix = clean.substring(0, 3); // e.g. 019
  } else if (clean.startsWith('1')) {
    prefix = '0' + clean.substring(0, 2);
  }

  switch (prefix) {
    case '019':
    case '014':
      return { name: 'Banglalink', color: '#ff6600', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200/80 font-semibold' };
    case '017':
    case '013':
      return { name: 'Grameenphone', color: '#00a3e0', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80 font-semibold' };
    case '018':
      return { name: 'Robi', color: '#e60000', badgeClass: 'bg-red-50 text-red-700 border-red-200/80 font-semibold' };
    case '016':
      return { name: 'Airtel', color: '#ff0033', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80 font-semibold' };
    case '015':
      return { name: 'Teletalk', color: '#009933', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold' };
    default:
      return { name: 'Mobile', color: '#2563eb', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80 font-semibold' };
  }
}

/**
 * Format Bangladesh Phone Number to +880 1925-723245
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('880')) {
    const local = clean.substring(3); // e.g. 1925723245
    if (local.length === 10) {
      return `+880 ${local.substring(0, 4)}-${local.substring(4)}`;
    }
    return `+${clean}`;
  } else if (clean.startsWith('01') && clean.length === 11) {
    return `+880 ${clean.substring(1, 5)}-${clean.substring(5)}`;
  }
  return phone;
}

/**
 * Clean & extract UID or username from Facebook input (e.g. URLs, raw UIDs, usernames)
 */
export function parseFbUidInput(input: string): {
  raw: string;
  cleaned: string;
  isUrl: boolean;
  type: 'numeric_uid' | 'username' | 'phone' | 'text';
} {
  const raw = input.trim();
  if (!raw) {
    return { raw: '', cleaned: '', isUrl: false, type: 'text' };
  }

  let cleaned = raw;
  let isUrl = false;

  // Check if URL
  if (raw.includes('facebook.com') || raw.includes('fb.com') || raw.includes('fb.me') || raw.includes('m.facebook.com')) {
    isUrl = true;
    try {
      // Handle https://www.facebook.com/profile.php?id=10008925723245
      const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
      if (url.searchParams.has('id')) {
        cleaned = url.searchParams.get('id') || '';
      } else {
        // e.g. https://www.facebook.com/sakib.mia.123
        const pathSegments = url.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          cleaned = pathSegments[0].replace(/[^a-zA-Z0-9._-]/g, '');
        }
      }
    } catch {
      // fallback regex
      const idMatch = raw.match(/id=([0-9]+)/i);
      if (idMatch && idMatch[1]) {
        cleaned = idMatch[1];
      } else {
        const pathMatch = raw.match(/facebook\.com\/([a-zA-Z0-9._-]+)/i);
        if (pathMatch && pathMatch[1]) {
          cleaned = pathMatch[1];
        }
      }
    }
  }

  // Remove leading @ if present
  if (cleaned.startsWith('@')) {
    cleaned = cleaned.substring(1);
  }

  // Determine type
  let type: 'numeric_uid' | 'username' | 'phone' | 'text' = 'text';
  if (/^[0-9]{8,25}$/.test(cleaned)) {
    type = 'numeric_uid';
  } else if (/^(8801|01|1)[3-9][0-9]{8}$/.test(cleaned.replace(/[^0-9]/g, ''))) {
    type = 'phone';
  } else if (/^[a-zA-Z0-9._]{3,50}$/.test(cleaned)) {
    type = 'username';
  }

  return { raw, cleaned, isUrl, type };
}

/**
 * Clean & format birthday strings nicely (e.g. "01/23/1996" -> "23 January 1996")
 * and properly filters out zero-dates like "1/1/0001 12:00:00 AM"
 */
export function formatBirthdayDisplay(raw?: string): { text: string; isPublic: boolean } {
  if (!raw) {
    return { text: 'পাবলিক নয় (Not Public)', isPublic: false };
  }

  const clean = raw.trim();

  // If it's a zero-date artifact from database
  if (
    clean.includes('0001') ||
    clean.includes('12:00:00') ||
    clean.startsWith('1/1/0001') ||
    clean.includes('1900') ||
    clean === '0'
  ) {
    return { text: 'পাবলিক নয় (Not Public)', isPublic: false };
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Try matching MM/DD/YYYY or MM/DD or DD-MM-YYYY
  const match = clean.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
  if (match) {
    const part1 = parseInt(match[1], 10);
    const part2 = parseInt(match[2], 10);
    const yearStr = match[3];

    let month = part1;
    let day = part2;

    // If first number > 12, it's day-first: DD/MM/YYYY
    if (part1 > 12 && part2 <= 12) {
      day = part1;
      month = part2;
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const monthName = months[month - 1];
      const dayFormatted = String(day).padStart(2, '0');

      if (yearStr) {
        let year = parseInt(yearStr, 10);
        if (year < 100) {
          year = year > 30 ? 1900 + year : 2000 + year;
        }
        if (year > 1920 && year <= 2026) {
          return { text: `${dayFormatted} ${monthName} ${year}`, isPublic: true };
        }
      }

      return { text: `${dayFormatted} ${monthName}`, isPublic: true };
    }
  }

  return { text: clean, isPublic: true };
}
