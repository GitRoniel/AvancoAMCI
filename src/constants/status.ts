import type { StatusKey } from '@/types';

interface StatusMeta {
  key: StatusKey;
  label: string;
  color: string;       // CSS var
  hex: string;         // raw for SVG / charts
}

export const STATUS: Record<StatusKey, StatusMeta> = {
  nao_iniciado: { key: 'nao_iniciado', label: 'Não iniciado', color: 'var(--status-nao-iniciado)', hex: '#8a8f9c' },
  programado:   { key: 'programado',   label: 'Programado',   color: 'var(--status-programado)',   hex: '#4f8cff' },
  execucao:     { key: 'execucao',     label: 'Em execução',  color: 'var(--status-execucao)',     hex: '#f5c542' },
  concluido:    { key: 'concluido',    label: 'Concluído',    color: 'var(--status-concluido)',    hex: '#34c759' },
  atencao:      { key: 'atencao',      label: 'Atenção',      color: 'var(--status-atencao)',      hex: '#ff9f0a' },
  atrasado:     { key: 'atrasado',     label: 'Atrasado',     color: 'var(--status-atrasado)',     hex: '#ff453a' },
  pendencia:    { key: 'pendencia',    label: 'Pendências',   color: 'var(--status-pendencia)',    hex: '#af52de' },
};

export const STATUS_ORDER: StatusKey[] = [
  'nao_iniciado', 'programado', 'execucao', 'concluido', 'atencao', 'atrasado', 'pendencia',
];

/** Derive a status color from a percentage (fallback when no explicit status). */
export function statusFromPercent(p: number): StatusKey {
  if (p >= 100) return 'concluido';
  if (p >= 1) return 'execucao';
  return 'nao_iniciado';
}
