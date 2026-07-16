import { useEffect, useState } from 'react';
import { offlineQueue } from '@/services/offlineQueue';
import styles from './OfflineIndicator.module.css';

export function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const [queued, setQueued] = useState(0);
  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    window.addEventListener('online', on);
    window.addEventListener('offline', on);
    const t = setInterval(async () => setQueued(await offlineQueue.size()), 3000);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', on); clearInterval(t); };
  }, []);
  if (online && !queued) return null;
  return (
    <span className={`${styles.pill} ${online ? styles.sync : styles.off}`}>
      {online ? `Sincronizando ${queued}` : 'Offline'}
    </span>
  );
}
