export const pct = (n: number, digits = 0) =>
  `${n.toFixed(digits).replace('.', ',')}%`;

export const formatDate = (iso: string) => {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export const formatDateLong = (iso: string) =>
  new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

export const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

/** ISO week label helper. */
export const weekLabel = (iso: string) => formatDate(iso);
