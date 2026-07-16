import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerOfflineSync } from '@/services/offlineQueue';
import '@/styles/global.css';

registerOfflineSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
