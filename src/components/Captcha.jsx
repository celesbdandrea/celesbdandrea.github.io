import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from '../config.js';

// Cloudflare Turnstile: comprueba que quien envía es una persona.
// A la mayoría no le pide nada; solo muestra una casilla si algo le resulta sospechoso.
// En desarrollo, sin clave propia, se usa la clave de prueba de Cloudflare (siempre aprueba).
const SITE_KEY = TURNSTILE_SITE_KEY || (import.meta.env.DEV ? '1x00000000000000000000AA' : '');
export const CAPTCHA_ACTIVO = Boolean(SITE_KEY);

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let cargando = null;

function cargarScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!cargando) {
    cargando = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve(window.turnstile);
      s.onerror = () => {
        cargando = null;
        reject(new Error('turnstile'));
      };
      document.head.appendChild(s);
    });
  }
  return cargando;
}

/**
 * <Captcha onToken={setToken} theme="light" />
 * El token sirve una sola vez: después de enviar, llamá a ref.current.reset().
 */
const Captcha = forwardRef(function Captcha({ onToken, theme = 'light', action }, ref) {
  const box = useRef(null);
  const id = useRef(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useImperativeHandle(ref, () => ({
    reset() {
      cb.current('');
      if (window.turnstile && id.current != null) window.turnstile.reset(id.current);
    },
  }));

  useEffect(() => {
    if (!CAPTCHA_ACTIVO) return undefined;
    let vivo = true;
    cargarScript()
      .then((ts) => {
        if (!vivo || !box.current) return;
        id.current = ts.render(box.current, {
          sitekey: SITE_KEY,
          theme,
          action,
          language: 'es',
          size: 'flexible',
          appearance: 'interaction-only',
          callback: (t) => cb.current(t),
          'expired-callback': () => cb.current(''),
          'error-callback': () => cb.current(''),
        });
      })
      .catch(() => cb.current(''));
    return () => {
      vivo = false;
      if (window.turnstile && id.current != null) window.turnstile.remove(id.current);
      id.current = null;
    };
  }, [theme, action]);

  if (!CAPTCHA_ACTIVO) return null;
  return <div ref={box} className="captcha" />;
});

export default Captcha;
