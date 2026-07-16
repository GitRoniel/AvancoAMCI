import { useMemo } from 'react';
import { useSnapshot } from '@/hooks/useSnapshot';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Spinner } from '@/components/ui/Spinner';
import { Icon } from '@/components/ui/Icon';
import { formatDateLong } from '@/utils/format';
import styles from './FotosPage.module.css';

export default function FotosPage() {
  const { data, isLoading } = useSnapshot();
  // Demo photo entries derived from real units (backend: "Fotos" sheet).
  const fotos = useMemo(() => {
    const u = data?.unidades.filter((x) => x.percentual > 20 && x.percentual < 95).slice(0, 9) ?? [];
    return u.map((x, i) => ({
      id: x.id,
      unidade: x.bloco ? `Bloco ${x.bloco} · ${x.unidade}` : `Conj. ${x.conjunto} · ${x.unidade}`,
      servico: x.servicos.find((s) => s.percentual > 0 && s.percentual < 100)?.nome ?? 'Serviço',
      autor: ['J. Silva', 'M. Souza', 'R. Lima'][i % 3],
      data: '2026-07-09',
    }));
  }, [data]);
  if (isLoading) return <Spinner label="Carregando fotos…" />;

  return (
    <>
      <PageHeader
        title="Fotos"
        subtitle="Registro antes/depois por serviço"
        actions={<button className={styles.add}><Icon name="photo" size={16} /> Nova foto</button>}
      />
      <div className={styles.grid}>
        {fotos.map((f) => (
          <GlassCard key={f.id} padding="sm" className={styles.card}>
            <div className={styles.pair}>
              <div className={styles.ph}><span>Antes</span><Icon name="photo" size={22} /></div>
              <div className={styles.ph}><span>Depois</span><Icon name="photo" size={22} /></div>
            </div>
            <div className={styles.meta}>
              <strong>{f.unidade}</strong>
              <span>{f.servico}</span>
              <span className={styles.by}>{f.autor} · {formatDateLong(f.data)}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
