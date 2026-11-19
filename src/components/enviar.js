import { FORMS_ENDPOINT } from '../config.js';

/**
 * Envía un formulario al Apps Script y lee la respuesta.
 * Se manda como text/plain para evitar el preflight de CORS, que Apps Script no admite.
 * Si el servidor rechaza el envío, tira un Error con message 'captcha' o 'rechazado'.
 */
export async function enviarFormulario(data) {
  const r = await fetch(FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
  });
  let res = {};
  try {
    res = await r.json();
  } catch {
    throw new Error('rechazado');
  }
  if (!res.ok) throw new Error(res.error === 'captcha' ? 'captcha' : 'rechazado');
  return res;
}
