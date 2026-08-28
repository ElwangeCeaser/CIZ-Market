/**
 * Formatting utilities for CIZ Market (Uganda)
 */

export function formatUGX(amount: number): string {
  if (isNaN(amount)) return 'UGX 0';
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatPercentage(discountFraction: number): string {
  return `-${Math.round(discountFraction * 100)}%`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatUgandanPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0')) {
    return `+256 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return cleaned;
}
