import { useMemo, useRef, useEffect } from 'react';
import { useSnapshot } from '@/hooks/useSnapshot';
import { useFilteredUnits } from '@/hooks/useFilteredUnits';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { FilterBar } from '@/widgets/FilterBar';
import { Spinner } from '@/components/ui/Spinner';
import { EvolutionChart } from '@/components/charts/EvolutionChart';
import { StatusDoughnut } from '@/components/charts/StatusDoughnut';
import { ServiceBarChart } from '@/components/charts/ServiceBarChart';
import { avgPercent, countByStatus, serviceProgress, forecastDelivery } from '@/utils/aggregate';
import { animateStagger } from '@/animations/gsap';
import { STATUS } from '@/constants/status';
import { pct } from '@/utils/format';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { data, isLoading } = useSnapshot();
  const units = useFilteredUnits(data?.unidades);
  const grid = useRef<HTMLDivElement>(null);

  const kpis = useMemo(() => {
    const media = avgPercent(units);
    const done = units.filter((u) => u.percentual >= 100).length;
    const counts = countByStatus(units);
    const hist = data?.historico ?? [];
    const weeks = [...new Set(hist.map((h) => h.semana))].sort();
    const last2 = weeks.slice(-2);
    const vel = last2.length === 2
      ? (avgWeek(hist, last2[1]) - avgWeek(hist, last2[0]))
      : 0;
    return { media, done, counts, vel, total: units.length };
  }, [units, data]);

  const services = useMemo(() => serviceProgress(units), [units]);

  useEffect(() => {
    if (grid.current) animateStagger(grid.current.querySelectorAll('[data-anim]'));
  }, [isLoading]);

  if (isLoading) return <Spinner label="Carregando painel…" />;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do avanço físico — C03 Alto do Burití & M01 Alto do Jerivá"
        actions={<FilterBar />}
      />

      <div className={styles.kpis} ref={grid}>
        <div data-anim><KpiCard label="Avanço médio" value={kpis.media} suffix="%" decimals={1} delta={kpis.vel} hint="progresso global das unidades" accent="#4f8cff" /></div>
        <div data-anim><KpiCard label="Unidades concluídas" value={kpis.done} hint={`de ${kpis.total} unidades`} accent="#34c759" /></div>
        <div data-anim><KpiCard label="Velocidade semanal" value={kpis.vel} suffix=" pts" decimals={1} hint="média das últimas semanas" accent="#f5c542" /></div>
        <div data-anim><KpiCard label="Faltante" value={100 - kpis.media} suffix="%" decimals={1} hint="para conclusão total" accent="#af52de" /></div>
      </div>

      <div className={styles.row2} data-anim>
        <GlassCard padding="lg" className={styles.chartCard}>
          <div className={styles.cardHead}><h3>Evolução semanal</h3><span>{`prev. entrega ~${forecastDelivery(kpis.media, kpis.vel)}`}</span></div>
          <div className={styles.chartBox}>{data && <EvolutionChart historico={data.historico} />}</div>
        </GlassCard>
        <GlassCard padding="lg" className={styles.chartCard}>
          <div className={styles.cardHead}><h3>Distribuição por status</h3></div>
          <div className={styles.chartBox}><StatusDoughnut counts={kpis.counts} /></div>
        </GlassCard>
      </div>

      <div className={styles.row3} data-anim>
        <GlassCard padding="lg" className={styles.chartCard}>
          <div className={styles.cardHead}><h3>Avanço por serviço</h3></div>
          <div className={styles.chartBoxTall}><ServiceBarChart items={services} /></div>
        </GlassCard>
        <GlassCard padding="lg">
          <div className={styles.cardHead}><h3>Ranking de conjuntos / blocos</h3></div>
          <Ranking units={units} />
        </GlassCard>
      </div>
    </>
  );
}

function avgWeek(hist: { semana: string; percentualMedio: number }[], week: string) {
  const rows = hist.filter((h) => h.semana === week);
  return rows.reduce((a, r) => a + r.percentualMedio, 0) / (rows.length || 1);
}

function Ranking({ units }: { units: { conjunto: string | null; bloco: string | null; percentual: number }[] }) {
  const groups = new Map<string, { sum: number; n: number }>();
  for (const u of units) {
    const k = u.bloco ? `Bloco ${u.bloco}` : `Conj. ${u.conjunto}`;
    const g = groups.get(k) ?? { sum: 0, n: 0 };
    g.sum += u.percentual; g.n++; groups.set(k, g);
  }
  const ranked = [...groups.entries()].map(([k, v]) => ({ k, m: v.sum / v.n })).sort((a, b) => b.m - a.m).slice(0, 8);
  return (
    <ul className={styles.rank}>
      {ranked.map((r, i) => (
        <li key={r.k}>
          <span className={styles.rankPos}>{i + 1}</span>
          <span className={styles.rankName}>{r.k}</span>
          <div className={styles.rankBarTrack}><div className={styles.rankBar} style={{ width: `${r.m}%`, background: STATUS[r.m >= 100 ? 'concluido' : 'execucao'].hex }} /></div>
          <span className={styles.rankPct}>{pct(r.m)}</span>
        </li>
      ))}
    </ul>
  );
}
