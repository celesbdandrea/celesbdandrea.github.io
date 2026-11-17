import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, SplitTitle } from './motion.jsx';
import { Arrow } from './Sections.jsx';
import { CONTACT, FORMS_ENDPOINT } from '../config.js';
import { AvisoPrivacidad, AVISO_VERSION } from './Privacy.jsx';
import { useToast } from './Toast.jsx';

const ETAPAS = [
  'Tengo una idea, todavía no vendo',
  'Vendo en un local o por redes',
  'Estoy armando mi tienda online',
  'Ya tengo tienda y recién arranco',
];


const EMPTY = { nombre: '', email: '', etapa: '', duda: '', acepta: false, web: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const [f, setF] = useState(EMPTY);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const toast = useToast();

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const errors = {
    nombre: !f.nombre.trim(),
    email: !EMAIL_RE.test(f.email.trim()),
    etapa: !f.etapa,
    duda: f.duda.trim().length < 10,
    acepta: !f.acepta,
  };
  const invalid = Object.values(errors).some(Boolean);
  const err = (k) => touched && errors[k];

  async function onSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (invalid) {
      toast(errors.acepta && !errors.nombre && !errors.email && !errors.etapa && !errors.duda
        ? 'Para enviarlo, aceptá el aviso de privacidad.'
        : 'Revisá los campos marcados.', 'warn');
      return;
    }
    // Campo trampa para bots: una persona no lo ve ni lo completa.
    if (f.web) return;

    const data = {
      tipo: 'contacto',
      nombre: f.nombre.trim(),
      email: f.email.trim(),
      etapa: f.etapa,
      duda: f.duda.trim(),
      consentimiento: true,
      aviso: AVISO_VERSION,
    };

    if (!FORMS_ENDPOINT) {
      const body = `Hola Celes, soy ${data.nombre} (${data.email}).\nEtapa: ${data.etapa}\n\n${data.duda}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
        `Duda de ${data.nombre}`
      )}&body=${encodeURIComponent(body)}`;
      toast('Abriendo tu correo con el mensaje listo.', 'ok');
      return;
    }

    setStatus('sending');
    try {
      await fetch(FORMS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      });
      setStatus('sent');
      setF(EMPTY);
      setTouched(false);
    } catch {
      setStatus('idle');
      toast('No se pudo enviar. Probá de nuevo o escribime por Instagram.', 'error');
    }
  }

  return (
    <section className="contact" id="contacto">
      <div className="section-head">
        <Reveal as="p" className="eyebrow eyebrow--light">
          Contacto
        </Reveal>
        <SplitTitle className="display display--light" text="Compartí tus *dudas* conmigo" />
        <Reveal delay={0.2}>
          <p className="mono-p mono-p--light center">
            Contame en qué etapa está tu negocio y qué te está frenando. Te respondo por email.
          </p>
        </Reveal>
      </div>

      <div className="contact__layout">
        <Reveal className="contact__form" y={30}>
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="ok"
                className="thanks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
              >
                <svg className="check" viewBox="0 0 56 56" aria-hidden>
                  <circle cx="28" cy="28" r="26" />
                  <path d="M17 29l7 7 15-16" />
                </svg>
                <h3>
                  ¡Gracias! Ya tengo <span className="it">tu duda.</span>
                </h3>
                <p>Te respondo por email en los próximos días.</p>
                <button type="button" className="cta" onClick={() => setStatus('idle')}>
                  Enviar otra
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="row">
                  <label className={`field ${err('nombre') ? 'has-error' : ''}`}>
                    <span>Tu nombre *</span>
                    <input name="nombre" autoComplete="given-name" maxLength={60} value={f.nombre} onChange={set('nombre')} aria-invalid={err('nombre') || undefined} />
                  </label>
                  <label className={`field ${err('email') ? 'has-error' : ''}`}>
                    <span>Tu email *</span>
                    <input name="email" type="email" inputMode="email" autoComplete="email" maxLength={120} value={f.email} onChange={set('email')} aria-invalid={err('email') || undefined} />
                    {err('email') && f.email && <small className="field__msg">Revisá que el email esté bien escrito.</small>}
                  </label>
                </div>

                <fieldset className={`field etapas ${err('etapa') ? 'has-error' : ''}`}>
                  <legend>
                    <span>¿En qué etapa está tu negocio? *</span>
                  </legend>
                  <div className="etapas__opts">
                    {ETAPAS.map((t) => (
                      <label key={t} className={`etapa ${f.etapa === t ? 'is-on' : ''}`}>
                        <input type="radio" name="etapa" value={t} checked={f.etapa === t} onChange={set('etapa')} />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className={`field ${err('duda') ? 'has-error' : ''}`}>
                  <span>¿Cuál es tu duda principal? *</span>
                  <textarea
                    name="duda"
                    rows={4}
                    maxLength={1000}
                    value={f.duda}
                    onChange={set('duda')}
                    placeholder="Ej: vendo por Instagram y no sé si me conviene abrir una tienda online."
                    aria-invalid={err('duda') || undefined}
                  />
                </label>

                <label className="hp" aria-hidden>
                  No completar
                  <input name="web" tabIndex={-1} autoComplete="off" value={f.web} onChange={set('web')} />
                </label>

                <div className={`privacy ${err('acepta') ? 'has-error' : ''}`}>
                  <p className="privacy__short">
                    Uso tus datos solo para responder tu consulta. No los comparto ni los uso para enviarte
                    publicidad. Podés pedirme que los corrija o los borre cuando quieras.
                  </p>
                  <details className="privacy__full">
                    <summary>Leer el aviso de privacidad completo</summary>
                    <AvisoPrivacidad tipo="contacto" />
                  </details>
                  <label className="consent">
                    <input type="checkbox" name="acepta" checked={f.acepta} onChange={set('acepta')} aria-invalid={err('acepta') || undefined} />
                    <span>Leí el aviso de privacidad y acepto que uses mis datos para responder mi consulta. *</span>
                  </label>
                </div>

                <button type="submit" className="btn btn--primary-inv btn--block" disabled={status === 'sending'} data-cta="form-enviar">
                  {status === 'sending' ? <span className="spinner spinner--dark" aria-label="Enviando" /> : <>Enviar mi duda <Arrow /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>

        <Reveal className="contact__aside" delay={0.2} x={40} y={0}>
          <p className="eyebrow eyebrow--light">Asesoría 1:1</p>
          <p className="contact__aside-title">
            Si necesitás acompañamiento personalizado, <span className="it">escribime.</span>
          </p>
          <p className="mono-p mono-p--light">
            Contalo en tu duda y te cuento cómo podemos trabajar juntos.
          </p>
          <span className="contact__rule" aria-hidden />
          <p className="mono-p mono-p--light">¿Preferís escribirme directo?</p>
          <div className="contact__direct">
            <a href={`mailto:${CONTACT.email}`} className="link" data-cta="contacto-email">
              {CONTACT.email}
            </a>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="pill" data-cta="contacto-instagram">
              Escribime por Instagram <Arrow />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
