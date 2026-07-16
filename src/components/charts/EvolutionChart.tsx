import { Line } from 'react-chartjs-2';
import '@/components/charts/chartSetup';
import { formatDate } from '@/utils/format';
import type { HistoricoPonto, CondominioId } from '@/types';

const COLORS: Record<CondominioId, string> = { C03: '#4f8cff', M01: '#7c5cff' };

export function EvolutionChart({ historico }: { historico: HistoricoPonto[] }) {
  const weeks = [...new Set(historico.map((h) => h.semana))].sort();
  const condos = [...new Set(historico.map((h) => h.condominio))] as CondominioId[];
  const data = {
    labels: weeks.map(formatDate),
    datasets: condos.map((cid) => ({
      label: cid,
      data: weeks.map((w) => historico.find((h) => h.semana === w && h.condominio === cid)?.percentualMedio ?? null),
      borderColor: COLORS[cid],
      backgroundColor: (ctx: any) => {
        const { ctx: c, chartArea } = ctx.chart;
        if (!chartArea) return 'transparent';
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, COLORS[cid] + '55');
        g.addColorStop(1, COLORS[cid] + '00');
        return g;
      },
      fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: COLORS[cid], borderWidth: 2,
    })),
  };
  return (
    <Line
      data={data}
      options={{
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } },
        scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%' } } },
      }}
    />
  );
}
