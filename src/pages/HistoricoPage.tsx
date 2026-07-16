import { useMemo, useState } from 'react';
import { useSnapshot } from '@/hooks/useSnapshot';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Spinner } from '@/components/ui/Spinner';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EvolutionChart } from '@/components/charts/EvolutionChart';
import { formatDate, pct } from '@/utils/format';
import type { CondominioId } from '@/types';
import styles from './HistoricoPage.module.css';

export default function HistoricoPage() {
  const { data, isLoading } = useSnapshot();
  const [condo, setCondo] = useState<CondominioId | 'all'>('all');
  const weeks = useMemo(() => [...new Set((data?.historico ?? []).map((h) => h.semana))].sort(), [data]);
  if (isLoading) return <Spinner label="Carregando histórico…" />;

  const hist = (data?.historico ?? []).filter((h) => condo === 'all' || h.condominio === condo);

  return (
    <>
      <PageHeader
        title="Histórico"
        subtitle="Snapshots semanais — toda quinta-feira um novo ponto, sem sobrescrever"
        actions={
          <SegmentedControl
            value={condo}
            onChange={setCondo}
            options={[{ value: 'all', label: 'Todos' }, { value: 'C03', label: 'C03' }, { value: 'M01', label: 'M01' }]}
          />
        }
      />
      <GlassCard padding="lg" className={styles.chart}>
        <div className={styles.chartBox}><EvolutionChart historico={hist} /></div>
      </GlassCard>

      <h3 className={styles.tlTitle}>Linha do tempo</h3>
      <div className={styles.timeline}>
        {weeks.map((w) => {
          const rows = (data?.historico ?? []).filter((h) => h.semana === w && (condo === 'all' || h.condominio === condo));
          return (
            <div key={w} className={styles.tlItem}>
              <div className={styles.tlDot} />
              <div className={styles.tlDate}>{formatDate(w)}</div>
              <GlassCard padding="sm" className={styles.tlCard}>
                {rows.map((r) => (
                  <div key={r.condominio} className={styles.tlRow}>
                    <span>{r.condominio}</span>
                    <strong>{pct(r.percentualMedio, 1)}</strong>
                  </div>
                ))}
              </GlassCard>
            </div>
          );
        })}
      </div>
    </>
  );
}
