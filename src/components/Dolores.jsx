import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, SplitTitle, Magnetic } from './motion.jsx';
import { DOLORES_ENDPOINT, CONTACT } from '../config.js';
import { useToast } from './Toast.jsx';

const MAX = 280;
const RUBROS = ['Indumentaria', 'Deco & hogar', 'Belleza', 'Alimentos', 'Accesorios', 'Servicios', 'Otro'];
const TINTS = ['tint-a', 'tint-b', 'tint-c', 'tint-d'];

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}

function daysUntil(iso) {
  if (!iso) return null;
  const d = Math.ceil((new Date(iso) - new Date()) / 86400000);
  return Math.max(0, d);
}

export default function Dolores() {
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', rubro: '', dolor: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [mine, setMine] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/dolores.json`, { cache: 'no-cache' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ items: [] }))
      .finally(() => setLoading(false));
  }, []);

  const remaining = daysUntil(data.nextUpdate);
  const left = MAX - form.dolor.length;
  const valid = form.dolor.trim().length >= 10;

  async function submit(e) {
    e.preventDefault();
    if (!valid) {
      toast('Contame un poco más: mínimo 10 caracteres.', 'warn');
      return;
    }
    setStatus('sending');
    const payload = {
      nombre: form.nombre.trim().slice(0, 40),
      rubro: form.rubro,
      dolor: form.dolor.trim().slice(0, MAX),
    };
    try {
      if (DOLORES_ENDPOINT) {
        // Apps Script no admite CORS preflight: se envía como text/plain y sin leer la respuesta.
        await fetch(DOLORES_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      } else {
        const body = `Rubro: ${payload.rubro || '-'}\nNombre: ${payload.nombre || 'Anónimo'}\n\n${payload.dolor}`;
        window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
          'Mi principal dolor con mi negocio online'
        )}&body=${encodeURIComponent(body)}`;
      }
      setMine({ id: 'mine', text: payload.dolor, rubro: payload.rubro, nombre: payload.nombre, mine: true });
      setStatus('sent');
      setForm({ nombre: '', rubro: '', dolor: '' });
      toast('Gracias, tu mensaje llegó.', 'ok');
    } catch {
      setStatus('idle');
      toast('Ups, no se pudo enviar. Probá de nuevo en un ratito.', 'error');
    }
  }

  const items = useMemo(() => (mine ? [mine, ...data.items] : data.items), [mine, data.items]);

  return (
    <section className="dolores" id="muro">
      <div className="section-head">
        <Reveal as="p" className="eyebrow">
          Muro de la comunidad
        </Reveal>
        <SplitTitle className="display display--dark" text="¿Qué te quita el *sueño?*" />
        <Reveal delay={0.2}>
          <p className="mono-p center">
            Dejame tu principal dolor con tu negocio online. Los mensajes aparecen en este muro (de forma
            anónima si querés) y se renuevan cada 15 días. Con ellos armo los próximos contenidos.
          </p>
        </Reveal>
      </div>

      <div className="dolores__layout">
        <Reveal className="dolores__form-wrap" y={30}>
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="thanks"
                className="thanks"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.svg viewBox="0 0 52 52" className="check">
                  <motion.circle cx="26" cy="26" r="24" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                  <motion.path d="M14 27 l8 8 l16 -18" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
                </motion.svg>
                <h3>
                  ¡Gracias por <span className="it">compartirlo!</span>
                </h3>
                <p>
                  {DOLORES_ENDPOINT
                    ? `Tu mensaje se suma al muro en la próxima actualización${
                        data.nextUpdate ? ` (${formatDate(data.nextUpdate)})` : ''
                      }.`
                    : 'Se abrió tu correo con el mensaje listo para enviar.'}
                </p>
                <button className="btn btn--outline" onClick={() => setStatus('idle')}>
                  Dejar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" className="dolor-form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label className="field">
                  <span>Tu nombre (opcional)</span>
                  <input
                    value={form.nombre}
                    maxLength={40}
                    placeholder="Anónimo"
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </label>
                <div className="field">
                  <span>Rubro</span>
                  <div className="chips">
                    {RUBROS.map((r) => (
                      <motion.button
                        type="button"
                        key={r}
                        className={`chip chip--select ${form.rubro === r ? 'is-on' : ''}`}
                        onClick={() => setForm({ ...form, rubro: form.rubro === r ? '' : r })}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ y: -2 }}
                        aria-pressed={form.rubro === r}
                      >
                        {r}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <label className="field">
                  <span>Tu principal dolor</span>
                  <textarea
                    rows={4}
                    maxLength={MAX}
                    value={form.dolor}
                    placeholder="Ej: tengo visitas pero nadie compra…"
                    onChange={(e) => setForm({ ...form, dolor: e.target.value })}
                  />
                  <div className="meter">
                    <motion.div
                      className="meter__bar"
                      animate={{
                        width: `${(form.dolor.length / MAX) * 100}%`,
                        backgroundColor: left < 30 ? '#550b14' : '#7e6961',
                      }}
                    />
                    <motion.small key={left < 30} animate={{ scale: left < 30 ? [1, 1.2, 1] : 1 }} className={left < 30 ? 'warn' : ''}>
                      {left}
                    </motion.small>
                  </div>
                </label>
                <Magnetic as="button" type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'} strength={0.15}>
                  {status === 'sending' ? <span className="spinner" /> : 'Sumar mi mensaje al muro'}
                </Magnetic>
                <p className="fineprint">No publiques datos personales. Los mensajes se moderan antes de aparecer.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>

        <div className="dolores__wall">
          <div className="wall-meta">
            <span>
              <span className="live-dot" /> {data.items.length} mensajes en el muro
            </span>
            {remaining !== null && (
              <span>
                Próxima actualización: <strong>{remaining === 0 ? 'hoy' : `en ${remaining} días`}</strong>
              </span>
            )}
          </div>
          {loading ? (
            <div className="wall-grid">
              {[0, 1, 2, 3].map((i) => (
                <div className="note note--skeleton" key={i} />
              ))}
            </div>
          ) : (
            <motion.div className="wall-grid" layout>
              <AnimatePresence>
                {items.map((m, i) => (
                  <motion.figure
                    layout
                    key={m.id}
                    className={`note ${TINTS[i % TINTS.length]} ${m.mine ? 'note--mine' : ''}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ type: 'spring', stiffness: 90, damping: 14, delay: (i % 4) * 0.08 }}
                    whileHover={{ y: -4, zIndex: 2 }}
                  >
                    {m.mine && <span className="note__badge">tu mensaje · en revisión</span>}
                    <blockquote>“{m.text}”</blockquote>
                    <figcaption>
                      — {m.nombre || 'Anónimo'}
                      {m.rubro ? <span> · {m.rubro}</span> : null}
                    </figcaption>
                  </motion.figure>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          {data.updatedAt && <p className="fineprint right">Actualizado el {formatDate(data.updatedAt)}</p>}
        </div>
      </div>
    </section>
  );
}
