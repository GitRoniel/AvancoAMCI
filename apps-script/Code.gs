/**
 * ============================================================================
 *  Avanço de Obras — Backend (Google Apps Script Web App)
 *  Banco de dados: Google Sheets. Nunca sobrescreve histórico.
 *  Deploy: Implantar > Nova implantação > App da Web
 *          Executar como: você  ·  Acesso: qualquer pessoa
 *  Cole a URL /exec no arquivo .env do front (VITE_APPS_SCRIPT_URL).
 * ============================================================================
 */

const SHEETS = {
  DASHBOARD:  'Dashboard',
  CONDOMINIOS:'Condominios',
  BLOCOS:     'Blocos',
  CONJUNTOS:  'Conjuntos',
  CASAS:      'Casas',
  SERVICOS:   'Servicos',
  HISTORICO:  'Historico',
  METAS:      'Metas',
  USUARIOS:   'Usuarios',
  FOTOS:      'Fotos',
  LOGS:       'Logs',
};

/** Roteamento GET — leitura. */
function doGet(e) {
  const action = (e.parameter.action || 'snapshot');
  try {
    if (action === 'snapshot') return json({ data: buildSnapshot() });
    return json({ error: 'Ação desconhecida: ' + action });
  } catch (err) {
    return json({ error: String(err) });
  }
}

/** Roteamento POST — escrita. */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const action = (e.parameter.action || '');
    if (action === 'updateServico') return json({ data: updateServico(body) });
    return json({ error: 'Ação desconhecida: ' + action });
  } catch (err) {
    return json({ error: String(err) });
  }
}

/** Monta o snapshot completo lido pelo app. */
function buildSnapshot() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const condominios = readTable(ss, SHEETS.CONDOMINIOS);
  const servicos    = readTable(ss, SHEETS.SERVICOS);
  const casas       = readTable(ss, SHEETS.CASAS);       // unidades + %
  const historico   = readTable(ss, SHEETS.HISTORICO);

  // Agrupa serviços por unidade (aba Casas guarda 1 linha por serviço/unidade)
  const byUnit = {};
  casas.forEach(function (row) {
    var id = row.unidadeId;
    if (!byUnit[id]) byUnit[id] = { id: id, condominio: row.condominio, condominioNome: row.condominioNome,
      tipo: row.tipo, bloco: row.bloco || null, conjunto: row.conjunto || null, unidade: row.unidade, servicos: [] };
    byUnit[id].servicos.push({
      servicoItem: Number(row.servicoItem), nome: row.servico, equipe: row.equipe,
      percentual: Number(row.percentual), status: row.status,
      responsavel: row.responsavel, data: row.data, obs: row.obs || ''
    });
  });

  var unidades = Object.keys(byUnit).map(function (id) {
    var u = byUnit[id];
    var media = u.servicos.reduce(function (a, s) { return a + s.percentual; }, 0) / (u.servicos.length || 1);
    u.percentual = Math.round(media * 10) / 10;
    u.status = statusFromPercent(u.percentual);
    return u;
  });

  return { geradoEm: new Date().toISOString(), condominios: condominios, servicos: servicos,
    unidades: unidades, historico: historico };
}

/**
 * Atualiza um serviço de uma unidade.
 * NUNCA sobrescreve: grava o valor atual na aba Casas E registra um
 * snapshot imutável na aba Historico (com valor anterior e novo valor).
 */
function updateServico(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEETS.CASAS);
  const values = sh.getDataRange().getValues();
  const header = values[0];
  const idxUnit = header.indexOf('unidadeId');
  const idxItem = header.indexOf('servicoItem');
  const idxPct  = header.indexOf('percentual');
  const idxStat = header.indexOf('status');
  const idxData = header.indexOf('data');

  let anterior = 0;
  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idxUnit]) === String(p.unidadeId) &&
        Number(values[r][idxItem]) === Number(p.servicoItem)) {
      anterior = Number(values[r][idxPct]);
      sh.getRange(r + 1, idxPct + 1).setValue(p.novoValor);
      sh.getRange(r + 1, idxStat + 1).setValue(statusFromPercent(p.novoValor));
      sh.getRange(r + 1, idxData + 1).setValue(today());
      break;
    }
  }

  registrarHistorico({
    unidadeId: p.unidadeId, servicoItem: p.servicoItem,
    valorAnterior: anterior, novoValor: p.novoValor,
    usuario: p.usuario || 'sistema', obs: p.obs || ''
  });
  log('updateServico', p.usuario, JSON.stringify(p));

  return { ok: true, registro: { servicoItem: p.servicoItem, percentual: p.novoValor,
    status: statusFromPercent(p.novoValor) } };
}

/** Grava um registro imutável de histórico (append-only). */
function registrarHistorico(r) {
  const sh = ensureSheet(SHEETS.HISTORICO,
    ['data','hora','semana','usuario','unidadeId','servicoItem','valorAnterior','novoValor','obs']);
  const now = new Date();
  sh.appendRow([today(), Utilities.formatDate(now, tz(), 'HH:mm:ss'), semanaAtual(),
    r.usuario, r.unidadeId, r.servicoItem, r.valorAnterior, r.novoValor, r.obs]);
}

/**
 * Snapshot semanal automático — instale um acionador por tempo:
 * Acionadores > Adicionar > snapshotSemanal > Semanal > Quinta-feira 06:00.
 * Congela a média de cada condomínio na aba Historico (append-only).
 */
function snapshotSemanal() {
  const snap = buildSnapshot();
  const sh = ensureSheet('HistoricoSemanal', ['semana','condominio','percentualMedio']);
  const semana = today();
  const grupos = {};
  snap.unidades.forEach(function (u) {
    grupos[u.condominio] = grupos[u.condominio] || { sum: 0, n: 0 };
    grupos[u.condominio].sum += u.percentual; grupos[u.condominio].n++;
  });
  Object.keys(grupos).forEach(function (cid) {
    sh.appendRow([semana, cid, Math.round(grupos[cid].sum / grupos[cid].n * 10) / 10]);
  });
  log('snapshotSemanal', 'cron', semana);
}

/* ----------------------------- helpers ----------------------------- */
function statusFromPercent(p) { return p >= 100 ? 'concluido' : (p >= 1 ? 'execucao' : 'nao_iniciado'); }
function tz() { return Session.getScriptTimeZone(); }
function today() { return Utilities.formatDate(new Date(), tz(), 'yyyy-MM-dd'); }
function semanaAtual() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  return 'S' + Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
function readTable(ss, name) {
  const sh = ss.getSheetByName(name);
  if (!sh) return [];
  const v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  const h = v[0];
  return v.slice(1).map(function (row) {
    const o = {}; h.forEach(function (k, i) { o[k] = row[i]; }); return o;
  });
}
function ensureSheet(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); }
  return sh;
}
function log(action, user, detail) {
  const sh = ensureSheet(SHEETS.LOGS, ['timestamp','action','usuario','detalhe']);
  sh.appendRow([new Date().toISOString(), action, user || '', detail || '']);
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
