import { useFilterStore } from '@/stores/useFilterStore';
import { Icon } from '@/components/ui/Icon';
import styles from './GlobalSearch.module.css';

export function GlobalSearch() {
  const busca = useFilterStore((s) => s.busca);
  const set = useFilterStore((s) => s.set);
  return (
    <div className={styles.wrap}>
      <Icon name="search" size={16} style={{ color: 'var(--text-tertiary)' }} />
      <input
        className={styles.input}
        placeholder="Buscar casa, bloco, serviço…"
        value={busca}
        onChange={(e) => set({ busca: e.target.value })}
      />
      {busca && <button className={styles.clear} onClick={() => set({ busca: '' })}><Icon name="close" size={14} /></button>}
    </div>
  );
}
