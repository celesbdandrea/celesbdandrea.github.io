import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, SplitTitle, Magnetic } from './motion.jsx';
import { CONTACT } from '../config.js';
import { useToast } from './Toast.jsx';

const MOTIVOS = [
  { id: 'asesoria', label: 'Quiero asesorarme', emoji: '💬', intro: 'me gustaría recibir una asesoría para mi negocio online' },
  { id: 'escalar', label: 'Necesito escalar mi negocio', emoji: '📈', intro: 'necesito ayuda para escalar mi negocio' },
  { id: 'paso', label: 'No sé cuál es mi próximo paso', emoji: '🧭', intro: 'no sé cuál es el próximo paso para mi negocio' },
  { id: 'auditoria', label: 'Quiero auditar mi negocio', emoji: '🔍', intro: 'quiero hacer una auditoría de mi negocio' },
];

export default function Contact() {
  const [motivo, setMotivo] = useState('asesoria');
  const [f, setF] = useState({ nombre: '', negocio: '', web: '', mensaje: '' });
  const [touched, setTouched] = useState(false);
  const toast = useToast();

  const m = MOTIVOS.find((x) => x.id === motivo);
  const missing = !f.nombre.trim() || !f.mensaje.trim();

  const text = useMemo(() => {
    const lines = [
      `¡Hola Celes! Soy ${f.nombre.trim() || '[tu nombre]'}${f.negocio.trim() ? `, de ${f.negocio.trim()}` : ''}.`,
      `Te escribo porque ${m.intro}.`,
      '',
      f.mensaje.trim() || '[contame un poco sobre tu situación]',
    ];
    if (f.web.trim()) lines.push('', `Mi tienda: ${f.web.trim()}`);
    return lines.join('\n');
  }, [f, m]);

  function guard() {
    setTouched(true);
    if (missing) {
      toast('Completá tu nombre y tu mensaje para enviarlo ✨', 'warn');
      return false;
    }
    return true;
  }

  function sendWhatsApp() {
    if (!guard()) return;
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    toast('Abriendo WhatsApp con tu mensaje listo 💚', 'ok');
  }

  function sendEmail() {
    if (!guard()) return;
    const subject = `${m.label} — ${f.negocio.trim() || f.nombre.trim()}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    toast('Abriendo tu correo con el mensaje listo 💌', 'ok');
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      toast('Mensaje copiado al portapapeles 📋', 'ok');
    } catch {
      toast('No se pudo copiar, seleccionalo a mano.', 'error');
    }
  }

  const err = (k) => touched && !f[k].trim();

  return (
    <section className="contact" id="contacto">
      <div className="section-head">
        <Reveal as="p" className="eyebrow eyebrow--light">
          Contacto
        </Reveal>
        <SplitTitle className="display display--light" text="DEMOS *el* PRÓXIMO *paso*" />
        <Reveal delay={0.2}>
          <p className="mono-p mono-p--light center">
            Elegí qué necesitás, completá tus datos y te armo el mensaje listo para enviarme por
            WhatsApp o por correo.
          </p>
        </Reveal>
      </div>

      <div className="contact__layout">
        <Reveal className="contact__form" y={30}>
          <div className="field">
            <span>¿En qué te puedo ayudar?</span>
            <div className="motivos">
              {MOTIVOS.map((x) => (
                <motion.button
                  key={x.id}
                  type="button"
                  className={`motivo ${motivo === x.id ? 'is-on' : ''}`}
                  onClick={() => setMotivo(x.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={motivo === x.id}
                >
                  {motivo === x.id && (
                    <motion.span layoutId="motivo-bg" className="motivo__bg" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />
                  )}
                  <span className="motivo__emoji">{x.emoji}</span>
                  <span className="motivo__label">{x.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="row">
            <label className={`field ${err('nombre') ? 'has-error' : ''}`}>
              <span>Tu nombre *</span>
              <input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} placeholder="Ej: Martina" />
            </label>
            <label className="field">
              <span>Tu negocio</span>
              <input value={f.negocio} onChange={(e) => setF({ ...f, negocio: e.target.value })} placeholder="Ej: Martina Deco" />
            </label>
          </div>
          <label className="field">
            <span>Link de tu tienda o Instagram</span>
            <input value={f.web} onChange={(e) => setF({ ...f, web: e.target.value })} placeholder="www.tutienda.com" />
          </label>
          <label className={`field ${err('mensaje') ? 'has-error' : ''}`}>
            <span>Contame tu situación *</span>
            <textarea
              rows={4}
              value={f.mensaje}
              onChange={(e) => setF({ ...f, mensaje: e.target.value })}
              placeholder="¿Qué vendés, hace cuánto, qué te gustaría lograr?"
            />
          </label>
          <div className="contact__buttons">
            <Magnetic as="button" type="button" className="btn btn--pill btn--wa" onClick={sendWhatsApp} strength={0.2}>
              <WaIcon /> Enviar por WhatsApp
            </Magnetic>
            <Magnetic as="button" type="button" className="btn btn--pill btn--cream" onClick={sendEmail} strength={0.2}>
              ✉ Enviar por correo
            </Magnetic>
          </div>
        </Reveal>

        <Reveal className="preview" delay={0.2} x={40} y={0}>
          <div className="preview__head">
            <span className="preview__avatar">C</span>
            <div>
              <strong>Celes D'Andrea</strong>
              <small>
                <span className="live-dot" /> suele responder en el día
              </small>
            </div>
          </div>
          <div className="preview__body">
            <p className="preview__hint">Así se va a ver tu mensaje:</p>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={motivo}
                className="bubble"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                {text}
                <span className="bubble__time">
                  {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} ✓✓
                </span>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence>
              {!missing && (
                <motion.div className="typing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button type="button" className="preview__copy" onClick={copy}>
            Copiar mensaje
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}
