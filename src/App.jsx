import { ToastProvider } from './components/Toast.jsx';
import { ScrollProgress, Nav, Hero, Aprende, Recursos, About, Footer } from './components/Sections.jsx';
import Contact from './components/Contact.jsx';

// Muro de dolores (src/components/Dolores.jsx): pausado hasta tener
// moderación y mensajes reales de la comunidad.

export default function App() {
  return (
    <ToastProvider>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Aprende />
        <Recursos />
        <Contact />
      </main>
      <Footer />
    </ToastProvider>
  );
}
