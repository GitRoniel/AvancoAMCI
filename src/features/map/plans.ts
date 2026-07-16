import m01raw from './m01Plan.json';
import c03raw from './c03Plan.json';
import type { CondoPlan, PlanServico, PlanGroup } from './planTypes';

const m01: CondoPlan = {
  id: 'M01',
  nome: 'Alto do Jerivá',
  image: `${import.meta.env.BASE_URL}plans/m01.jpg`,
  floors: m01raw.floors,
  apts: m01raw.apts,
  disciplinas: m01raw.disciplinas,
  servicos: m01raw.servicos as PlanServico[],
  groups: Object.entries(m01raw.hotspots).map(([key, hs]) => ({
    key, label: `Bloco ${key}`, hotspot: hs as any,
  })) as PlanGroup[],
};

const c03: CondoPlan = {
  id: 'C03',
  nome: 'Alto do Burití',
  disciplinas: c03raw.disciplinas,
  servicos: c03raw.servicos as PlanServico[],
  groups: c03raw.groups as PlanGroup[],
};

export const PLANS: Record<'C03' | 'M01', CondoPlan> = { C03: c03, M01: m01 };

/** Cell keys for a service within a group (defines the tappable grid). */
export function cellKeys(plan: CondoPlan, group: PlanGroup, svc: PlanServico): string[] {
  switch (svc.und) {
    case 'BL':
      return ['BL'];
    case 'Pav':
      return (plan.floors ?? []).map((f) => f.k);
    case 'Apt.': {
      const out: string[] = [];
      (plan.floors ?? []).forEach((f) => (plan.apts ?? []).forEach((u) => out.push(`${f.k}-${u}`)));
      return out;
    }
    case 'Casa':
      return group.casas ?? [];
    default:
      return ['BL'];
  }
}
