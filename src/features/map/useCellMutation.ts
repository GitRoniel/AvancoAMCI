import { useProgressStore } from './useProgressStore';
import { dataService } from '@/services/dataService';
import { useUIStore } from '@/stores/useUIStore';

/**
 * Tap handler: cycles a cell locally (instant + persisted) and pushes the
 * change to the backend / offline queue when a live backend is configured.
 */
export function useCellMutation() {
  const cycle = useProgressStore((s) => s.cycle);
  const showToast = useUIStore((s) => s.showToast);

  return async (condo: string, group: string, item: number, cell: string) => {
    cycle(condo, group, item, cell);
    const v = useProgressStore.getState().db[condo]?.[group]?.[item]?.[cell] ?? 0;
    try {
      await dataService.updateServico({
        unidadeId: `${condo}-${group}-${cell}`,
        servicoItem: item,
        novoValor: v === 2 ? 100 : v === 1 ? 50 : 0,
        usuario: 'anaiscolas',
      });
    } catch {
      showToast('Alteração salva localmente', 'ok');
    }
  };
}
