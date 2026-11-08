// Actualiza public/data/dolores.json con los mensajes más nuevos del muro.
// Lo ejecuta GitHub Actions cada ~15 días (días 1 y 16 de cada mes).
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../public/data/dolores.json', import.meta.url);
const FEED = process.env.DOLORES_FEED_URL;
const LIMIT = Number(process.env.DOLORES_LIMIT || 12);
const DAYS = 15;

const current = JSON.parse(await readFile(FILE, 'utf8'));
const now = new Date();
const next = new Date(now.getTime() + DAYS * 86400000);

let items = current.items;
if (FEED) {
  const res = await fetch(FEED, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Feed respondió ${res.status}`);
  const body = await res.json();
  const fresh = (body.items || [])
    .filter((m) => m && typeof m.text === 'string' && m.text.trim().length >= 10)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, LIMIT)
    .map(({ id, text, rubro, nombre }) => ({
      id: String(id),
      text: text.trim().slice(0, 280),
      rubro: String(rubro || '').slice(0, 30),
      nombre: String(nombre || '').slice(0, 40),
    }));
  if (fresh.length) items = fresh;
  console.log(`Feed: ${body.items?.length ?? 0} aprobados, publicando ${items.length}.`);
} else {
  console.log('DOLORES_FEED_URL no configurada: se mantienen los mensajes actuales.');
}

const out = { updatedAt: now.toISOString(), nextUpdate: next.toISOString(), items };
await writeFile(FILE, JSON.stringify(out, null, 2) + '\n');
console.log(`Próxima actualización: ${next.toISOString().slice(0, 10)}`);
