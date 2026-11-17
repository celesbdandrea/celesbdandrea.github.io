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
| Formulario de contacto | `src/components/Contact.jsx` |
| Muro de la comunidad | `src/components/Dolores.jsx` |
| Avisos de privacidad | `src/components/Privacy.jsx` |
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

## Formularios y muro de la comunidad

Un solo Google Apps Script (`apps-script/Code.gs`) recibe los dos formularios del sitio
y los guarda en una Google Sheet tuya:

| Pestaña | Qué guarda | ¿Se publica? |
| --- | --- | --- |
| `muro` | Nombre, tienda y principal desafío | Sí: aparece en el muro al instante |
| `contactos` | Nombre, email, etapa y duda | No, nunca |

Configuración (una sola vez):

1. Creá una Google Sheet nueva y privada → Extensiones → Apps Script → pegá `apps-script/Code.gs`.
2. Implementar → Aplicación web (ejecutar como vos, acceso: cualquier persona). Copiá la URL `/exec`.
3. Pegala en `src/config.js` → `FORMS_ENDPOINT` y publicá.

Mientras `FORMS_ENDPOINT` esté vacío, el muro no aparece en el sitio publicado y el formulario
de contacto abre un correo prearmado. En `npm run dev` el muro muestra mensajes de ejemplo.

**Moderación del muro:** los mensajes se publican solos. Para ocultar uno, escribí `NO` en la
columna `aprobado`. Los que traen links o palabras de `PALABRAS_BLOQUEADAS` quedan ocultos
hasta que los apruebes con `SI`. Si cambiás el script, publicá una versión nueva de la misma
implementación para no cambiar la URL.

Cada fila guarda el consentimiento y la versión del aviso de privacidad aceptado. Si cambiás
algún texto de los avisos (`src/components/Privacy.jsx`), actualizá `AVISO_VERSION`.

**Medición:** los envíos se cuentan en la planilla. Los CTA tienen el atributo `data-cta`
para medir clics si sumás una herramienta con eventos (Cloudflare Web Analytics mide visitas, no clics).
