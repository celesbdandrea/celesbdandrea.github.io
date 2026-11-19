/**
 * Formularios de celesdandrea.com — Google Apps Script
 *
 * Un solo script recibe los dos formularios del sitio:
 *   - "muro": nombre, tienda y desafío. Se publican en el muro de la landing.
 *   - "contactos": nombre, email, etapa y duda. Privados, nunca se publican.
 *
 * 1. Creá una Google Sheet nueva y privada (por ejemplo "Formularios web").
 *    Extensiones → Apps Script. Pegá este archivo.
 * 2. Implementar → Nueva implementación → Tipo "Aplicación web".
 *    Ejecutar como: Yo · Quién tiene acceso: Cualquier persona.
 * 3. Copiá la URL (termina en /exec) y pegala en src/config.js → FORMS_ENDPOINT.
 *
 * Quién puede ver qué: cualquiera puede ENVIAR datos y leer los mensajes del
 * muro (solo nombre, tienda, desafío y fecha). La pestaña "contactos" no se
 * expone nunca.
 *
 * Moderación del muro: con AUTO_APROBAR = true cada mensaje aparece al instante.
 * Para ocultar uno, escribí NO en la columna "aprobado". Las palabras de
 * PALABRAS_BLOQUEADAS hacen que el mensaje quede oculto hasta que lo revises.
 *
 * Ley 25.326: los contactos se borran 12 meses después de la última conversación;
 * los mensajes del muro, cuando la persona lo pida.
 *
 * Anti-bots (Cloudflare Turnstile): guardá la "secret key" del widget en
 * Configuración del proyecto (ícono de engranaje) → Propiedades del script →
 * Agregar propiedad: TURNSTILE_SECRET = <tu secret key>. Con esa propiedad
 * cargada, se rechaza todo envío que no traiga una verificación válida.
 * La primera vez Google te va a pedir autorizar "conectarse a un servicio
 * externo": es para consultar a Cloudflare.
 *
 * Si cambiás este archivo: Implementar → Gestionar implementaciones → editar →
 * Versión nueva. Así la URL /exec sigue siendo la misma.
 */
const AUTO_APROBAR = true;
const NOTIFICAR = true; // te llega un email por cada consulta de contacto
const MURO_LIMITE = 24; // mensajes que devuelve el muro (los más nuevos)
const PALABRAS_BLOQUEADAS = ['http://', 'https://', 'www.', 'casino', 'crypto', 'bitcoin'];

const HOJAS = {
  muro: ['fecha', 'nombre', 'tienda', 'desafio', 'consentimiento', 'aviso', 'aprobado'],
  contactos: ['fecha', 'nombre', 'email', 'etapa', 'duda', 'consentimiento', 'aviso', 'respondido'],
};

function getSheet_(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(HOJAS[nombre]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function clean_(v, max) {
  // Saca < > y evita que la planilla interprete el texto como fórmula.
  return String(v || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').replace(/^[=+\-]+/, '').trim().slice(0, max);
}

// Consulta a Cloudflare si el token del formulario es de una persona real.
// Si no hay TURNSTILE_SECRET cargada, no se verifica (sirve para la transición).
function captchaOk_(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret) return true;
  if (!token || String(token).length > 2048) return false;
  try {
    const res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: secret, response: String(token) },
      muteHttpExceptions: true,
    });
    return JSON.parse(res.getContentText()).success === true;
  } catch (err) {
    return false;
  }
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false });
  }
  if (data.web) return json_({ ok: false }); // campo trampa para bots
  if (!captchaOk_(data.captcha)) return json_({ ok: false, error: 'captcha' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (data.tipo === 'muro') return guardarMuro_(data);
    if (data.tipo === 'contacto') return guardarContacto_(data);
    return json_({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function guardarMuro_(data) {
  const nombre = clean_(data.nombre, 40);
  const tienda = clean_(data.tienda, 40);
  const desafio = clean_(data.desafio, 280);
  if (!nombre || !tienda || desafio.length < 10 || data.consentimiento !== true) return json_({ ok: false });
  const texto = (nombre + ' ' + tienda + ' ' + desafio).toLowerCase();
  const sospechoso = PALABRAS_BLOQUEADAS.some((p) => texto.indexOf(p) !== -1);
  const aprobado = AUTO_APROBAR && !sospechoso ? 'SI' : '';
  getSheet_('muro').appendRow([new Date(), nombre, tienda, desafio, 'SI', clean_(data.aviso, 20), aprobado]);
  return json_({ ok: true, publicado: aprobado === 'SI' });
}

function guardarContacto_(data) {
  const nombre = clean_(data.nombre, 60);
  const email = clean_(data.email, 120);
  const etapa = clean_(data.etapa, 60);
  const duda = clean_(data.duda, 1000);
  const valido = nombre && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && etapa && duda.length >= 10 && data.consentimiento === true;
  if (!valido) return json_({ ok: false });
  getSheet_('contactos').appendRow([new Date(), nombre, email, etapa, duda, 'SI', clean_(data.aviso, 20), '']);
  if (NOTIFICAR) {
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: email,
      subject: 'Nueva duda en la web: ' + nombre,
      body: nombre + ' (' + email + ')\nEtapa: ' + etapa + '\n\n' + duda,
    });
  }
  return json_({ ok: true });
}

// Devuelve los mensajes aprobados del muro, del más nuevo al más viejo.
// Nunca devuelve datos de la pestaña "contactos".
function doGet() {
  const rows = getSheet_('muro').getDataRange().getValues().slice(1);
  const items = rows
    .map((r, i) => ({ r: r, i: i }))
    .filter((x) => String(x.r[6]).toUpperCase() === 'SI')
    .sort((a, b) => new Date(b.r[0]) - new Date(a.r[0]))
    .slice(0, MURO_LIMITE)
    .map((x) => ({
      id: 'm' + new Date(x.r[0]).getTime() + '-' + x.i,
      fecha: new Date(x.r[0]).toISOString(),
      nombre: String(x.r[1]),
      tienda: String(x.r[2]),
      desafio: String(x.r[3]),
    }));
  return json_({ items: items });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
