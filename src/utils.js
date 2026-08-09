// Helper to calculate exact remaining hours and minutes until expiration
export function getRemainingTime(expiresAtISO) {
  if (!expiresAtISO) return { text: '3 Hours', isExpired: false };

  const diffMs = new Date(expiresAtISO) - new Date();
  if (diffMs <= 0) {
    return { text: 'EXPIRED', isExpired: true };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return { text: `${hours}h ${mins}m remaining`, isExpired: false };
  }
  return { text: `⚠️ ${mins}m remaining (URGENT)`, isExpired: false };
}