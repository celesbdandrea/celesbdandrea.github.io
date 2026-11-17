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
| Email y redes (TikTok aparece cuando completás el link) | `src/config.js` → `CONTACT` |
| Los 4 pilares y el link "Ver videos" de cada uno | `src/config.js` → `PILARES` |
| Recursos descargables (el bloque aparece cuando un recurso tiene `url`) | `src/config.js` → `RECURSOS` |
| Textos de cada sección | `src/components/Sections.jsx` |
| Formulario y aviso de privacidad | `src/components/Contact.jsx` |
| Colores y tipografías | `src/styles.css` (variables en `:root`) |
| Foto | `public/img/celes-hero.jpg` |

## Deploy automático

`.github/workflows/deploy.yml` compila y publica en cada push a `main`.

Una sola vez: en GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

**Dominio:** el sitio se publica en **https://celesdandrea.com** (`public/CNAME` + DNS apuntando a GitHub Pages).

## SEO

| Qué | Dónde |
| --- | --- |
| Título, descripción, Open Graph, datos estructurados (JSON-LD) | `index.html` |
| Imagen al compartir el link (1200×630) | `public/og-celes.jpg` |
| Sitemap y robots | `public/sitemap.xml`, `public/robots.txt` |

Si cambiás el dominio, reemplazá `celesdandrea.com` en esos archivos y en `public/CNAME`.
Si cambiás LinkedIn o Instagram en `src/config.js`, actualizalos también en `sameAs` de `index.html`.
Sitemap enviado en Google Search Console como `sitemap.xml`.

## Formulario de contacto

Los envíos se guardan en una Google Sheet tuya (sin servicios de terceros):

1. Creá una Google Sheet nueva y privada → Extensiones → Apps Script → pegá `apps-script/Contacto.gs`.
2. Implementar → Aplicación web (ejecutar como vos, acceso: cualquier persona). Copiá la URL `/exec`.
3. Pegala en `src/config.js` → `CONTACT_ENDPOINT` y publicá.

Mientras `CONTACT_ENDPOINT` esté vacío, el formulario abre un correo prearmado con los datos.
Cada fila guarda el consentimiento y la versión del aviso de privacidad aceptado.
Si cambiás el texto del aviso, actualizá `AVISO_VERSION` en `Contact.jsx`.

**Medición:** los envíos se cuentan en la planilla. Los CTA tienen el atributo `data-cta`
para medir clics si sumás una herramienta con eventos (Cloudflare Web Analytics mide visitas, no clics).

## Muro de dolores (pausado)

Fuera de la landing hasta tener moderación y mensajes reales. El componente sigue en
`src/components/Dolores.jsx` y la tarea programada está comentada en `.github/workflows/deploy.yml`.
Para retomarlo: sumá `<Dolores />` en `src/App.jsx`, descomentá el `schedule` y seguí estos pasos.

1. Creá una Google Sheet → Extensiones → Apps Script → pegá `apps-script/Code.gs`.
2. Implementar → Aplicación web (ejecutar como vos, acceso: cualquier persona). Copiá la URL `/exec`.
3. Pegala en `src/config.js` → `DOLORES_ENDPOINT` (el formulario envía ahí).
4. En GitHub → Settings → Secrets and variables → Actions → **Variables** → `DOLORES_FEED_URL` = la misma URL.

El workflow corre automáticamente los días **1 y 16 de cada mes**: toma los 12 mensajes aprobados más
recientes, actualiza `public/data/dolores.json`, hace commit y vuelve a publicar.
También podés forzarlo desde la pestaña **Actions → Deploy a GitHub Pages → Run workflow**.

Moderación: en la hoja, poné `NO` en la columna `aprobado` para ocultar un mensaje.
Mientras `DOLORES_ENDPOINT` esté vacío, el formulario abre un correo prearmado.
