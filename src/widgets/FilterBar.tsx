import { useSnapshot } from '@/hooks/useSnapshot';
import { useFilterStore } from '@/stores/useFilterStore';
import { STATUS, STATUS_ORDER } from '@/constants/status';
import type { CondominioId, StatusKey } from '@/types';
import styles from './FilterBar.module.css';

export function FilterBar() {
  const { data } = useSnapshot();
  const f = useFilterStore();
  return (
    <div className={styles.bar}>
      <select value={f.condominio} onChange={(e) => f.set({ condominio: e.target.value as CondominioId | 'all', bloco: null, conjunto: null })}>
        <option value="all">Todos condomínios</option>
        {data?.condominios.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>

      {f.condominio === 'M01' && (
        <select value={f.bloco ?? ''} onChange={(e) => f.set({ bloco: e.target.value || null })}>
          <option value="">Todos blocos</option>
          {data?.blocos.map((b) => <option key={b.bloco} value={b.bloco}>Bloco {b.bloco}</option>)}
        </select>
      )}
      {f.condominio === 'C03' && (
        <select value={f.conjunto ?? ''} onChange={(e) => f.set({ conjunto: e.target.value || null })}>
          <option value="">Todos conjuntos</option>
          {data?.conjuntos.map((c) => <option key={c.conjunto} value={c.conjunto}>Conjunto {c.conjunto}</option>)}
        </select>
      )}

      <select value={f.status} onChange={(e) => f.set({ status: e.target.value as StatusKey | 'all' })}>
        <option value="all">Todos status</option>
        {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
      </select>

      {(f.condominio !== 'all' || f.status !== 'all' || f.bloco || f.conjunto || f.busca) && (
        <button className={styles.reset} onClick={f.reset}>Limpar</button>
      )}
    </div>
  );
}
