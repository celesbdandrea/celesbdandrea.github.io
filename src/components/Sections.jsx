import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { Reveal, Stagger, SplitTitle, Magnetic, TiltCard } from './motion.jsx';
import { LINKS, CONTACT, PILARES, RECURSOS } from '../config.js';

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

const img = (f) => `${import.meta.env.BASE_URL}img/${f}`;
const RECURSOS_LISTOS = RECURSOS.filter((r) => r.url);

/* ───────────────────────── Barra de progreso ───────────────────────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/* ───────────────────────── Navegación ───────────────────────── */
const NAV = [
  ['#sobre-mi', 'Sobre mí'],
  ['#aprende', 'Aprendé'],
  ...(RECURSOS_LISTOS.length ? [['#recursos', 'Recursos']] : []),
  ['#contacto', 'Contacto'],
];

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(v > 40);
    setHidden(v > 400 && v > prev && !open);
  });
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <motion.header
      className={`nav ${solid ? 'nav--solid' : ''}`}
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.a
        href="#top"
        className="nav__logo"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Celes D'Andrea
      </motion.a>
      <motion.nav
        className="nav__links"
        aria-label="Principal"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
      >
        {NAV.map(([href, label]) => (
          <motion.a
            key={href}
            href={href}
            variants={{ hidden: { opacity: 0, y: -10 }, show: { opacity: 1, y: 0 } }}
            className="nav__link"
          >
            {label}
          </motion.a>
        ))}
      </motion.nav>
      <Magnetic href="#contacto" className="pill nav__cta" data-cta="nav-dudas">
        Compartí tus dudas
      </Magnetic>
      <button
        className={`burger ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV.map(([href, label], i) => (
              <motion.a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ───────────────────────── 1. Hero: banners + propuesta ───────────────────────── */
// Cada banner: una situación del emprendedor y, directo, qué va a resolver.
const BANNERS = [
  {
    label: 'Primeros pasos',
    title: ['Vendés por redes y querés', 'tu tienda online'],
    fix: 'Armá tu tienda online sin improvisar.',
    word: 'tienda',
  },
  {
    label: 'Por dónde arrancar',
    title: ['No sabés', 'por dónde arrancar'],
    fix: 'Aprendé el orden de tus primeros pasos.',
    word: 'paso',
  },
  {
    label: 'Información',
    title: ['Tanta información que', 'no sabés qué te sirve'],
    fix: 'Quedate con lo que necesitás para tu etapa, sin tecnicismos.',
    word: 'orden',
  },
  {
    label: 'Ventas',
    title: ['Tenés seguidores', 'pero no ventas'],
    fix: 'Descubrí qué revisar primero para que te compren.',
    word: 'ventas',
  },
];
const ROTATE_MS = 6000;

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const auto = !paused && !reduce;
  const b = BANNERS[i];

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setI((n) => (n + 1) % BANNERS.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [i, auto]);

  const go = (n) => setI((n + BANNERS.length) % BANNERS.length);

  return (
    <section className="hero" id="top">
      <div
        className="banners"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Qué resolvés conmigo"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.article
            key={i}
            className={`banner banner--${i % 2 ? 'arena' : 'marfil'}`}
            aria-roledescription="placa"
            aria-label={`${i + 1} de ${BANNERS.length}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(i + 1);
              else if (info.offset.x > 60) go(i - 1);
            }}
          >
            <p className="watermark banner__word" aria-hidden>
              {b.word}
            </p>
            <div className="banner__body">
              <p className="eyebrow">{b.label}</p>
              <h2 className="banner__title">
                {b.title[0]} <span className="it">{b.title[1]}</span>
              </h2>
              <p className="banner__fix">{b.fix}</p>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="banners__nav" role="tablist" aria-label="Elegí una situación">
          {BANNERS.map((x, n) => (
            <button
              key={x.label}
              type="button"
              role="tab"
              aria-selected={n === i}
              className={`banners__tab ${n === i ? 'is-on' : ''}`}
              onClick={() => setI(n)}
            >
              <span className="banners__bar">
                {n === i && (
                  <motion.span
                    key={`${i}-${auto}`}
                    className="banners__fill"
                    initial={{ scaleX: auto ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: auto ? ROTATE_MS / 1000 : 0, ease: 'linear' }}
                  />
                )}
              </span>
              <span className="banners__label">{x.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hero__strip">
        <div>
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Llevá tu negocio al mundo online, <span className="it">paso a paso.</span>
          </motion.h1>
          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
          >
            Sin vueltas, sin perder tiempo ni plata, y con alguien que te acompaña.
          </motion.p>
        </div>
        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Magnetic href="#contacto" className="btn btn--primary-inv" data-cta="hero-dudas">
            Compartí tus dudas conmigo
          </Magnetic>
          <Magnetic href={CONTACT.instagram} target="_blank" rel="noreferrer" className="cta" data-cta="hero-instagram">
            Seguime en Instagram <Arrow />
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── 3. Qué aprendés conmigo ───────────────────────── */
export function Aprende() {
  return (
    <section className="aprende" id="aprende">
      <div className="section-head">
        <Reveal as="p" className="eyebrow">
          Qué aprendés conmigo
        </Reveal>
        <SplitTitle className="display display--dark" text="Cuatro temas, *un* *recorrido*" />
        <Reveal delay={0.2}>
          <p className="mono-p center">Cada tema tiene sus videos para que avances a tu ritmo.</p>
        </Reveal>
      </div>
      <Stagger className="aprende__grid" gap={0.1}>
        {PILARES.map((p, i) => (
          <TiltCard className="card" key={p.title}>
            <span className="card__n">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="card__title">{p.title}</h3>
            <p className="card__text">{p.text}</p>
            <a
              href={p.videos}
              target="_blank"
              rel="noreferrer"
              className="cta card__cta"
              data-cta={`pilar-${i + 1}`}
              aria-label={`Ver videos sobre ${p.title}`}
            >
              Ver videos <Arrow />
            </a>
          </TiltCard>
        ))}
      </Stagger>
    </section>
  );
}

/* ───────────────────────── 4. Recursos ───────────────────────── */
export function Recursos() {
  if (!RECURSOS_LISTOS.length) return null;
  return (
    <section className="recursos" id="recursos">
      <div className="section-head">
        <Reveal as="p" className="eyebrow">
          Recursos gratuitos
        </Reveal>
        <SplitTitle className="display display--dark" text="Para *arrancar* hoy" />
      </div>
      <Stagger className="recursos__grid" gap={0.1}>
        {RECURSOS_LISTOS.map((r, i) => (
          <TiltCard className="card card--recurso" key={r.title}>
            <p className="eyebrow card__tag">Descargable · {r.formato}</p>
            <h3 className="card__title">{r.title}</h3>
            <p className="card__text">{r.text}</p>
            <a href={r.url} target="_blank" rel="noreferrer" className="pill card__pill" data-cta={`recurso-${i + 1}`}>
              Descargar gratis <Arrow />
            </a>
          </TiltCard>
        ))}
      </Stagger>
    </section>
  );
}

/* ───────────────────────── 5a. Quién soy ───────────────────────── */
const COLLAGE = [
  { src: 'escena-circle.jpg', alt: "Celes D'Andrea en el escenario de Tiendanube Circle", pos: '40% 25%' },
  { src: 'escena-escenario.jpg', alt: "Celes D'Andrea dando una charla frente a pantallas gigantes", pos: '45% 50%' },
];

export function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section className="about" id="sobre-mi" ref={ref}>
      <motion.div className="about__visual" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <motion.div
          className="about__arch"
          variants={{
            hidden: { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
            show: { clipPath: 'inset(0% 0% 0% 0% round 24px)' },
          }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src={img('celes-retrato.jpg')}
            alt="Retrato de Celes D'Andrea con los brazos cruzados"
            loading="lazy"
            decoding="async"
            style={{ y: imgY, scale: 1.12 }}
          />
        </motion.div>
      </motion.div>

      <div className="about__text">
        <Reveal as="p" className="eyebrow">
          Quién soy
        </Reveal>
        <SplitTitle className="display display--dark about__title" text="Hola, soy *Celes*" />

        <Reveal delay={0.15}>
          <p className="mono-p">
            Como vos, me animé a emprender. Sé que los primeros pasos son los que más cuestan. Por eso quiero
            acompañarte en los tuyos.
          </p>
          <p className="mono-p">
            Soy especialista en <span className="nowrap">e-commerce</span> en Tiendanube: doy capacitaciones y soy speaker y host de{' '}
            <a className="link" href={LINKS.entrenamientoNube} target="_blank" rel="noreferrer" data-cta="about-entrenamiento">
              Entrenamiento Nube
            </a>
            , las clases en vivo y gratuitas de Tiendanube. Soy Licenciada en Relaciones Públicas
            (UADE) y trabajé en consultoría de <span className="nowrap">e-commerce</span>.
          </p>
        </Reveal>

        <Stagger className="about__collage" gap={0.12}>
          {COLLAGE.map((f) => (
            <Stagger.Item key={f.src} className="about__foto">
              <img src={img(f.src)} alt={f.alt} loading="lazy" decoding="async" style={{ objectPosition: f.pos }} />
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */
export function Footer() {
  const links = [
    ['Instagram', CONTACT.instagram],
    ['TikTok', CONTACT.tiktok],
    ['LinkedIn', CONTACT.linkedin],
    ['Email', `mailto:${CONTACT.email}`],
  ].filter(([, href]) => href);
  return (
    <footer className="footer">
      <div className="footer__top">
        <p className="footer__script">Gracias por pasar.</p>
        <nav className="footer__links" aria-label="Redes y contacto">
          {links.map(([label, href]) => (
            <a key={label} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} data-cta={`footer-${label.toLowerCase()}`}>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <motion.p
        className="footer__giant"
        initial={{ y: '40%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        Celes <span className="it">D'Andrea</span>
      </motion.p>
      <p className="footer__legal">
        © {new Date().getFullYear()} Celes D'Andrea · Buenos Aires, Argentina
      </p>
    </footer>
  );
}
