import { useMemo } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import type { Unidade } from '@/types';

/** Applies the global filter + instant search to a unit list. */
export function useFilteredUnits(units: Unidade[] | undefined): Unidade[] {
  const f = useFilterStore();
  return useMemo(() => {
    if (!units) return [];
    const q = f.busca.trim().toLowerCase();
    return units.filter((u) => {
      if (f.condominio !== 'all' && u.condominio !== f.condominio) return false;
      if (f.bloco && u.bloco !== f.bloco) return false;
      if (f.conjunto && u.conjunto !== f.conjunto) return false;
      if (f.status !== 'all' && u.status !== f.status) return false;
      if (f.servico && !u.servicos.some((s) => s.nome === f.servico)) return false;
      if (q) {
        const hay = `${u.id} ${u.unidade} ${u.bloco ?? ''} ${u.conjunto ?? ''} ${u.condominioNome}`.toLowerCase();
        const inSvc = u.servicos.some(
          (s) => s.nome.toLowerCase().includes(q) || s.responsavel.toLowerCase().includes(q),
        );
        if (!hay.includes(q) && !inSvc) return false;
      }
      return true;
    });
  }, [units, f]);
}
