import { PLANS, cellKeys } from './plans';
import { useProgressStore } from './useProgressStore';
import type { CellStatus } from './planTypes';

/** Small deterministic PRNG so the initial fill is stable across reloads. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}

/**
 * Populates the tri-state DB once with a realistic gradient:
 * earlier services (fundação, estrutura) more advanced than later ones
 * (acabamento, entrega); each bloco/conjunto has its own bias.
 */
export function seedInitialProgress() {
  const store = useProgressStore.getState();
  if (store.seeded) return;
  const entries: { condo: string; group: string; item: number; cell: string; v: CellStatus }[] = [];

  (['C03', 'M01'] as const).forEach((cid) => {
    const plan = PLANS[cid];
    const nSvc = plan.servicos.length;
    plan.groups.forEach((g) => {
      const groupBias = 0.35 + hash(cid + g.key) * 0.55; // 0.35..0.9
      plan.servicos.forEach((svc, idx) => {
        const seq = 1 - idx / nSvc;               // earlier services => higher
        const base = groupBias * 0.6 + seq * 0.6; // 0..~1.2
        cellKeys(plan, g, svc).forEach((cell) => {
          const r = hash(cid + g.key + svc.item + cell);
          const score = base + (r - 0.5) * 0.5;
          const v: CellStatus = score >= 0.92 ? 2 : score >= 0.5 ? 1 : 0;
          if (v > 0) entries.push({ condo: cid, group: g.key, item: svc.item, cell, v });
        });
      });
    });
  });

  store.setMany(entries);
  store.markSeeded();
}
