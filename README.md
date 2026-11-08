# Celes D'Andrea — sitio personal

Landing / portafolio hecha con **React + Vite + framer-motion**, publicada en GitHub Pages.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
```

## Qué editar

| Qué | Dónde |
| --- | --- |
| WhatsApp, email, redes | `src/config.js` → `CONTACT` |
| Links de Entrenamiento Nube | `src/config.js` → `LINKS` |
| Textos de cada sección | `src/components/Sections.jsx` |
| Colores y tipografías | `src/styles.css` (variables en `:root`) |
| Foto | `public/img/celes-hero.jpg` |

## Deploy automático

`.github/workflows/deploy.yml` compila y publica en cada push a `main`.

Una sola vez: en GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

**Dominio propio:** creá `public/CNAME` con tu dominio (ej. `celesdandrea.com`) y configurá el DNS
según la guía de GitHub Pages.

## Muro de dolores (se renueva cada 15 días)

1. Creá una Google Sheet → Extensiones → Apps Script → pegá `apps-script/Code.gs`.
2. Implementar → Aplicación web (ejecutar como vos, acceso: cualquier persona). Copiá la URL `/exec`.
3. Pegala en `src/config.js` → `DOLORES_ENDPOINT` (el formulario envía ahí).
4. En GitHub → Settings → Secrets and variables → Actions → **Variables** → `DOLORES_FEED_URL` = la misma URL.

El workflow corre automáticamente los días **1 y 16 de cada mes**: toma los 12 mensajes aprobados más
recientes, actualiza `public/data/dolores.json`, hace commit y vuelve a publicar.
También podés forzarlo desde la pestaña **Actions → Deploy a GitHub Pages → Run workflow**.

Moderación: en la hoja, poné `NO` en la columna `aprobado` para ocultar un mensaje.
Mientras `DOLORES_ENDPOINT` esté vacío, el formulario abre un correo prearmado.
