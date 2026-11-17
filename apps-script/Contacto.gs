/**
 * Formulario de contacto — Google Apps Script
 *
 * 1. Creá una Google Sheet nueva y privada (por ejemplo "Contactos web").
 *    Extensiones → Apps Script. Pegá este archivo.
 * 2. Implementar → Nueva implementación → Tipo "Aplicación web".
 *    Ejecutar como: Yo · Quién tiene acceso: Cualquier persona.
 *    (Esto solo permite ENVIAR datos; nadie puede leer la planilla.)
 * 3. Copiá la URL (termina en /exec) y pegala en src/config.js → CONTACT_ENDPOINT.
 *
 * Cada envío suma una fila con la fecha, los datos, el consentimiento y la
 * versión del aviso de privacidad que aceptó la persona. Si NOTIFICAR es true,
 * además te llega un email con la consulta (Google pide autorizarlo la primera vez).
 *
 * Ley 25.326: el aviso del sitio dice que los datos se borran 12 meses después
 * de la última conversación. Revisá la hoja una vez por mes y borrá las filas viejas.
 */
const SHEET_NAME = 'contactos';
const NOTIFICAR = true;

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['fecha', 'nombre', 'email', 'etapa', 'duda', 'consentimiento', 'aviso', 'respondido']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function clean_(v, max) {
  // Saca < > y evita que la planilla interprete el texto como fórmula.
  return String(v || '').replace(/[<>]/g, '').replace(/^[=+\-@]+/, '').trim().slice(0, max);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');
    const nombre = clean_(data.nombre, 60);
    const email = clean_(data.email, 120);
    const etapa = clean_(data.etapa, 60);
    const duda = clean_(data.duda, 1000);
    const valido =
      nombre && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && etapa && duda.length >= 10 && data.consentimiento === true;
    if (!valido) return json_({ ok: false });

    getSheet_().appendRow([new Date(), nombre, email, etapa, duda, 'SI', clean_(data.aviso, 20), '']);

    if (NOTIFICAR) {
      MailApp.sendEmail({
        to: Session.getEffectiveUser().getEmail(),
        replyTo: email,
        subject: 'Nueva duda en la web: ' + nombre,
        body: nombre + ' (' + email + ')\nEtapa: ' + etapa + '\n\n' + duda,
      });
    }
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
