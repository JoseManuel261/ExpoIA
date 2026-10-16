"use client";

import { useEffect, useState, FormEvent } from "react";
import AutorizacionDatos from "@/components/AutorizacionDatos";

// Opciones tal cual el formulario oficial de Google (PDF de inscripción).
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

export default function RegistroCompletoModal() {
  const [abierto, setAbierto] = useState(false);
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Campos con lógica propia (radio/checkbox con "Otro" condicional)
  const [tipoVinculacion, setTipoVinculacion] = useState("");
  const [tipoVinculacionOtro, setTipoVinculacionOtro] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [paisOtro, setPaisOtro] = useState("");
  const [expectativas, setExpectativas] = useState<string[]>([]);
  const [expectativasOtro, setExpectativasOtro] = useState("");
  const [autorizaDatos, setAutorizaDatos] = useState(false);

  // Cierra con Escape, para que el modal sea manejable con teclado.
  useEffect(() => {
    if (!abierto) return;
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false);
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [abierto]);

  function alternarExpectativa(opcion: string) {
    setExpectativas((actual) =>
      actual.includes(opcion) ? actual.filter((o) => o !== opcion) : [...actual, opcion]
    );
  }

  function reiniciarFormulario() {
    setTipoVinculacion("");
    setTipoVinculacionOtro("");
    setPais("Colombia");
    setPaisOtro("");
    setExpectativas([]);
    setExpectativasOtro("");
    setAutorizaDatos(false);
    setEstado("idle");
    setErrorMsg("");
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
      nombre: valor("nombreCompleto"),
      telefono: valor("telefonoContacto"),
      tipoVinculacion,
      tipoVinculacionOtro: tipoVinculacion === "Otro" ? tipoVinculacionOtro.trim() : "",
      pais,
      paisOtro: pais === "Otro" ? paisOtro.trim() : "",
      ciudad: valor("ciudad"),
      institucion: valor("institucion"),
      programaOSector: valor("programaOSector"),
      expectativas,
      expectativasOtro: expectativas.includes("Otro") ? expectativasOtro.trim() : "",
      autorizaDatos,
    };

    if (
      !datos.correo ||
      !datos.nombre ||
      !datos.telefono ||
      !datos.tipoVinculacion ||
      !datos.pais ||
      !datos.ciudad ||
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
    } catch {
      setEstado("error");
      setErrorMsg("No pudimos guardar tu registro. Verifica tu conexión e inténtalo de nuevo.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="font-display text-sm font-semibold text-expoia-navy underline decoration-expoia-cyan decoration-2 underline-offset-4 transition-colors hover:text-expoia-cyan"
      >
        Otros →
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-expoia-navy/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="registro-completo-titulo"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAbierto(false);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">
                  INSCRIPCIÓN AL EVENTO
                </p>
                <h3 id="registro-completo-titulo" className="mt-1 font-display text-xl font-semibold text-expoia-navy">
                  EXPO IA Internacional 2026
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
                className="shrink-0 rounded-full border border-expoia-border p-2 text-expoia-gray-dark transition-colors hover:border-expoia-navy hover:text-expoia-navy"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-sm text-expoia-gray-dark">
              Registra tu interés en participar como asistente en este encuentro de
              conferencias, feria comercial y conexión empresarial. La fecha, duración
              y aforo están sujetos a confirmación.
            </p>

            {estado === "exito" ? (
              <div className="mt-8 rounded-xl border border-expoia-border bg-expoia-bg p-6 text-center">
                <p className="font-display text-lg font-semibold text-expoia-navy">
                  Registro recibido
                </p>
                <p className="mt-2 text-sm text-expoia-gray-dark">
                  Ya tenemos tu información completa. Te contactaremos con los
                  próximos pasos para EXPOIA 2026.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    reiniciarFormulario();
                    setAbierto(false);
                  }}
                  className="mt-5 rounded-full bg-expoia-magenta px-6 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={manejarEnvio} className="mt-6 grid gap-6" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="correo" className="mb-1.5 block text-sm font-medium text-expoia-navy">
                      Correo *
                    </label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      required
                      placeholder="nombre@correo.com"
                      className="w-full rounded-lg border border-expoia-border px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
                    />
                  </div>
                  <div>
                    <label htmlFor="nombreCompleto" className="mb-1.5 block text-sm font-medium text-expoia-navy">
                      Nombre completo *
                    </label>
                    <input
                      id="nombreCompleto"
                      name="nombreCompleto"
                      type="text"
                      required
                      minLength={3}
                      placeholder="Tu nombre"
                      className="w-full rounded-lg border border-expoia-border px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefonoContacto" className="mb-1.5 block text-sm font-medium text-expoia-navy">
                    Número de contacto o WhatsApp *
                  </label>
                  <input
                    id="telefonoContacto"
                    name="telefonoContacto"
                    type="tel"
                    required
                    placeholder="300 000 0000"
                    className="w-full rounded-lg border border-expoia-border px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
                  />
                </div>

                {/* Tipo de vinculación */}
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-expoia-navy">
                    Tipo de vinculación principal *
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TIPOS_VINCULACION.map((opcion) => (
                      <label key={opcion} className="flex items-center gap-2 text-sm text-expoia-gray-dark">
                        <input
                          type="radio"
                          name="tipoVinculacion"
                          value={opcion}
                          checked={tipoVinculacion === opcion}
                          onChange={() => setTipoVinculacion(opcion)}
                          required
                          className="h-4 w-4 accent-expoia-cyan"
                        />
                        {opcion}
                      </label>
                    ))}
                  </div>
                  {tipoVinculacion === "Otro" && (
                    <input
                      type="text"
                      value={tipoVinculacionOtro}
                      onChange={(e) => setTipoVinculacionOtro(e.target.value)}
                      placeholder="Especifica"
                      className="mt-2 w-full rounded-lg border border-expoia-border px-4 py-2.5 text-sm text-expoia-navy outline-none focus:border-expoia-cyan"
                    />
                  )}
                </fieldset>

                {/* País de procedencia */}
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-expoia-navy">
                    País de procedencia *
                  </legend>
                  <div className="flex flex-wrap gap-4">
                    {["Colombia", "Otro"].map((opcion) => (
                      <label key={opcion} className="flex items-center gap-2 text-sm text-expoia-gray-dark">
                        <input
                          type="radio"
                          name="pais"
                          value={opcion}
                          checked={pais === opcion}
                          onChange={() => setPais(opcion)}
                          required
                          className="h-4 w-4 accent-expoia-cyan"
                        />
                        {opcion}
                      </label>
                    ))}
                  </div>
                  {pais === "Otro" && (
                    <input
                      type="text"
                      value={paisOtro}
                      onChange={(e) => setPaisOtro(e.target.value)}
                      placeholder="Especifica tu país"
                      className="mt-2 w-full rounded-lg border border-expoia-border px-4 py-2.5 text-sm text-expoia-navy outline-none focus:border-expoia-cyan"
                    />
                  )}
                </fieldset>

                <div>
                  <label htmlFor="ciudad" className="mb-1.5 block text-sm font-medium text-expoia-navy">
                    Ciudad o municipio de procedencia *
                  </label>
                  <input
                    id="ciudad"
                    name="ciudad"
                    type="text"
                    required
                    placeholder="Neiva"
                    className="w-full rounded-lg border border-expoia-border px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
                  />
                </div>

                <div>
                  <label htmlFor="institucion" className="mb-1.5 block text-sm font-medium text-expoia-navy">
                    Institución, empresa o emprendimiento al que perteneces{" "}
                    <span className="font-normal text-expoia-gray-mid">(opcional)</span>
                  </label>
                  <input
                    id="institucion"
                    name="institucion"
                    type="text"
                    className="w-full rounded-lg border border-expoia-border px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
                  />
                </div>

                <div>
                  <label htmlFor="programaOSector" className="mb-1.5 block text-sm font-medium text-expoia-navy">
                    Programa académico, profesión o sector de actividad{" "}
                    <span className="font-normal text-expoia-gray-mid">(opcional)</span>
                  </label>
                  <input
                    id="programaOSector"
                    name="programaOSector"
                    type="text"
                    className="w-full rounded-lg border border-expoia-border px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
                  />
                </div>

                {/* Expectativas */}
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-expoia-navy">
                    ¿Qué esperas encontrar en el evento?{" "}
                    <span className="font-normal text-expoia-gray-mid">
                      (opcional; puedes marcar varias opciones)
                    </span>
                  </legend>
                  <div className="grid gap-2">
                    {EXPECTATIVAS_OPCIONES.map((opcion) => (
                      <label key={opcion} className="flex items-center gap-2 text-sm text-expoia-gray-dark">
                        <input
                          type="checkbox"
                          checked={expectativas.includes(opcion)}
                          onChange={() => alternarExpectativa(opcion)}
                          className="h-4 w-4 rounded accent-expoia-cyan"
                        />
                        {opcion}
                      </label>
                    ))}
                  </div>
                  {expectativas.includes("Otro") && (
                    <input
                      type="text"
                      value={expectativasOtro}
                      onChange={(e) => setExpectativasOtro(e.target.value)}
                      placeholder="Especifica"
                      className="mt-2 w-full rounded-lg border border-expoia-border px-4 py-2.5 text-sm text-expoia-navy outline-none focus:border-expoia-cyan"
                    />
                  )}
                </fieldset>

                <AutorizacionDatos checked={autorizaDatos} onChange={setAutorizaDatos} />

                {estado === "error" && <p className="text-sm text-expoia-magenta">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="w-full rounded-full bg-expoia-magenta px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy disabled:opacity-60 sm:w-auto"
                >
                  {estado === "enviando" ? "Enviando..." : "Inscribirme"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}