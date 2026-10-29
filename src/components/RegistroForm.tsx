"use client";

import { useState, FormEvent } from "react";
import AutorizacionDatos from "@/components/AutorizacionDatos";
import { ResultadoTest } from "@/lib/testData";

const TIPOS_VINCULACION = [
  "Estudiante",
  "Empresario/a",
  "Profesional",
  "Emprendedor/a",
  "Docente o investigador/a",
  "Representante institucional o del sector público",
  "Otro",
];

const EXPECTATIVAS_OPCIONES = [
  "Aprender sobre inteligencia artificial aplicada a los negocios",
  "Conocer herramientas y soluciones de IA",
  "Hacer contactos profesionales y empresariales",
  "Encontrar proveedores, aliados u oportunidades de negocio",
  "Descubrir ideas para mejorar mi empresa o emprendimiento",
  "Otro",
];

type Estado = "idle" | "enviando" | "exito" | "error";

interface RegistroFormProps {
  resultadoTest?: ResultadoTest | null;
}

export default function RegistroForm({ resultadoTest }: RegistroFormProps) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [tipoVinculacion, setTipoVinculacion] = useState("");
  const [tipoVinculacionOtro, setTipoVinculacionOtro] = useState("");
  const [expectativas, setExpectativas] = useState<string[]>([]);
  const [expectativasOtro, setExpectativasOtro] = useState("");
  const [ruedaNegocios, setRuedaNegocios] = useState("");
  const [autorizaDatos, setAutorizaDatos] = useState(false);

  function alternarExpectativa(opcion: string) {
    setExpectativas((actuales) =>
      actuales.includes(opcion)
        ? actuales.filter((actual) => actual !== opcion)
        : [...actuales, opcion]
    );
  }

  async function manejarEnvio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setErrorMsg("");

    const form = e.currentTarget;
    const valor = (nombre: string) =>
      (form.elements.namedItem(nombre) as HTMLInputElement | null)?.value.trim() ?? "";
    const datos = {
      correo: valor("correo"),
      nombre: valor("nombre"),
      telefono: valor("telefono"),
      tipoVinculacion,
      tipoVinculacionOtro:
        tipoVinculacion === "Otro" ? tipoVinculacionOtro.trim() : "",
      ciudad: valor("ciudad"),
      institucion: valor("institucion"),
      programaOSector: valor("programaOSector"),
      expectativas,
      expectativasOtro: expectativas.includes("Otro") ? expectativasOtro.trim() : "",
      ruedaNegocios,
      resultadoPorcentaje: resultadoTest?.porcentaje ?? null,
      resultadoEtiqueta: resultadoTest?.etiqueta ?? null,
      autorizaDatos,
    };

    if (
      !datos.correo ||
      !datos.nombre ||
      !datos.telefono ||
      !datos.tipoVinculacion ||
      (datos.tipoVinculacion === "Otro" && !datos.tipoVinculacionOtro) ||
      !datos.ciudad ||
      !datos.ruedaNegocios ||
      !datos.autorizaDatos
    ) {
      setEstado("error");
      setErrorMsg("Faltan campos obligatorios (marcados con *).");
      return;
    }

    try {
      const respuesta = await fetch("/api/registro-completo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) throw new Error("No se pudo guardar el registro");

      setEstado("exito");
      form.reset();
      setTipoVinculacion("");
      setTipoVinculacionOtro("");
      setExpectativas([]);
      setExpectativasOtro("");
      setRuedaNegocios("");
      setAutorizaDatos(false);
    } catch {
      setEstado("error");
      setErrorMsg(
        "No pudimos guardar tu registro. Verifica tu conexión e inténtalo de nuevo."
      );
    }
  }

  if (estado === "exito") {
    return (
      <div className="rounded-2xl border border-expoia-border bg-white p-10 text-center">
        <p className="font-display text-2xl font-semibold text-expoia-navy">
          Registro recibido
        </p>
        <p className="mt-3 text-expoia-gray-dark">
          Ya tenemos tu información. Te contactaremos con los próximos pasos
          para EXPOIA 2026.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={manejarEnvio} className="grid gap-6" noValidate>
      <div>
        <label htmlFor="correo" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Correo *
        </label>
        <input id="correo" name="correo" type="email" required className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan" />
      </div>

      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Nombre completo *
        </label>
        <input id="nombre" name="nombre" type="text" required minLength={3} className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan" />
      </div>

      <div>
        <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Número de contacto o WhatsApp *
        </label>
        <input id="telefono" name="telefono" type="tel" required className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan" />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-expoia-navy">
          Tipo de vinculación principal *
        </legend>
        <p className="mb-3 text-xs italic text-expoia-gray-mid">Marca solo un óvalo.</p>
        <div className="grid gap-2">
          {TIPOS_VINCULACION.map((opcion) => (
            <label key={opcion} className="flex items-center gap-2 text-sm text-expoia-gray-dark">
              <input type="radio" name="tipoVinculacion" value={opcion} checked={tipoVinculacion === opcion} onChange={() => setTipoVinculacion(opcion)} required className="h-4 w-4 accent-expoia-cyan" />
              {opcion}
            </label>
          ))}
        </div>
        {tipoVinculacion === "Otro" && (
          <input type="text" value={tipoVinculacionOtro} onChange={(e) => setTipoVinculacionOtro(e.target.value)} placeholder="Especifica" aria-label="Otro tipo de vinculación" className="mt-2 w-full rounded-lg border border-expoia-border px-4 py-2.5 text-sm text-expoia-navy outline-none focus:border-expoia-cyan" />
        )}
      </fieldset>

      <div>
        <label htmlFor="ciudad" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Ciudad o municipio de procedencia *
        </label>
        <input id="ciudad" name="ciudad" type="text" required className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan" />
      </div>

      <div>
        <label htmlFor="institucion" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Institución, empresa o emprendimiento al que perteneces <span className="font-normal text-expoia-gray-mid">(opcional)</span>
        </label>
        <input id="institucion" name="institucion" type="text" className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan" />
      </div>

      <div>
        <label htmlFor="programaOSector" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Programa académico, profesión o sector de actividad <span className="font-normal text-expoia-gray-mid">(opcional)</span>
        </label>
        <input id="programaOSector" name="programaOSector" type="text" className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan" />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-expoia-navy">
          ¿Qué esperas encontrar en el evento? <span className="font-normal text-expoia-gray-mid">(opcional; puedes marcar varias opciones)</span>
        </legend>
        <p className="mb-3 text-xs italic text-expoia-gray-mid">Selecciona todos los que correspondan.</p>
        <div className="grid gap-2">
          {EXPECTATIVAS_OPCIONES.map((opcion) => (
            <label key={opcion} className="flex items-center gap-2 text-sm text-expoia-gray-dark">
              <input type="checkbox" checked={expectativas.includes(opcion)} onChange={() => alternarExpectativa(opcion)} className="h-4 w-4 rounded accent-expoia-cyan" />
              {opcion}
            </label>
          ))}
        </div>
        {expectativas.includes("Otro") && (
          <input type="text" value={expectativasOtro} onChange={(e) => setExpectativasOtro(e.target.value)} placeholder="Especifica" aria-label="Otra expectativa" className="mt-2 w-full rounded-lg border border-expoia-border px-4 py-2.5 text-sm text-expoia-navy outline-none focus:border-expoia-cyan" />
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-expoia-navy">
          ¿Deseas participar en la rueda de negocios para la adquisición de productos tecnológicos? *
        </legend>
        <p className="mb-3 text-xs italic text-expoia-gray-mid">Marca solo un óvalo.</p>
        <div className="grid gap-2">
          {["Sí", "No"].map((opcion) => (
            <label key={opcion} className="flex items-center gap-2 text-sm text-expoia-gray-dark">
              <input type="radio" name="ruedaNegocios" value={opcion} checked={ruedaNegocios === opcion} onChange={() => setRuedaNegocios(opcion)} required className="h-4 w-4 accent-expoia-cyan" />
              {opcion}
            </label>
          ))}
        </div>
      </fieldset>

      <AutorizacionDatos checked={autorizaDatos} onChange={setAutorizaDatos} />
      {estado === "error" && <p className="text-sm text-expoia-magenta">{errorMsg}</p>}
      <button type="submit" disabled={estado === "enviando"} className="w-full rounded-full bg-expoia-magenta px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy disabled:opacity-60 sm:w-auto">
        {estado === "enviando" ? "Enviando..." : "Inscribirme"}
      </button>
    </form>
  );
}
