import type { StatusKey, Unidade } from '@/types';
import { STATUS_ORDER } from '@/constants/status';

export const avgPercent = (units: Unidade[]) =>
  units.length ? units.reduce((a, u) => a + u.percentual, 0) / units.length : 0;

export const countByStatus = (units: Unidade[]): Record<StatusKey, number> => {
  const base = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as Record<StatusKey, number>;
  for (const u of units) base[u.status] = (base[u.status] ?? 0) + 1;
  return base;
};

/** Average completion per service across a set of units. */
export const serviceProgress = (units: Unidade[]) => {
  const acc = new Map<string, { sum: number; n: number; equipe: string }>();
  for (const u of units)
    for (const s of u.servicos) {
      const cur = acc.get(s.nome) ?? { sum: 0, n: 0, equipe: s.equipe };
      cur.sum += s.percentual; cur.n += 1;
      acc.set(s.nome, cur);
    }
  return [...acc.entries()]
    .map(([nome, v]) => ({ nome, equipe: v.equipe, media: v.sum / v.n }))
    .sort((a, b) => b.media - a.media);
};

/** Estimated delivery date from weekly velocity. */
export const forecastDelivery = (current: number, weeklyVelocity: number): string => {
  if (weeklyVelocity <= 0 || current >= 100) return '—';
  const weeksLeft = Math.ceil((100 - current) / weeklyVelocity);
  const d = new Date();
  d.setDate(d.getDate() + weeksLeft * 7);
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
};
