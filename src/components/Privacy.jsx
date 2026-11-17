import { CONTACT } from '../config.js';

// Versión de los avisos: se guarda con cada envío para saber qué texto aceptó cada persona.
// Si cambiás algún texto de acá, actualizá la fecha.
export const AVISO_VERSION = '2026-11-17';

const AVISOS = {
  contacto: {
    datos:
      'Tu nombre, tu email, la etapa de tu negocio y tu duda. Los uso solo para responderte y, si lo pedís, para coordinar una asesoría. No los vendo, no los cedo a terceros y no los uso para enviarte publicidad.',
    tiempo: 'Hasta 12 meses después de nuestra última conversación. Después los borro.',
    obligatorio: 'Sí, para poder responderte. Si no los completás, no puedo recibir tu consulta.',
  },
  muro: {
    datos:
      'Tu nombre, el nombre de tu tienda y tu desafío. Se publican en este muro, a la vista de cualquier persona que visite el sitio, y los uso para elegir los temas de mis contenidos. No te pido email ni otros datos de contacto.',
    tiempo: 'Mientras el mensaje esté publicado. Podés pedirme que lo borre cuando quieras.',
    obligatorio: 'Sí, para publicar tu mensaje. Si preferís no mostrar tu nombre real, podés usar solo tu nombre de pila.',
  },
};

/** Aviso de privacidad (Ley 25.326 de Protección de los Datos Personales). */
export function AvisoPrivacidad({ tipo = 'contacto' }) {
  const a = AVISOS[tipo];
  return (
    <div className="privacy__body">
      <p>
        <strong>Responsable.</strong> Celeste D'Andrea, Buenos Aires, Argentina. Contacto:{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </p>
      <p>
        <strong>Qué datos y para qué.</strong> {a.datos}
      </p>
      <p>
        <strong>Dónde se guardan.</strong> En una planilla privada de Google a la que solo accedo yo.
        Google LLC presta el servicio de almacenamiento.
      </p>
      <p>
        <strong>Cuánto tiempo.</strong> {a.tiempo}
      </p>
      <p>
        <strong>Si son obligatorios.</strong> {a.obligatorio}
      </p>
      <p>
        <strong>Tus derechos.</strong> Podés pedirme acceso a tus datos, que los corrija o que los
        borre, escribiendo a {CONTACT.email}. Como titular de los datos, podés ejercer el derecho de
        acceso en forma gratuita a intervalos no inferiores a seis meses, salvo que acredites un interés
        legítimo (art. 14, inc. 3, Ley 25.326).
      </p>
      <p>
        La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N.º
        25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten
        afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de
        datos personales.
      </p>
      <p className="privacy__ver">Versión del {AVISO_VERSION.split('-').reverse().join('/')}.</p>
    </div>
  );
}
