// ─────────────────────────────────────────────────────────────
//  Configuración editable del sitio
// ─────────────────────────────────────────────────────────────

export const CONTACT = {
  email: 'celesteb.dandrea@gmail.com',
  instagram: 'https://www.instagram.com/celesbdandrea/',
  linkedin: 'https://www.linkedin.com/in/celestedandrea/',
  // Cuando tengas cuenta, pegá el link completo (https://www.tiktok.com/@usuario).
  // Mientras quede vacío, TikTok no aparece en el sitio.
  tiktok: '',
};

export const LINKS = {
  entrenamientoNube: 'https://www.tiendanube.com/eventos/entrenamiento-nube',
};

// ─── Qué aprendés conmigo ───
// `videos`: adónde lleva "Ver videos" de cada pilar. Por ahora, al perfil de
// Instagram; reemplazalo por el destacado o la playlist de cada tema.
export const PILARES = [
  {
    title: 'Primeros pasos para vender online',
    text: 'Dónde vender, medios de pago, envíos y qué tener listo antes de abrir.',
    videos: CONTACT.instagram,
  },
  {
    title: 'Herramientas y automatización simple',
    text: 'Las tareas que podés dejar de hacer a mano desde la primera venta.',
    videos: CONTACT.instagram,
  },
  {
    title: 'Atraer clientes y vender',
    text: 'Redes, tráfico, por qué entran y no compran, y qué pasa después de la venta.',
    videos: CONTACT.instagram,
  },
  {
    title: 'Marcas que venden',
    text: 'Lo que hacen marcas argentinas que funcionan, traducido a tu escala.',
    videos: CONTACT.instagram,
  },
];

// ─── Recursos descargables ───
// Un recurso aparece recién cuando tiene `url`. Si ninguno tiene, el bloque
// "Recursos" y su link en la navegación no se muestran.
export const RECURSOS = [
  {
    title: 'Checklist antes de abrir tu tienda online',
    text: 'Lo que tenés que tener listo antes de publicar el primer producto.',
    formato: 'PDF',
    url: '',
  },
  {
    title: 'Plantilla de costos y precios',
    text: 'Calculá cuánto te cuesta cada producto y a cuánto venderlo.',
    formato: 'Google Sheets',
    url: '',
  },
  {
    title: 'Guía de primeros pasos para vender online',
    text: 'El recorrido completo para empezar a vender online.',
    formato: 'PDF',
    url: '',
  },
];

// URL del Web App de Google Apps Script (apps-script/Code.gs). Recibe el
// formulario de contacto y el muro, y devuelve los mensajes del muro.
// Mientras quede vacía: el contacto abre un correo prearmado y el muro no
// muestra mensajes.
export const FORMS_ENDPOINT = '';
