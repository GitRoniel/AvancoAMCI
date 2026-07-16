import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { APPS_SCRIPT_URL, USE_LIVE_BACKEND, APP_NAME } from '@/constants/app';
import { useState } from 'react';
import styles from './ConfigPage.module.css';

export default function ConfigPage() {
  const [theme, setTheme] = useState<'auto' | 'dark'>('dark');
  return (
    <>
      <PageHeader title="Configurações" subtitle="Preferências, backend e sincronização" />
      <div className={styles.list}>
        <GlassCard padding="lg" className={styles.section}>
          <h3>Backend</h3>
          <div className={styles.rowKV}>
            <span>Fonte de dados</span>
            <b>{USE_LIVE_BACKEND ? 'Google Sheets (ao vivo)' : 'Seed offline (demo)'}</b>
          </div>
          <div className={styles.rowKV}>
            <span>Apps Script URL</span>
            <b className={styles.mono}>{APPS_SCRIPT_URL || 'não configurado'}</b>
          </div>
          <p className={styles.hint}>Defina <code>VITE_APPS_SCRIPT_URL</code> no arquivo <code>.env</code> para ativar o backend ao vivo.</p>
        </GlassCard>

        <GlassCard padding="lg" className={styles.section}>
          <h3>Aparência</h3>
          <div className={styles.rowKV}>
            <span>Tema</span>
            <SegmentedControl value={theme} onChange={setTheme} options={[{ value: 'dark', label: 'Escuro' }, { value: 'auto', label: 'Automático' }]} />
          </div>
        </GlassCard>

        <GlassCard padding="lg" className={styles.section}>
          <h3>Sobre</h3>
          <div className={styles.rowKV}><span>Aplicativo</span><b>{APP_NAME}</b></div>
          <div className={styles.rowKV}><span>Versão</span><b>1.0.0</b></div>
          <div className={styles.rowKV}><span>Empreendimentos</span><b>C03 Alto do Burití · M01 Alto do Jerivá</b></div>
        </GlassCard>
      </div>
    </>
  );
}
