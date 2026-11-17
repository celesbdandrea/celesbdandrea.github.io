import { ToastProvider } from './components/Toast.jsx';
import { ScrollProgress, Nav, Hero, Aprende, Recursos, About, Footer } from './components/Sections.jsx';
import Dolores from './components/Dolores.jsx';
import Contact from './components/Contact.jsx';

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
        <Dolores />
        <Contact />
      </main>
      <Footer />
    </ToastProvider>
  );
}
