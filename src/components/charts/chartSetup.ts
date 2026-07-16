import {
  Chart, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';

Chart.register(
  CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
);

Chart.defaults.color = 'rgba(244,245,247,0.6)';
Chart.defaults.font.family = "'Geist', system-ui, sans-serif";
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
