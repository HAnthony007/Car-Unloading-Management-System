export const formatRelative = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const now = Date.now();
    const diffMs = d.getTime() - now;
    const abs = Math.abs(diffMs);
    const min = Math.round(abs / 60000);
    if (min < 1) return "à l'instant";
    if (min < 60) return diffMs < 0 ? `il y a ${min} min` : `dans ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24) return diffMs < 0 ? `il y a ${h} h` : `dans ${h} h`;
    const dDays = Math.round(h / 24);
    return diffMs < 0 ? `il y a ${dDays} j` : `dans ${dDays} j`;
};
