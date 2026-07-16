/** Domain types — Gestão de Avanço Físico de Obras */

export type StatusKey =
  | 'nao_iniciado'
  | 'programado'
  | 'execucao'
  | 'concluido'
  | 'atencao'
  | 'atrasado'
  | 'pendencia';

export type CondominioId = 'C03' | 'M01';
export type UnitTipo = 'casa' | 'apartamento';

export interface Condominio {
  id: CondominioId;
  nome: string;
  tipo: UnitTipo;
  totalUnidades: number;
}

export interface Servico {
  item: number;
  nome: string;
  equipe: string;
}

export interface UnitServico {
  servicoItem: number;
  nome: string;
  equipe: string;
  percentual: number;
  status: StatusKey;
  responsavel: string;
  data: string;
  obs: string;
}

export interface Unidade {
  id: string;
  condominio: CondominioId;
  condominioNome: string;
  tipo: UnitTipo;
  bloco: string | null;
  conjunto: string | null;
  unidade: string;
  percentual: number;
  status: StatusKey;
  servicos: UnitServico[];
}

export interface HistoricoPonto {
  semana: string;      // ISO date (quinta-feira)
  condominio: CondominioId;
  percentualMedio: number;
}

export interface HistoricoRegistro {
  data: string;
  hora: string;
  semana: string;
  usuario: string;
  unidadeId: string;
  bloco: string | null;
  conjunto: string | null;
  servico: string;
  valorAnterior: number;
  novoValor: number;
  obs: string;
}

export interface Meta {
  id: string;
  escopo: 'condominio' | 'conjunto' | 'servico' | 'global';
  alvo: string;
  periodo: 'semanal' | 'mensal' | 'anual';
  valorMeta: number;
  valorExecutado: number;
}

export interface Foto {
  id: string;
  unidadeId: string;
  servico: string;
  urlAntes?: string;
  urlDepois?: string;
  autor: string;
  data: string;
  obs: string;
}

export interface SeedData {
  geradoEm: string;
  condominios: Condominio[];
  servicos: Servico[];
  conjuntos: { conjunto: string; casas: string[] }[];
  blocos: { bloco: string; totalApts: number }[];
  unidades: Unidade[];
  historico: HistoricoPonto[];
}
