import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import { Reveal, Stagger, SplitTitle, CountUp, Magnetic, TiltCard } from './motion.jsx';
import { LINKS, CONTACT } from '../config.js';

const HERO_IMG = `${import.meta.env.BASE_URL}img/celes-hero.jpg`;

/* ───────────────────────── Barra de progreso ───────────────────────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/* ───────────────────────── Navegación ───────────────────────── */
const NAV = [
  ['#sobre-mi', 'Sobre mí'],
  ['#que-hago', 'Qué hago'],
  ['#entrenamiento-nube', 'Entrenamiento Nube'],
  ['#muro', 'Muro'],
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
        CELES <span className="it">D'ANDREA</span>
      </motion.a>
      <motion.nav
        className="nav__links"
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
      <Magnetic href="#contacto" className="btn btn--pill nav__cta">
        Agendá una charla
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

/* ───────────────────────── Hero ───────────────────────── */
export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero__grain" />
      <motion.div className="hero__text" style={{ y: textY, opacity: fade }}>
        <motion.p
          className="eyebrow eyebrow--light"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Especialista en e-Commerce · Tiendanube Argentina
        </motion.p>
        <SplitTitle
          as="h1"
          immediate
          delay={0.35}
          className="hero__title"
          text="ESCALÁ *tu* NEGOCIO ONLINE, *paso* *a* *paso*"
        />
        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Soy Celes D'Andrea. Acompaño a emprendedores y comerciantes a vender más, con estrategia,
          claridad y un plan que se pueda sostener.
        </motion.p>
        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <Magnetic href="#contacto" className="btn btn--pill btn--cream">
            Empezá hoy
          </Magnetic>
          <Magnetic href="#sobre-mi" className="btn btn--ghost">
            Conocerme ↓
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__photo"
        initial={{ clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)' }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.img src={HERO_IMG} alt="Celes D'Andrea trabajando con su laptop" style={{ y: imgY, scale: imgScale }} />
      </motion.div>

      <motion.div
        className="hero__badge"
        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 120 }}
      >
        <RotatingBadge text="ENTRENAMIENTO NUBE • SPEAKER • HOST • " />
      </motion.div>

      <motion.a
        href="#manifiesto"
        className="hero__scroll"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-label="Bajar"
      >
        scroll
        <span />
      </motion.a>
    </section>
  );
}

function RotatingBadge({ text }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="rot-badge"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
    >
      <defs>
        <path id="circlePath" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
      </defs>
      <circle cx="100" cy="100" r="98" className="rot-badge__bg" />
      <text className="rot-badge__text">
        <textPath href="#circlePath">{text}</textPath>
      </text>
      <circle cx="100" cy="100" r="34" className="rot-badge__hole" />
      <circle cx="100" cy="100" r="6" className="rot-badge__dot" />
    </motion.svg>
  );
}

/* ───────────────────────── Manifiesto ───────────────────────── */
export function Manifesto() {
  return (
    <section className="manifesto" id="manifiesto">
      <motion.div
        className="manifesto__icon"
        initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
        whileInView={{ opacity: 1, rotate: -8, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 90, damping: 12 }}
        whileHover={{ rotate: 8, scale: 1.08 }}
      >
        <CartIcon />
      </motion.div>
      <div className="manifesto__body">
        <SplitTitle
          className="display display--dark"
          text="VENDÉ MÁS *online* — SIN *perderte* EN EL CAMINO"
        />
        <Reveal delay={0.3}>
          <p className="mono-p center">
            Ayudo a emprendedores y comerciantes a ordenar su tienda, entender sus números y dar el
            próximo paso con claridad. Sin fórmulas mágicas: estrategia, acompañamiento y acción.
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <a href="#contacto" className="script-link">
            Empecemos hoy
            <motion.svg viewBox="0 0 120 20" className="script-underline">
              <motion.path
                d="M2 14 C 30 4, 60 20, 118 6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.8 }}
              />
            </motion.svg>
          </a>
        </Reveal>
      </div>
      <div className="manifesto__vinyl">
        <RotatingBadge text="TIENDANUBE • E-COMMERCE • CRECER • " />
      </div>
    </section>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10h8l7 30h30l6-20H18" />
      <circle cx="26" cy="50" r="4" />
      <circle cx="46" cy="50" r="4" />
      <path d="M30 26l5 5 9-9" />
    </svg>
  );
}

/* ───────────────────────── Marquesina ───────────────────────── */
export function Marquee({ items, reverse = false, variant = '' }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee ${variant}`}>
      <motion.div
        className="marquee__track"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
      >
        {row.map((t, i) => (
          <span key={i} className={i % 2 ? 'it' : ''}>
            {t} <em>✦</em>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Sobre mí ───────────────────────── */
const SPEAKER_IMG = `${import.meta.env.BASE_URL}img/celes-speaker.jpg`;

function Sparkle({ className, delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={`sparkle ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: [0, 1, 0.5, 1], scale: [0, 1.2, 0.9, 1], rotate: [0, 90] }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, delay }}
    >
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </motion.svg>
  );
}

export function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const wordX = useTransform(scrollYProgress, [0, 1], ['6%', '-10%']);

  return (
    <section className="about" id="sobre-mi" ref={ref}>
      <motion.p className="about__ghost" style={{ x: wordX }} aria-hidden>
        PORTFOLIO <span className="it">E-COMMERCE</span>
      </motion.p>

      <div className="about__visual">
        <motion.div
          className="about__outline"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="about__arch"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src={SPEAKER_IMG}
            alt="Celes D'Andrea en escena, dando una charla"
            loading="lazy"
            decoding="async"
            style={{ y: imgY, scale: 1.12 }}
          />
          <div className="about__arch-shade" />
        </motion.div>

        <Sparkle className="sparkle--a" delay={1} />
        <Sparkle className="sparkle--b" delay={1.2} />
        <Sparkle className="sparkle--c" delay={1.4} />
      </div>

      <div className="about__text">
        <Reveal as="p" className="eyebrow eyebrow--light">
          Speaker · Host · Especialista en e-Commerce
        </Reveal>
        <SplitTitle className="display display--light about__title" text="CONOCÉ *A* CELES" />
        <motion.span
          className="about__rule"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="about__cols">
          <Reveal delay={0.2}>
            <h3 className="about__h">
              ¿QUIÉN <span className="it">SOY?</span>
            </h3>
            <p className="mono-p mono-p--light">
              Especialista en e-Commerce en Tiendanube Argentina. Licenciada en Relaciones Públicas e
              Institucionales (UADE), especializada en comunicación y marketing digital.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <h3 className="about__h">
              ¿QUÉ <span className="it">HAGO?</span>
            </h3>
            <p className="mono-p mono-p--light">
              Creo capacitaciones, talleres y contenidos educativos. Soy speaker y host de Entrenamiento
              Nube, los webinars mensuales de Tiendanube.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.45}>
          <blockquote className="about__quote">
            “CRECER NO REQUIERE HACERLO TODO A LA VEZ — <span className="it">REQUIERE SABER CUÁL ES EL PRÓXIMO PASO.</span>”
          </blockquote>
        </Reveal>

        <Stagger className="about__facts" gap={0.1}>
          {[
            ['UADE', 'Lic. en RR.PP. e Institucionales'],
            ['TIENDANUBE', 'Especialista en e-Commerce'],
            ['ENTRENAMIENTO NUBE', 'Speaker & host mensual'],
          ].map(([t, s]) => (
            <Stagger.Item key={t} className="fact">
              <strong>{t}</strong>
              <span>{s}</span>
            </Stagger.Item>
          ))}
        </Stagger>

        <Reveal delay={0.5}>
          <Magnetic href="#contacto" className="btn btn--pill btn--outline">
            Trabajá conmigo ✦
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Franja de credenciales ───────────────────────── */
export function Credentials() {
  const items = [
    { t: 'Tiendanube', s: 'serif' },
    { t: 'UADE', s: 'caps' },
    { t: 'Entrenamiento Nube', s: 'italic' },
    { t: 'Marketing Digital', s: 'caps' },
    { t: 'RR.PP.', s: 'serif' },
  ];
  return (
    <section className="creds">
      <Reveal as="p" className="creds__label">
        Trayectoria &amp; formación
      </Reveal>
      <Stagger className="creds__list" gap={0.1}>
        {items.map((i) => (
          <Stagger.Item key={i.t} className={`creds__item creds__item--${i.s}`} whileHover={{ scale: 1.08, color: '#7d1d1d' }}>
            {i.t}
          </Stagger.Item>
        ))}
      </Stagger>
    </section>
  );
}

/* ───────────────────────── Qué hago ───────────────────────── */
const SERVICES = [
  {
    n: '01',
    title: 'Capacitaciones',
    text: 'Webinars y clases en vivo para que aprendas a vender online con herramientas concretas.',
    tag: 'Grupal',
  },
  {
    n: '02',
    title: 'Talleres',
    text: 'Espacios prácticos para trabajar sobre tu propia tienda: catálogo, comunicación, redes y ventas.',
    tag: 'Práctico',
  },
  {
    n: '03',
    title: 'Contenidos educativos',
    text: 'Guías, materiales y piezas pensadas para emprendedores que están dando sus primeros pasos o buscan escalar.',
    tag: 'Formación',
  },
  {
    n: '04',
    title: 'Asesoría 1:1',
    text: '¿No sabés cuál es tu próximo paso? Lo vemos juntas/os y armamos un plan a tu medida.',
    tag: 'Personalizado',
  },
  {
    n: '05',
    title: 'Auditoría de negocio',
    text: 'Revisamos tu tienda de punta a punta y detectamos qué frena tus ventas y qué podés mejorar ya.',
    tag: 'Diagnóstico',
  },
];

export function Services() {
  return (
    <section className="services" id="que-hago">
      <div className="section-head">
        <Reveal as="p" className="eyebrow">
          Qué hago
        </Reveal>
        <SplitTitle className="display display--dark" text="FORMAS *de* CRECER *juntos*" />
      </div>
      <Stagger className="services__grid" gap={0.1}>
        {SERVICES.map((s) => (
          <TiltCard className="service-card" key={s.n}>
            <div className="service-card__glow" />
            <span className="service-card__n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <span className="chip">{s.tag}</span>
          </TiltCard>
        ))}
        <TiltCard className="service-card service-card--cta">
          <h3>
            ¿POR DÓNDE <span className="it">EMPIEZO?</span>
          </h3>
          <p>Contame qué necesitás y te digo cómo te puedo ayudar.</p>
          <Magnetic href="#contacto" className="btn btn--pill btn--cream">
            Escribime →
          </Magnetic>
        </TiltCard>
      </Stagger>
    </section>
  );
}

/* ───────────────────────── Entrenamiento Nube ───────────────────────── */
const TOPICS = [
  'Primeros pasos y configuración de tu tienda',
  'Diseño, plantillas y catálogo',
  'Finanzas para emprendedores',
  'Email marketing',
  'Redes sociales y Meta Ads',
  'Hot Sale y CyberMonday',
];

export function Entrenamiento() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const [active, setActive] = useState(0);

  return (
    <section className="nube" id="entrenamiento-nube" ref={ref}>
      <motion.div className="nube__bg" style={{ y: bgY }} aria-hidden>
        NUBE
      </motion.div>
      <div className="nube__inner">
        <div className="nube__left">
          <Reveal as="p" className="eyebrow eyebrow--light">
            Speaker &amp; host · Tiendanube
          </Reveal>
          <SplitTitle className="display display--light" text="ENTRENAMIENTO *Nube*" />
          <Reveal delay={0.2}>
            <p className="mono-p mono-p--light">
              Todos los meses hosteo y doy charlas en Entrenamiento Nube: una capacitación online, en
              vivo y 100% gratuita del equipo de Tiendanube para que tu tienda venda más.
            </p>
          </Reveal>
          <div className="nube__stats">
            {[
              [30, '+', 'ediciones'],
              [74500, '+', 'personas registradas'],
              [22660, '+', 'asistentes en vivo'],
            ].map(([n, p, l], i) => (
              <Reveal key={l} delay={0.2 + i * 0.12} className="stat">
                <strong>
                  <CountUp to={n} prefix={p} />
                </strong>
                <span>{l}</span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4} className="nube__ctas">
            <Magnetic href={LINKS.entrenamientoNube} target="_blank" rel="noreferrer" className="btn btn--pill btn--cream">
              Anotate al próximo →
            </Magnetic>
            <Magnetic href={LINKS.playlist} target="_blank" rel="noreferrer" className="btn btn--ghost">
              ▶ Ver ediciones anteriores
            </Magnetic>
          </Reveal>
        </div>

        <Reveal className="nube__card" delay={0.2} x={40} y={0}>
          <div className="nube__card-top">
            <span className="live-dot" /> En vivo · una vez por mes
          </div>
          <p className="nube__card-title">
            TEMAS QUE <span className="it">VEMOS</span>
          </p>
          <ul className="topics">
            {TOPICS.map((t, i) => (
              <motion.li
                key={t}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                className={active === i ? 'is-active' : ''}
              >
                {active === i && <motion.span layoutId="topic-pill" className="topics__pill" />}
                <span className="topics__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="topics__t">{t}</span>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Proceso paso a paso ───────────────────────── */
const STEPS = [
  ['Diagnóstico', 'Me contás dónde estás, qué vendés y qué te frena.'],
  ['Prioridades', 'Ordenamos qué hacer primero para que el esfuerzo rinda.'],
  ['Plan de acción', 'Bajamos todo a pasos concretos y medibles.'],
  ['Acompañamiento', 'Ajustamos sobre la marcha y celebramos cada avance.'],
];

export function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  return (
    <section className="process" ref={ref}>
      <div className="section-head">
        <Reveal as="p" className="eyebrow">
          Cómo trabajamos
        </Reveal>
        <SplitTitle className="display display--dark" text="PASO *a* PASO" />
      </div>
      <div className="process__list">
        <div className="process__rail">
          <motion.div className="process__rail-fill" style={{ scaleY: line }} />
        </div>
        {STEPS.map(([t, d], i) => (
          <Reveal key={t} className="step" x={i % 2 ? 40 : -40} y={0} delay={0.05}>
            <motion.span
              className="step__dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-40% 0px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            >
              {i + 1}
            </motion.span>
            <div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <p className="footer__script">gracias por pasar ♡</p>
        <nav className="footer__links">
          <a href={`mailto:${CONTACT.email}`}>Email</a>
          <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={LINKS.entrenamientoNube} target="_blank" rel="noreferrer">
            Entrenamiento Nube
          </a>
        </nav>
      </div>
      <motion.p
        className="footer__giant"
        initial={{ y: '40%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        CELES <span className="it">D'ANDREA</span>
      </motion.p>
      <p className="footer__legal">© {new Date().getFullYear()} Celes D'Andrea · Hecho con cariño en Buenos Aires</p>
    </footer>
  );
}
