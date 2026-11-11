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

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

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
        Celes D'Andrea
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
      <Magnetic href="#contacto" className="pill nav__cta">
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
          text="Escalá tu negocio online, *paso* *a* *paso*"
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
          <Magnetic href="#contacto" className="btn btn--primary-inv">
            Empezá hoy
          </Magnetic>
          <Magnetic href="#sobre-mi" className="cta">
            Conocerme
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__photo"
        initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.img src={HERO_IMG} alt="Celes D'Andrea trabajando con su laptop" style={{ y: imgY, scale: imgScale }} />
      </motion.div>


      <motion.a
        href="#manifiesto"
        className="hero__scroll"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-label="Bajar"
      >
        <span />
      </motion.a>
    </section>
  );
}

/* ───────────────────────── Manifiesto ───────────────────────── */
export function Manifesto() {
  return (
    <section className="manifesto" id="manifiesto">
      <p className="watermark" aria-hidden>
        ventas
      </p>
      <div className="manifesto__body">
        <Reveal as="p" className="eyebrow">
          Estrategia · e-Commerce
        </Reveal>
        <SplitTitle className="display display--dark" text="Vendé más online, sin *perderte* en el camino" />
        <Reveal delay={0.3}>
          <p className="mono-p center">
            Ayudo a emprendedores y comerciantes a ordenar su tienda, entender sus números y dar el
            próximo paso con claridad. Sin fórmulas mágicas: estrategia, acompañamiento y acción.
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <a href="#contacto" className="cta">
            Empecemos hoy <Arrow />
          </a>
        </Reveal>
      </div>
    </section>
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
            {t} <em aria-hidden />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Sobre mí ───────────────────────── */
const PORTRAIT_IMG = `${import.meta.env.BASE_URL}img/celes-retrato.jpg`;

export function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section className="about" id="sobre-mi" ref={ref}>
      <motion.div
        className="about__visual"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div
          className="about__arch"
          variants={{
            hidden: { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
            show: { clipPath: 'inset(0% 0% 0% 0% round 24px)' },
          }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src={PORTRAIT_IMG}
            alt="Retrato de Celes D'Andrea con los brazos cruzados"
            loading="lazy"
            decoding="async"
            style={{ y: imgY, scale: 1.12 }}
          />
        </motion.div>
      </motion.div>

      <div className="about__text">
        <Reveal as="p" className="eyebrow eyebrow--light">
          Speaker · Host · Especialista en e-Commerce
        </Reveal>
        <SplitTitle className="display display--light about__title" text="Conocé a *Celes*" />
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
              ¿Quién <span className="it">soy?</span>
            </h3>
            <p className="mono-p mono-p--light">
              Especialista en e-Commerce en Tiendanube Argentina. Licenciada en Relaciones Públicas e
              Institucionales (UADE), especializada en comunicación y marketing digital.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <h3 className="about__h">
              ¿Qué <span className="it">hago?</span>
            </h3>
            <p className="mono-p mono-p--light">
              Creo capacitaciones, talleres y contenidos educativos. Soy speaker y host de Entrenamiento
              Nube, los webinars mensuales de Tiendanube.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.45}>
          <blockquote className="about__quote">
            “Crecer no requiere hacerlo todo a la vez: <span className="it">requiere saber cuál es el próximo paso.</span>”
          </blockquote>
        </Reveal>

        <Stagger className="about__facts" gap={0.1}>
          {[
            ['UADE', 'Lic. en RR.PP. e Institucionales'],
            ['Tiendanube', 'Especialista en e-Commerce'],
            ['Entrenamiento Nube', 'Speaker y host mensual'],
          ].map(([t, s]) => (
            <Stagger.Item key={t} className="fact">
              <strong>{t}</strong>
              <span>{s}</span>
            </Stagger.Item>
          ))}
        </Stagger>

        <Reveal delay={0.5}>
          <Magnetic href="#contacto" className="pill">
            Trabajá conmigo <Arrow />
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── En escena ───────────────────────── */
const ESCENA = [
  { src: 'escena-set.jpg', alt: "Celes D'Andrea sentada en un set de grabación, sonriendo", pos: '50% 35%' },
  { src: 'escena-panel.jpg', alt: "Celes D'Andrea hablando en un panel sobre e-commerce", pos: '50% 35%' },
  { src: 'escena-circle.jpg', alt: "Celes D'Andrea en el escenario de Tiendanube Circle", pos: '40% 25%' },
  { src: 'escena-escenario.jpg', alt: "Celes D'Andrea en un escenario con pantallas gigantes", pos: '45% 50%' },
];

export function Escena() {
  return (
    <section className="escena" id="en-escena">
      <div className="section-head">
        <Reveal as="p" className="eyebrow">
          Speaker
        </Reveal>
        <SplitTitle className="display display--dark" text="En *escena*" />
        <Reveal delay={0.2}>
          <p className="mono-p center">
            Charlas, paneles y capacitaciones para emprendedores y marcas que quieren vender más online.
          </p>
        </Reveal>
      </div>
      <Stagger className="escena__grid" gap={0.12}>
        {ESCENA.map((f) => (
          <Stagger.Item key={f.src} className="escena__foto">
            <img
              src={`${import.meta.env.BASE_URL}img/${f.src}`}
              alt={f.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: f.pos }}
            />
          </Stagger.Item>
        ))}
      </Stagger>
    </section>
  );
}

/* ───────────────────────── Franja de credenciales ───────────────────────── */
export function Credentials() {
  const items = [
    { t: 'Tiendanube', s: 'roman' },
    { t: 'UADE', s: 'italic' },
    { t: 'Entrenamiento Nube', s: 'roman' },
    { t: 'Marketing digital', s: 'italic' },
    { t: 'RR.PP.', s: 'roman' },
  ];
  return (
    <section className="creds">
      <Reveal as="p" className="creds__label eyebrow">
        Trayectoria y formación
      </Reveal>
      <Stagger className="creds__list" gap={0.1}>
        {items.map((i) => (
          <Stagger.Item key={i.t} className={`creds__item creds__item--${i.s}`}>
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
        <SplitTitle className="display display--dark" text="Formas de *crecer* juntos" />
      </div>
      <Stagger className="services__grid" gap={0.1}>
        {SERVICES.map((s) => (
          <TiltCard className="service-card" key={s.n}>
            <span className="service-card__n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <p className="eyebrow service-card__tag">{s.tag}</p>
          </TiltCard>
        ))}
        <TiltCard className="service-card service-card--cta">
          <h3>
            ¿Por dónde <span className="it">empiezo?</span>
          </h3>
          <p>Contame qué necesitás y te digo cómo te puedo ayudar.</p>
          <Magnetic href="#contacto" className="btn btn--primary-inv">
            Escribime <Arrow />
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
        nube
      </motion.div>
      <div className="nube__inner">
        <div className="nube__left">
          <Reveal as="p" className="eyebrow eyebrow--light">
            Speaker y host · Tiendanube
          </Reveal>
          <SplitTitle className="display display--light" text="Entrenamiento *Nube*" />
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
            <Magnetic href={LINKS.entrenamientoNube} target="_blank" rel="noreferrer" className="btn btn--primary-inv">
              Anotate al próximo
            </Magnetic>
            <Magnetic href={LINKS.playlist} target="_blank" rel="noreferrer" className="cta">
              Ver ediciones anteriores <Arrow />
            </Magnetic>
          </Reveal>
        </div>

        <Reveal className="nube__card" delay={0.2} x={40} y={0}>
          <div className="nube__card-top">
            <span className="live-dot" /> En vivo · una vez por mes
          </div>
          <p className="nube__card-title">
            Temas que <span className="it">vemos</span>
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
        <SplitTitle className="display display--dark" text="Paso a *paso*" />
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
        <p className="footer__script">Gracias por pasar.</p>
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
        Celes <span className="it">D'Andrea</span>
      </motion.p>
      <p className="footer__legal">© {new Date().getFullYear()} Celes D'Andrea · Buenos Aires, Argentina</p>
    </footer>
  );
}
