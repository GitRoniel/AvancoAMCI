import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FloatingNavbar } from '@/components/navigation/FloatingNavbar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { UnitBottomSheet } from '@/bottomSheets/UnitBottomSheet';
import { Toast } from '@/widgets/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { pageVariants } from '@/animations/variants';
import styles from './AppShell.module.css';

export function AppShell() {
  const location = useLocation();
  return (
    <div className={styles.shell}>
      <FloatingNavbar />
      <main className={styles.main}>
        <Suspense fallback={<Spinner label="Carregando…" />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants} initial="initial" animate="animate" exit="exit"
              className={styles.page}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <BottomNav />
      <UnitBottomSheet />
      <Toast />
    </div>
  );
}
