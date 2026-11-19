import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, SplitTitle } from './motion.jsx';
import { Arrow } from './Sections.jsx';
import { FORMS_ENDPOINT } from '../config.js';
import { useToast } from './Toast.jsx';
import { AvisoPrivacidad, AVISO_VERSION } from './Privacy.jsx';
import Captcha, { CAPTCHA_ACTIVO } from './Captcha.jsx';
import { enviarFormulario } from './enviar.js';

const MAX = 280;
const VISIBLES = 9;
const TINTS = ['tint-a', 'tint-b', 'tint-c'];
const EMPTY = { nombre: '', tienda: '', desafio: '', acepta: false, web: '' };

// El muro se muestra cuando está conectado a la planilla. En `npm run dev`
// sin conexión, muestra mensajes de ejemplo marcados como tales.
export const MURO_ACTIVO = Boolean(FORMS_ENDPOINT) || import.meta.env.DEV;
const DEMO = import.meta.env.DEV && !FORMS_ENDPOINT;
const DEMO_ITEMS = [
  { id: 'd1', nombre: 'Martina', tienda: 'Lino & Barro', desafio: 'Tengo visitas en la tienda pero casi nadie termina comprando.', fecha: new Date(Date.now() - 36e5).toISOString() },
  { id: 'd2', nombre: 'Julián', tienda: '@mates.delsur', desafio: 'No sé cómo calcular el precio con el envío incluido.', fecha: new Date(Date.now() - 864e5).toISOString() },
  { id: 'd3', nombre: 'Sofi', tienda: 'Sofi Bijou', desafio: 'Vendo por Instagram y quiero pasar a una tienda online, pero no sé por dónde empezar.', fecha: new Date(Date.now() - 3 * 864e5).toISOString() },
  { id: 'd4', nombre: 'Romina', tienda: 'Almacén Doña Rosa', desafio: 'Tengo un local y quiero empezar a vender online sin descuidar el mostrador.', fecha: new Date(Date.now() - 5 * 864e5).toISOString() },
];

const rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });
function haceCuanto(iso) {
  const min = Math.round((new Date(iso) - Date.now()) / 60000);
  if (Math.abs(min) < 60) return rtf.format(Math.min(min, -1), 'minute');
  const h = Math.round(min / 60);
  if (Math.abs(h) < 24) return rtf.format(h, 'hour');
  const d = Math.round(h / 24);
  if (Math.abs(d) < 30) return rtf.format(d, 'day');
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}

export default function Dolores() {
  const [items, setItems] = useState([]);
  const [estado, setEstado] = useState('cargando'); // cargando | listo | error
  const [mine, setMine] = useState(null);
  const [verTodos, setVerTodos] = useState(false);
  const [f, setF] = useState(EMPTY);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [captcha, setCaptcha] = useState('');
  const captchaRef = useRef(null);
  const toast = useToast();

  const cargar = useCallback(async () => {
    if (DEMO) {
      setItems(DEMO_ITEMS);
      setEstado('listo');
      return;
    }
    try {
      const r = await fetch(FORMS_ENDPOINT, { cache: 'no-store' });
      const body = await r.json();
      setItems(Array.isArray(body.items) ? body.items : []);
      setEstado('listo');
    } catch {
      setEstado((e) => (e === 'listo' ? e : 'error'));
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const errors = {
    nombre: !f.nombre.trim(),
    tienda: !f.tienda.trim(),
    desafio: f.desafio.trim().length < 10,
    acepta: !f.acepta,
  };
  const err = (k) => touched && errors[k];
  const left = MAX - f.desafio.length;

  async function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) {
      toast(
        errors.desafio && f.desafio.trim()
          ? 'Contame un poco más: mínimo 10 caracteres.'
          : errors.acepta && !errors.nombre && !errors.tienda && !errors.desafio
            ? 'Para publicarlo, aceptá que se muestre en el muro.'
            : 'Revisá los campos marcados.',
        'warn'
      );
      return;
    }
    if (f.web) return;
    if (CAPTCHA_ACTIVO && !captcha) {
      toast('Estamos comprobando que no sos un robot. Probá de nuevo en unos segundos.', 'warn');
      return;
    }

    const data = {
      tipo: 'muro',
      nombre: f.nombre.trim().slice(0, 40),
      tienda: f.tienda.trim().slice(0, 40),
      desafio: f.desafio.trim().slice(0, MAX),
      consentimiento: true,
      aviso: AVISO_VERSION,
      captcha,
    };
    setStatus('sending');
    try {
      if (!DEMO) await enviarFormulario(data);
      setMine({ id: 'mine', nombre: data.nombre, tienda: data.tienda, desafio: data.desafio, fecha: new Date().toISOString(), mine: true });
      setStatus('sent');
      setF(EMPTY);
      setTouched(false);
      toast('Listo, tu mensaje ya está en el muro.', 'ok');
      if (!DEMO) setTimeout(cargar, 2500);
    } catch (e) {
      setStatus('idle');
      toast(
        e.message === 'captcha'
          ? 'No pudimos comprobar que no sos un robot. Probá de nuevo.'
          : 'No se pudo enviar. Probá de nuevo en un rato.',
        'error'
      );
    } finally {
      captchaRef.current?.reset();
    }
  }

  // Si el mensaje propio ya volvió de la planilla, se muestra una sola vez.
  const todos = useMemo(() => {
    if (!mine) return items;
    const yaEsta = items.some((m) => m.nombre === mine.nombre && m.desafio === mine.desafio);
    return yaEsta
      ? items.map((m) => (m.nombre === mine.nombre && m.desafio === mine.desafio ? { ...m, mine: true } : m))
      : [mine, ...items];
  }, [mine, items]);
  const visibles = verTodos ? todos : todos.slice(0, VISIBLES);

  if (!MURO_ACTIVO) return null;

  return (
    <section className="dolores" id="muro">
      <div className="section-head">
        <Reveal as="p" className="eyebrow">
          Muro de la comunidad
        </Reveal>
        <SplitTitle className="display display--dark" text="¿Cuál es tu principal *desafío?*" />
        <Reveal delay={0.2}>
          <p className="mono-p center">
            Contá qué es lo que más te cuesta hoy con tu negocio online. Tu mensaje aparece en el muro al
            instante y me ayuda a elegir los próximos temas.
          </p>
        </Reveal>
      </div>

      <div className="dolores__layout">
        <Reveal className="dolores__form-wrap" y={30}>
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="ok" className="thanks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status">
                <svg className="check" viewBox="0 0 56 56" aria-hidden>
                  <circle cx="28" cy="28" r="26" />
                  <path d="M17 29l7 7 15-16" />
                </svg>
                <h3>
                  ¡Gracias por <span className="it">compartirlo!</span>
                </h3>
                <p>Tu mensaje ya está en el muro.</p>
                <button type="button" className="cta" onClick={() => setStatus('idle')}>
                  Sumar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label className={`field ${err('nombre') ? 'has-error' : ''}`}>
                  <span>Tu nombre *</span>
                  <input name="nombre" autoComplete="given-name" maxLength={40} value={f.nombre} onChange={set('nombre')} aria-invalid={err('nombre') || undefined} />
                </label>
                <label className={`field ${err('tienda') ? 'has-error' : ''}`}>
                  <span>Tu tienda *</span>
                  <input name="tienda" maxLength={40} value={f.tienda} onChange={set('tienda')} placeholder="Nombre o @ de Instagram" aria-invalid={err('tienda') || undefined} />
                </label>
                <label className={`field ${err('desafio') ? 'has-error' : ''}`}>
                  <span>Tu principal desafío *</span>
                  <textarea
                    name="desafio"
                    rows={4}
                    maxLength={MAX}
                    value={f.desafio}
                    onChange={set('desafio')}
                    placeholder="Ej: tengo visitas pero casi nadie compra."
                    aria-invalid={err('desafio') || undefined}
                  />
                  <div className="meter">
                    <motion.div
                      className="meter__bar"
                      animate={{ width: `${(f.desafio.length / MAX) * 100}%`, backgroundColor: left < 30 ? '#550b14' : '#7e6961' }}
                    />
                    <small className={left < 30 ? 'warn' : ''}>{left}</small>
                  </div>
                </label>

                <label className="hp" aria-hidden>
                  No completar
                  <input name="web" tabIndex={-1} autoComplete="off" value={f.web} onChange={set('web')} />
                </label>

                <div className={`privacy privacy--light ${err('acepta') ? 'has-error' : ''}`}>
                  <p className="privacy__short">
                    Tu nombre, tu tienda y tu mensaje se publican en este muro. No pongas datos de contacto.
                    Si querés que lo borre, escribime.
                  </p>
                  <details className="privacy__full">
                    <summary>Leer el aviso de privacidad completo</summary>
                    <AvisoPrivacidad tipo="muro" />
                  </details>
                  <label className="consent">
                    <input type="checkbox" name="acepta" checked={f.acepta} onChange={set('acepta')} aria-invalid={err('acepta') || undefined} />
                    <span>Acepto que mi nombre, mi tienda y mi mensaje se publiquen en este muro. *</span>
                  </label>
                </div>

                <Captcha ref={captchaRef} onToken={setCaptcha} theme="light" action="muro" />

                <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'} data-cta="muro-enviar">
                  {status === 'sending' ? <span className="spinner" aria-label="Enviando" /> : <>Publicar en el muro <Arrow /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>

        <div className="dolores__wall" aria-live="polite">
          {DEMO && <p className="demo-badge">Vista de ejemplo: solo se ve en tu compu hasta conectar la planilla.</p>}
          {estado === 'listo' && todos.length > 0 && (
            <p className="wall-meta">
              <span className="live-dot" /> {todos.length} {todos.length === 1 ? 'mensaje' : 'mensajes'} en el muro
            </p>
          )}
          {estado === 'cargando' ? (
            <div className="wall-grid">
              {[0, 1, 2, 3].map((i) => (
                <div className="note note--skeleton" key={i} />
              ))}
            </div>
          ) : estado === 'error' && !todos.length ? (
            <p className="wall-empty">No pude cargar el muro. Probá recargar la página.</p>
          ) : !todos.length ? (
            <p className="wall-empty">
              Todavía no hay mensajes. Contá tu desafío y <span className="it">abrí el muro.</span>
            </p>
          ) : (
            <motion.div className="wall-grid" layout>
              <AnimatePresence initial={false}>
                {visibles.map((m, i) => (
                  <motion.figure
                    layout
                    key={m.id}
                    className={`note ${TINTS[i % TINTS.length]} ${m.mine ? 'note--mine' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 90, damping: 16, delay: Math.min(i, 6) * 0.05 }}
                  >
                    {m.mine && <span className="note__badge">Tu mensaje</span>}
                    <blockquote>{m.desafio}</blockquote>
                    <figcaption>
                      <strong>{m.nombre}</strong>
                      <span className="note__tienda">{m.tienda}</span>
                      {m.fecha && <time dateTime={m.fecha}>{haceCuanto(m.fecha)}</time>}
                    </figcaption>
                  </motion.figure>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          {todos.length > VISIBLES && !verTodos && (
            <button type="button" className="cta wall-more" onClick={() => setVerTodos(true)}>
              Ver todos los mensajes
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
