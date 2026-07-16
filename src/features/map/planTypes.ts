export type CellStatus = 0 | 1 | 2; // 0 não iniciado · 1 em execução · 2 concluído
export type UndType = 'BL' | 'Pav' | 'Apt.' | 'Casa';

export interface Disciplina { n: string; c: string; d: string }
export interface PlanServico { item: number; descricao: string; und: UndType; equipe: string }
export interface Hotspot { x: number; y: number; w: number; h: number }

export interface PlanGroup {
  key: string;          // 'A'..'H' (blocos) or 'A'..'R' (conjuntos)
  label: string;
  hotspot?: Hotspot;    // only M01
  casas?: string[];     // only C03
}

export interface CondoPlan {
  id: 'C03' | 'M01';
  nome: string;
  image?: string;                 // M01 plan image
  floors?: { k: string; l: string }[];
  apts?: string[];
  disciplinas: Disciplina[];
  servicos: PlanServico[];
  groups: PlanGroup[];
}
