import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MapView } from '@/features/map/MapView';
import type { CondominioId } from '@/types';

export default function MapPage() {
  const [condo, setCondo] = useState<CondominioId>('M01');
  return (
    <>
      <PageHeader
        title="Mapa interativo"
        subtitle="Toque em um bloco → disciplina → serviço, e marque cada unidade tocando"
        actions={
          <SegmentedControl<CondominioId>
            value={condo}
            onChange={setCondo}
            options={[{ value: 'M01', label: 'M01 Jerivá' }, { value: 'C03', label: 'C03 Burití' }]}
          />
        }
      />
      <MapView condo={condo} />
    </>
  );
}
