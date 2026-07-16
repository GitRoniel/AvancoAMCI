import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerOfflineSync } from '@/services/offlineQueue';
import { seedInitialProgress } from '@/features/map/initProgress';
import '@/styles/global.css';

registerOfflineSync();
seedInitialProgress();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
