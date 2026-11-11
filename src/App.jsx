import { ToastProvider } from './components/Toast.jsx';
import {
  ScrollProgress,
  Nav,
  Hero,
  Manifesto,
  Marquee,
  About,
  Escena,
  Credentials,
  Services,
  Entrenamiento,
  Process,
  Footer,
} from './components/Sections.jsx';
import Dolores from './components/Dolores.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <ToastProvider>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Marquee items={['e-Commerce', 'Tiendanube', 'Estrategia', 'Ventas online', 'Marketing digital', 'Paso a paso']} />
        <About />
        <Escena />
        <Credentials />
        <Services />
        <Entrenamiento />
        <Process />
        <Marquee
          reverse
          variant="marquee--bordo"
          items={['Tu próximo paso', 'Vender más', 'Crecer con claridad', 'Escalar', 'Comunidad']}
        />
        <Dolores />
        <Contact />
      </main>
      <Footer />
    </ToastProvider>
  );
}
