import { useMemo, useState } from 'react';
import { useSnapshot } from '@/hooks/useSnapshot';
import { useFilteredUnits } from '@/hooks/useFilteredUnits';
import { useFilterStore } from '@/stores/useFilterStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Spinner } from '@/components/ui/Spinner';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CondoMap } from '@/components/map/CondoMap';
import { STATUS, STATUS_ORDER } from '@/constants/status';
import { countByStatus } from '@/utils/aggregate';
import type { CondominioId } from '@/types';
import styles from './MapPage.module.css';

export default function MapPage() {
  const { data, isLoading } = useSnapshot();
  const [condo, setCondo] = useState<CondominioId>('C03');
  const setFilter = useFilterStore((s) => s.set);
  const all = useFilteredUnits(data?.unidades);
  const units = useMemo(() => all.filter((u) => u.condominio === condo), [all, condo]);
  const counts = useMemo(() => countByStatus(units), [units]);

  if (isLoading) return <Spinner label="Carregando mapa…" />;

  return (
    <>
      <PageHeader
        title="Mapa interativo"
        subtitle="Toque em uma unidade para dar zoom e ver os serviços"
        actions={
          <SegmentedControl<CondominioId>
            value={condo}
            onChange={(v) => { setCondo(v); setFilter({ condominio: v, bloco: null, conjunto: null }); }}
            options={[{ value: 'C03', label: 'C03 Burití' }, { value: 'M01', label: 'M01 Jerivá' }]}
          />
        }
      />

      <div className={styles.legend}>
        {STATUS_ORDER.filter((s) => counts[s] > 0).map((s) => (
          <span key={s} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: STATUS[s].hex }} />
            {STATUS[s].label} <b>{counts[s]}</b>
          </span>
        ))}
      </div>

      <GlassCard padding="sm" className={styles.mapCard}>
        <CondoMap units={units} condominio={condo} />
      </GlassCard>
    </>
  );
}
