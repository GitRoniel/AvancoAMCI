import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';
import { queryKeys } from '@/lib/queryClient';
import type { SeedData } from '@/types';

export function useSnapshot() {
  return useQuery({
    queryKey: queryKeys.snapshot,
    queryFn: () => dataService.getSnapshot(),
  });
}

export function useUpdateServico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dataService.updateServico,
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: queryKeys.snapshot });
      const prev = qc.getQueryData<SeedData>(queryKeys.snapshot);
      // Optimistic update
      qc.setQueryData<SeedData>(queryKeys.snapshot, (old) => {
        if (!old) return old;
        const unidades = old.unidades.map((u) => {
          if (u.id !== vars.unidadeId) return u;
          const servicos = u.servicos.map((s) =>
            s.servicoItem === vars.servicoItem ? { ...s, percentual: vars.novoValor } : s,
          );
          const percentual =
            Math.round((servicos.reduce((a, s) => a + s.percentual, 0) / servicos.length) * 10) / 10;
          return { ...u, servicos, percentual };
        });
        return { ...old, unidades };
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.snapshot, ctx.prev);
    },
  });
}
