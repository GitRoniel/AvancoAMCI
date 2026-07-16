import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useUIStore } from '@/stores/useUIStore';
import { Icon } from '@/components/ui/Icon';
import styles from './Toast.module.css';

export function Toast() {
  const { toast, clearToast } = useUIStore();
  useEffect(() => {
    if (toast) { const t = setTimeout(clearToast, 2800); return () => clearTimeout(t); }
  }, [toast, clearToast]);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id} className={`${styles.toast} ${toast.tone === 'error' ? styles.error : styles.ok}`}
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
        >
          <Icon name={toast.tone === 'error' ? 'alert' : 'check'} size={16} />
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
