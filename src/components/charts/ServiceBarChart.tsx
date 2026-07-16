import { Bar } from 'react-chartjs-2';
import '@/components/charts/chartSetup';

export function ServiceBarChart({ items }: { items: { nome: string; media: number }[] }) {
  const top = items.slice(0, 12);
  const data = {
    labels: top.map((i) => (i.nome.length > 26 ? i.nome.slice(0, 25) + '…' : i.nome)),
    datasets: [{
      data: top.map((i) => Math.round(i.media)),
      backgroundColor: top.map((i) => (i.media >= 100 ? '#34c759' : i.media >= 50 ? '#f5c542' : '#4f8cff')),
      borderRadius: 6, barThickness: 14,
    }],
  };
  return (
    <Bar
      data={data}
      options={{
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%' } } },
      }}
    />
  );
}
