import { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

/** Aparición suave al entrar en pantalla */
export function Reveal({ children, delay = 0, y = 40, x = 0, className, as = 'div', ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Contenedor que escalona la aparición de sus hijos <Stagger.Item> */
export function Stagger({ children, className, gap = 0.12, as = 'div' }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Tag>
  );
}

export const itemVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
};

Stagger.Item = function StaggerItem({ children, className, as = 'div', ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={itemVariants} {...rest}>
      {children}
    </Tag>
  );
};

/**
 * Título que aparece palabra por palabra.
 * Las palabras entre *asteriscos* se muestran en itálica.
 */
export function SplitTitle({ text, as = 'h2', className, delay = 0, immediate = false }) {
  const Tag = motion[as];
  const words = text.split(' ');
  const anim = immediate
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } };
  return (
    <Tag
      className={className}
      {...anim}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {words.map((w, i) => {
        const italic = w.startsWith('*') && w.endsWith('*');
        const clean = w.replace(/\*/g, '');
        return (
          <span className="split-word" key={i}>
            <motion.span
              className={italic ? 'it' : undefined}
              variants={{
                hidden: { y: '110%', rotate: 4 },
                show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {clean}
            </motion.span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </Tag>
  );
}

/** Número que cuenta hacia arriba al ser visible */
export function CountUp({ to, prefix = '', suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate(v) {
        if (ref.current) ref.current.textContent = prefix + Math.round(v).toLocaleString('es-AR') + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, duration]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/** Botón / link con efecto magnético */
export function Magnetic({ children, className, strength = 0.35, as = 'a', ...rest }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const Tag = motion[as];
  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.94 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Tarjeta que se inclina siguiendo el mouse */
export function TiltCard({ children, className, ...rest }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 14 });
  const sry = useSpring(ry, { stiffness: 150, damping: 14 });
  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 12);
    ref.current.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
    ref.current.style.setProperty('--my', `${(py + 0.5) * 100}%`);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      variants={itemVariants}
      whileHover={{ y: -6 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
