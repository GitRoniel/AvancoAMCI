import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';

const Dashboard   = lazy(() => import('@/pages/DashboardPage'));
const MapPage      = lazy(() => import('@/pages/MapPage'));
const Historico   = lazy(() => import('@/pages/HistoricoPage'));
const Metas       = lazy(() => import('@/pages/MetasPage'));
const Indicadores = lazy(() => import('@/pages/IndicadoresPage'));
const Fotos       = lazy(() => import('@/pages/FotosPage'));
const Config      = lazy(() => import('@/pages/ConfigPage'));
const Login       = lazy(() => import('@/pages/LoginPage'));

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'mapa', element: <MapPage /> },
      { path: 'historico', element: <Historico /> },
      { path: 'metas', element: <Metas /> },
      { path: 'indicadores', element: <Indicadores /> },
      { path: 'fotos', element: <Fotos /> },
      { path: 'config', element: <Config /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
