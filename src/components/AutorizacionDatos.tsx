"use client";

type AutorizacionDatosProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function AutorizacionDatos({ checked, onChange }: AutorizacionDatosProps) {
  return (
    <div className="rounded-xl border border-expoia-border bg-expoia-bg p-4">
      <p className="text-sm font-medium text-expoia-navy">
        Autorización de tratamiento de datos personales *
      </p>
      <p className="mt-2 text-xs leading-relaxed text-expoia-gray-dark">
        La Fundación Escuela Tecnológica de Neiva – FET, responsable del tratamiento,
        recolectará, almacenará y usará tus datos para gestionar tu inscripción y
        participación en EXPO IA INTERNACIONAL 2026 y enviarte información del evento,
        conforme a la Ley 1581 de 2012 y al Decreto 1074 de 2015. Puedes conocer,
        actualizar y rectificar tus datos, solicitar su supresión o revocar la
        autorización cuando proceda. Para ejercer estos derechos o solicitar la política
        de tratamiento, escribe a{" "}
        <a href="mailto:expoia@fet.edu.co" className="text-expoia-cyan underline">
          expoia@fet.edu.co
        </a>
        .
      </p>
      <label className="mt-3 flex items-start gap-2 text-sm text-expoia-navy">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          required
          className="mt-0.5 h-4 w-4 rounded accent-expoia-cyan"
        />
        He leído y autorizo el tratamiento de mis datos personales.
      </label>
    </div>
  );
}
