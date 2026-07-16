# Avanço de Obras

Sistema de **Gestão de Avanço Físico de Obras** para dois empreendimentos:

- **C03 — Alto do Burití** (casas, organizadas em conjuntos A–R)
- **M01 — Alto do Jerivá** (apartamentos, blocos A–H · ~56 unidades cada)

Interface premium inspirada em iOS 26 / Linear / Raycast, com **mapa interativo em SVG** como
centro de controle da obra, dashboard com KPIs e gráficos, histórico semanal, metas, indicadores
e fotos. Funciona em desktop, tablet, iPhone e Android (PWA + Capacitor).

O projeto já vem populado com um **seed gerado a partir das suas planilhas reais**:
757 unidades (309 casas + 448 apartamentos) e 68 serviços.

---

## Stack

React 19 · Vite · TypeScript · React Router · Zustand · TanStack Query · GSAP · Framer Motion ·
Chart.js · React Hook Form · CSS Modules · PWA · Capacitor · Google Apps Script + Google Sheets.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Sem backend configurado, roda com o seed offline.

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  animations/     GSAP helpers + variantes Framer Motion
  api/            cliente do Apps Script
  bottomSheets/   UnitBottomSheet (ficha da unidade + atualização)
  components/
    ui/           GlassCard, KpiCard, ProgressBar, StatusBadge, Icon, ...
    navigation/   FloatingNavbar (desktop) + BottomNav (iPhone)
    map/          CondoMap (SVG interativo) + mapLayout (motor de layout)
    charts/       Chart.js: evolução, rosca, barras
  constants/      status/cores, config, navegação
  data/           seed.json (gerado das suas planilhas)
  hooks/          useSnapshot (TanStack Query), useFilteredUnits, useMediaQuery
  layouts/        AppShell
  pages/          Dashboard, Mapa, Histórico, Metas, Indicadores, Fotos, Config, Login
  routes/         roteamento com lazy loading
  services/       dataService (seed⇄backend) + offlineQueue (Capacitor)
  stores/         Zustand: filtros, seleção, UI
  utils/          formatação + agregações
apps-script/
  Code.gs         Web App: snapshot, updateServico (append-only), snapshotSemanal
```

## Backend Google Sheets (opcional, para dados ao vivo)

1. Crie uma planilha no Google Sheets com as abas:
   `Dashboard, Condominios, Blocos, Conjuntos, Casas, Servicos, Historico, Metas, Usuarios, Fotos, Logs`.
   A aba **Casas** guarda uma linha por serviço/unidade com as colunas:
   `unidadeId, condominio, condominioNome, tipo, bloco, conjunto, unidade, servicoItem, servico, equipe, percentual, status, responsavel, data, obs`.
2. Em **Extensões > Apps Script**, cole o conteúdo de `apps-script/Code.gs`.
3. **Implantar > Nova implantação > App da Web** — executar como você, acesso "qualquer pessoa".
4. Em **Acionadores**, adicione `snapshotSemanal` semanal, quinta-feira (snapshots automáticos).
5. Copie a URL `/exec` para o `.env`:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
   ```
O app passa a ler/gravar ao vivo. Escritas offline são enfileiradas e sincronizadas ao reconectar.

## Mobile (Capacitor)

```bash
npm run build
npx cap add ios      # e/ou android
npm run cap:sync
npm run cap:ios      # abre no Xcode
```

## Cores de status

Cinza = não iniciado · Azul = programado · Amarelo = em execução · Verde = concluído ·
Laranja = atenção · Vermelho = atrasado · Roxo = pendências.

## Como o seed foi gerado

`scripts/gen_seed.py` lê `Avanço Fisico - C03.xlsx` e `Avanço Fisico - M01.xlsx`, extrai a lista
real de serviços, conjuntos, blocos e unidades, e produz `public/seed.json` (servido como asset estático). Regenere quando
quiser sincronizar a estrutura com novas planilhas.
