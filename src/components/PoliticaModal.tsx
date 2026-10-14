"use client";

import { useEffect } from "react";

interface PoliticaModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

const secciones = [
  ["1. Responsable y alcance", "La Fundación Escuela Tecnológica de Neiva Jesús Oviedo Pérez (FET), NIT 900.440.771-2, con domicilio en Calle 14 n.º 5-89, Neiva (Huila), es responsable del tratamiento. Esta política aplica a los datos tratados por la FET, directamente o por medio de encargados, en sus actividades académicas, administrativas, laborales, contractuales, de investigación, eventos y proyectos."],
  ["2. Marco normativo", "El tratamiento se realiza conforme a la Constitución Política, la Ley 1581 de 2012, el Decreto 1377 de 2013, el Decreto 1074 de 2015, la Ley 1266 de 2008 cuando resulte aplicable, y las instrucciones de la Superintendencia de Industria y Comercio."],
  ["3. Principios", "La FET aplica los principios de legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad, además de los principios de necesidad, proporcionalidad, responsabilidad demostrada y temporalidad."],
  ["4. Finalidades", "Los datos se tratan para prestar servicios educativos y administrativos; gestionar matrículas, eventos, proyectos y convenios; atender solicitudes y PQRSF; cumplir obligaciones legales y contractuales; realizar investigación, encuestas y estadísticas agregadas; gestionar seguridad, comunicaciones institucionales y relacionamiento. Cada recolección debe informar sus finalidades específicas."],
  ["5. Autorización y prueba", "La FET solicita autorización previa, expresa e informada cuando la ley lo exige, conserva la prueba y no condiciona una actividad a entregar datos que no sean necesarios. La autorización puede ser escrita, oral o mediante conductas inequívocas; en formularios digitales se registra la fecha, hora y versión del aviso aceptado."],
  ["6. Tratamiento y circulación", "La FET recolecta, almacena, usa, consulta, actualiza, rectifica, organiza y suprime datos según la finalidad autorizada. Los encargados solo pueden tratarlos siguiendo instrucciones documentadas y las transferencias a terceros requieren autorización específica cuando corresponda."],
  ["7. Datos sensibles y menores", "La respuesta sobre datos sensibles es facultativa. Solo se tratan cuando existe autorización explícita o una excepción legal, con medidas reforzadas. Los datos de niños, niñas y adolescentes solo se tratan atendiendo su interés superior, sus derechos fundamentales y la autorización de su representante, escuchando al menor según su madurez."],
  ["8. Aviso de privacidad", "Cuando la política no pueda ponerse a disposición al momento de la recolección, la FET usa un aviso que identifica al responsable, las finalidades, los derechos, los mecanismos para consultar la política y el carácter facultativo de los datos sensibles. Los resultados de encuestas se publican únicamente de forma agregada."],
  ["9. Derechos de los titulares", "El titular puede conocer, actualizar y rectificar sus datos; solicitar prueba de la autorización; conocer el uso dado; presentar quejas ante la SIC después de agotar el trámite ante la FET; revocar la autorización o solicitar la supresión cuando proceda; y acceder gratuitamente a sus datos. También pueden ejercerlos causahabientes, representantes y apoderados acreditados."],
  ["10. Deberes de la FET", "La FET garantiza el hábeas data, informa las finalidades, conserva la autorización, protege la información contra adulteración, pérdida, consulta o acceso no autorizado, mantiene la calidad de los datos, tramita consultas y reclamos, exige seguridad a los encargados, adopta procedimientos internos y atiende los requerimientos de la SIC."],
  ["11. Consultas y reclamos", "El Oficial de Protección de Datos Personales atiende solicitudes con apoyo del sistema PQRSF. Canales: correo institucional dedicado, https://www.fet.edu.co/PQRSF, atención presencial o correspondencia en Calle 14 n.º 5-89, Neiva (Huila), y teléfonos 322 304 1567 y 608 867 4935. Las consultas se atienden en hasta 10 días hábiles y los reclamos en hasta 15 días hábiles, con las prórrogas legales."],
  ["12. Proyectos, eventos y alianzas", "Antes de recolectar datos, los convenios definen responsables, encargados, datos, finalidades, conservación y canal de atención. Cada evento tiene un aviso propio. Los datos solo se comparten con terceros con autorización específica, entregando los datos estrictamente necesarios."],
  ["13. Encuestas, investigación e inteligencia artificial", "Las encuestas aplican minimización, separan identificadores de respuestas, solicitan autorizaciones separadas y publican resultados agregados. En sistemas de inteligencia artificial la FET verifica idoneidad, necesidad, proporcionalidad y riesgos; prefiere datos anonimizados, no introduce datos personales en herramientas de terceros sin autorización y garantiza información y derechos."],
  ["14. Transferencias y transmisiones", "Las transmisiones a encargados se documentan mediante contrato o términos de servicio con deberes de confidencialidad, seguridad y uso limitado. Las transferencias internacionales solo se realizan a países adecuados o bajo una excepción legal y autorización expresa cuando corresponda. La entrega a autoridades se limita a lo solicitado."],
  ["15. Seguridad e incidentes", "Se aplican controles de acceso por rol, usuarios personales, contraseñas, confidencialidad, copias de respaldo, borrado seguro, control físico y capacitación. Los incidentes se reportan de inmediato, se registran, contienen, evalúan y notifican a la SIC y a los titulares cuando pueda afectarlos."],
  ["16. Conservación y supresión", "Los datos se conservan mientras subsistan las finalidades y durante los plazos legales o contractuales. Los datos de encuestas, eventos y proyectos se conservan por el plazo de su aviso; después se anonimizan o suprimen. La información académica, laboral, contractual, contable y tributaria sigue sus tablas y normas aplicables."],
  ["17. Gobierno y responsabilidad demostrada", "El Oficial coordina la política, inventario de bases, avisos, autorizaciones, consultas, reclamos, incidentes, capacitaciones y reportes. Cada dependencia responde por sus bases. La FET documenta inventarios, contratos, capacitaciones, incidentes y auditorías para demostrar cumplimiento."],
  ["18. Vigencia y cambios", "La política rige desde el acuerdo que la adopta y se publica en www.fet.edu.co. Los cambios sustanciales se comunican antes de implementarse. Para este cuestionario, los datos identificables se conservarán por 12 meses desde el evento y luego se anonimizarán; los anonimizados podrán conservarse con fines estadísticos."],
];

export default function PoliticaModal({ abierto, onCerrar }: PoliticaModalProps) {
  useEffect(() => {
    if (!abierto) return;
    const cerrar = (event: KeyboardEvent) => event.key === "Escape" && onCerrar();
    window.addEventListener("keydown", cerrar);
    return () => window.removeEventListener("keydown", cerrar);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-expoia-navy/70 p-4" role="dialog" aria-modal="true" aria-labelledby="politica-titulo" onClick={(event) => event.target === event.currentTarget && onCerrar()}>
      <article className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 text-expoia-navy shadow-2xl sm:p-9">
        <div className="flex items-start justify-between gap-4 border-b border-expoia-border pb-5">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-expoia-cyan">INFORMACIÓN LEGAL</p>
            <h2 id="politica-titulo" className="mt-2 font-display text-2xl font-semibold">Política de Tratamiento y Protección de Datos Personales</h2>
            <p className="mt-2 text-sm text-expoia-gray-dark">Fundación Escuela Tecnológica de Neiva Jesús Oviedo Pérez - FET</p>
          </div>
          <button type="button" aria-label="Cerrar política" onClick={onCerrar} className="rounded-full border border-expoia-border px-3 py-1 text-xl text-expoia-gray-dark hover:border-expoia-navy">×</button>
        </div>
        <div className="mt-6 space-y-5 text-sm leading-7 text-expoia-gray-dark">
          {secciones.map(([titulo, texto]) => <section key={titulo}><h3 className="font-display text-base font-semibold text-expoia-navy">{titulo}</h3><p className="mt-1">{texto}</p></section>)}
        </div>
        <div className="mt-7 flex justify-end border-t border-expoia-border pt-5">
          <button type="button" onClick={onCerrar} className="rounded-full bg-expoia-magenta px-7 py-3 font-display text-sm font-semibold text-white hover:bg-expoia-navy">Entendido</button>
        </div>
      </article>
    </div>
  );
}
