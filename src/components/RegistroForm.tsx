"use client";

import { useState, FormEvent } from "react";
import { RUTAS, Ruta, ResultadoTest } from "@/lib/testData";

interface RegistroFormProps {
  resultadoTest?: ResultadoTest | null;
}

type Estado = "idle" | "enviando" | "exito" | "error";

export default function RegistroForm({ resultadoTest }: RegistroFormProps) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function manejarEnvio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setErrorMsg("");

    const form = e.currentTarget;
    const datos = {
      nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value.trim(),
      empresa: (form.elements.namedItem("empresa") as HTMLInputElement).value.trim(),
      correo: (form.elements.namedItem("correo") as HTMLInputElement).value.trim(),
      telefono: (form.elements.namedItem("telefono") as HTMLInputElement).value.trim(),
      principalReto: (form.elements.namedItem("principalReto") as HTMLSelectElement).value as Ruta,
      resultadoPorcentaje: resultadoTest?.porcentaje ?? null,
      resultadoEtiqueta: resultadoTest?.etiqueta ?? null,
    };

    try {
      const respuesta = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar el registro");
      }

      setEstado("exito");
      form.reset();
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
    <form onSubmit={manejarEnvio} className="grid gap-5" noValidate>
      {resultadoTest && (
        <div className="rounded-xl border border-expoia-cyan/30 bg-expoia-cyan/5 px-4 py-3 text-sm text-expoia-navy">
          Vienes de tu diagnóstico:{" "}
          <strong>
            {resultadoTest.porcentaje}% — {resultadoTest.etiqueta}
          </strong>
        </div>
      )}

      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Nombre completo
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          minLength={3}
          placeholder="Tu nombre"
          className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
        />
      </div>

      <div>
        <label htmlFor="empresa" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Empresa
        </label>
        <input
          id="empresa"
          name="empresa"
          type="text"
          required
          placeholder="Nombre de la empresa"
          className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="correo" className="mb-1.5 block text-sm font-medium text-expoia-navy">
            Correo
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            required
            placeholder="nombre@empresa.com"
            className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
          />
        </div>
        <div>
          <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-expoia-navy">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            placeholder="300 000 0000"
            className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
          />
        </div>
      </div>

      <div>
        <label htmlFor="principalReto" className="mb-1.5 block text-sm font-medium text-expoia-navy">
          Principal reto
        </label>
        <select
          id="principalReto"
          name="principalReto"
          required
          defaultValue={resultadoTest?.ruta ?? ""}
          className="w-full rounded-lg border border-expoia-border bg-white px-4 py-3 text-expoia-navy outline-none focus:border-expoia-cyan"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {Object.entries(RUTAS).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
      </div>

      {estado === "error" && (
        <p className="text-sm text-expoia-magenta">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-2 rounded-full bg-expoia-magenta px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando..." : "Inscribirme"}
      </button>
    </form>
  );
}
