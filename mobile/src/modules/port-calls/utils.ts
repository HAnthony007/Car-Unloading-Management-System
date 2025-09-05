export function formatLocal(dateStr?: string | null) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    // Return a compact localized format; keep simple to avoid new deps
    return d.toLocaleString();
  } catch {
    return String(dateStr);
  }
}

export function safeUpper(s?: string | null) {
  return (s ?? '').toUpperCase();
}
