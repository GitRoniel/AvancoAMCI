import { useMemo } from 'react';
import { useSnapshot } from '@/hooks/useSnapshot';
import { useFilteredUnits } from '@/hooks/useFilteredUnits';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { FilterBar } from '@/widgets/FilterBar';
import { Spinner } from '@/components/ui/Spinner';
import { ServiceBarChart } from '@/components/charts/ServiceBarChart';
import { StatusDoughnut } from '@/components/charts/StatusDoughnut';
import { serviceProgress, countByStatus, avgPercent } from '@/utils/aggregate';
import { STATUS } from '@/constants/status';
import { pct } from '@/utils/format';
import styles from './DashboardPage.module.css';

export default function IndicadoresPage() {
  const { data, isLoading } = useSnapshot();
  const units = useFilteredUnits(data?.unidades);
  const services = useMemo(() => serviceProgress(units), [units]);
  const counts = useMemo(() => countByStatus(units), [units]);
  if (isLoading) return <Spinner label="Carregando indicadores…" />;

  const emExec = units.filter((u) => u.status === 'execucao').length;
  const criticos = services.filter((s) => s.media < 30);

  return (
    <>
      <PageHeader title="Indicadores" subtitle="KPIs e desempenho por serviço" actions={<FilterBar />} />
      <div className={styles.kpis}>
        <KpiCard label="Avanço médio" value={avgPercent(units)} suffix="%" decimals={1} accent="#4f8cff" />
        <KpiCard label="Unidades em execução" value={emExec} accent="#f5c542" />
        <KpiCard label="Serviços mapeados" value={services.length} accent="#7c5cff" />
        <KpiCard label="Serviços críticos" value={criticos.length} hint="< 30% de avanço" accent="#ff453a" />
      </div>
      <div className={styles.row2}>
        <GlassCard padding="lg" className={styles.chartCard}>
          <div className={styles.cardHead}><h3>Avanço por serviço</h3></div>
          <div className={styles.chartBoxTall}><ServiceBarChart items={services} /></div>
        </GlassCard>
        <GlassCard padding="lg" className={styles.chartCard}>
          <div className={styles.cardHead}><h3>Status das unidades</h3></div>
          <div className={styles.chartBoxTall}><StatusDoughnut counts={counts} /></div>
        </GlassCard>
      </div>
      <GlassCard padding="lg" style={{ marginTop: 16 }}>
        <div className={styles.cardHead}><h3>Todos os serviços</h3><span>{services.length} itens</span></div>
        <ul className={styles.rank}>
          {services.map((s) => (
            <li key={s.nome}>
              <span className={styles.rankName} style={{ width: 220 }}>{s.nome}</span>
              <div className={styles.rankBarTrack}><div className={styles.rankBar} style={{ width: `${s.media}%`, background: STATUS[s.media >= 100 ? 'concluido' : s.media >= 50 ? 'execucao' : 'programado'].hex }} /></div>
              <span className={styles.rankPct}>{pct(s.media)}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </>
  );
}
