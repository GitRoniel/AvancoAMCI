import type { CellStatus, CondoPlan, PlanGroup, PlanServico } from './planTypes';
import { cellKeys } from './plans';
import { readCell } from './useProgressStore';

type DB = Record<string, any>;
const frac = (s: CellStatus) => (s === 2 ? 1 : s === 1 ? 0.5 : 0);

/** 0..1 completion of one service in a group. */
export function serviceFrac(db: DB, plan: CondoPlan, group: PlanGroup, svc: PlanServico): number {
  const keys = cellKeys(plan, group, svc);
  if (!keys.length) return 0;
  return keys.reduce((a, k) => a + frac(readCell(db, plan.id, group.key, svc.item, k)), 0) / keys.length;
}

/** Counts of done / doing / idle cells for a service. */
export function serviceCounts(db: DB, plan: CondoPlan, group: PlanGroup, svc: PlanServico) {
  const keys = cellKeys(plan, group, svc);
  let d = 0, n = 0, i = 0;
  for (const k of keys) {
    const v = readCell(db, plan.id, group.key, svc.item, k);
    v === 2 ? d++ : v === 1 ? n++ : i++;
  }
  return { d, n, i, t: keys.length };
}

export const disciplineServicos = (plan: CondoPlan, disciplina: string) =>
  plan.servicos.filter((s) => s.equipe === disciplina);

export function disciplineFrac(db: DB, plan: CondoPlan, group: PlanGroup, disciplina: string): number {
  const list = disciplineServicos(plan, disciplina);
  if (!list.length) return 0;
  return list.reduce((a, s) => a + serviceFrac(db, plan, group, s), 0) / list.length;
}

export function groupFrac(db: DB, plan: CondoPlan, group: PlanGroup): number {
  if (!plan.servicos.length) return 0;
  return plan.servicos.reduce((a, s) => a + serviceFrac(db, plan, group, s), 0) / plan.servicos.length;
}

export const pctOf = (f: number) => Math.round(f * 100);
export const statusColor = (f: number) =>
  f >= 1 ? 'var(--status-concluido)' : f > 0 ? 'var(--status-execucao)' : 'var(--status-nao-iniciado)';
