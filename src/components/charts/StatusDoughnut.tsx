import { Doughnut } from 'react-chartjs-2';
import '@/components/charts/chartSetup';
import { STATUS, STATUS_ORDER } from '@/constants/status';
import type { StatusKey } from '@/types';

export function StatusDoughnut({ counts }: { counts: Record<StatusKey, number> }) {
  const keys = STATUS_ORDER.filter((k) => counts[k] > 0);
  const data = {
    labels: keys.map((k) => STATUS[k].label),
    datasets: [{
      data: keys.map((k) => counts[k]),
      backgroundColor: keys.map((k) => STATUS[k].hex),
      borderColor: 'rgba(0,0,0,0.25)', borderWidth: 2, hoverOffset: 6,
    }],
  };
  return (
    <Doughnut
      data={data}
      options={{
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, padding: 12 } } },
      }}
    />
  );
}
