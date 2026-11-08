import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sitio de usuario (celesbdandrea.github.io) o dominio propio: se sirve desde la raíz.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
