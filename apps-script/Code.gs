/**
 * Muro de dolores — Google Apps Script
 *
 * 1. Creá una Google Sheet nueva. Extensiones → Apps Script. Pegá este archivo.
 * 2. Implementar → Nueva implementación → Tipo "Aplicación web".
 *    Ejecutar como: Yo · Quién tiene acceso: Cualquier persona.
 * 3. Copiá la URL (termina en /exec):
 *    - pegala en src/config.js → DOLORES_ENDPOINT (recibe los mensajes)
 *    - y como variable del repo DOLORES_FEED_URL en GitHub (Settings → Secrets and variables → Actions → Variables)
 *
 * Moderación: cada fila tiene la columna "aprobado". Con AUTO_APROBAR = true
 * los mensajes se publican solos; escribí NO en esa columna para ocultar uno.
 */
const SHEET_NAME = 'dolores';
const AUTO_APROBAR = true;

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['fecha', 'nombre', 'rubro', 'dolor', 'aprobado']);
  }
  return sh;
}

function clean_(v, max) {
  return String(v || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const dolor = clean_(data.dolor, 280);
    if (dolor.length < 10) return json_({ ok: false });
    getSheet_().appendRow([
      new Date(),
      clean_(data.nombre, 40),
      clean_(data.rubro, 30),
      dolor,
      AUTO_APROBAR ? 'SI' : '',
    ]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Devuelve los mensajes aprobados (sin datos de contacto) para el muro.
function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1);
  const items = rows
    .filter((r) => String(r[4]).toUpperCase() === 'SI')
    .map((r, i) => ({
      id: 'm' + new Date(r[0]).getTime() + '-' + i,
      fecha: new Date(r[0]).toISOString(),
      nombre: r[1],
      rubro: r[2],
      text: r[3],
    }));
  return json_({ items: items });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
