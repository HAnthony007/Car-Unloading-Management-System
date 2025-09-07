export const formatRelative = (iso: string) => {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = d.getTime() - now;
  const abs = Math.abs(diffMs);
  const m = Math.round(abs / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return diffMs < 0 ? `il y a ${m} min` : `dans ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return diffMs < 0 ? `il y a ${h} h` : `dans ${h} h`;
  const dDays = Math.round(h / 24);
  return diffMs < 0 ? `il y a ${dDays} j` : `dans ${dDays} j`;
};
