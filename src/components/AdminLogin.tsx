"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnviando(true);
    setError("");

    try {
      const respuesta = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "No se pudo iniciar sesión");
      window.location.reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo iniciar sesión");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-expoia-bg px-6">
      <form
        onSubmit={iniciarSesion}
        className="w-full max-w-md rounded-2xl border border-expoia-border bg-white p-8 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-expoia-cyan">
          EXPOIA 2026
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-expoia-navy">Panel administrativo</h1>
        <p className="mt-2 text-sm text-expoia-gray-dark">
          Ingresa la contraseña para consultar las inscripciones y cuestionarios.
        </p>
        <label htmlFor="admin-password" className="mt-7 block text-sm font-medium text-expoia-navy">
          Contraseña
        </label>
        <div className="relative mt-2">
          <input
            id="admin-password"
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-expoia-border px-4 py-3 pr-12 text-expoia-navy outline-none focus:border-expoia-cyan"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setMostrarPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-expoia-gray-mid hover:text-expoia-navy"
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarPassword ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 5.2A10.7 10.7 0 0112 5c5.2 0 8.5 4.2 9.5 7a15.7 15.7 0 01-3.1 4.8M6.2 6.2C3.9 7.7 2.7 10.1 2.5 12c.5 1.5 1.7 3.8 4.4 5.4A10.6 10.6 0 0012 19c.9 0 1.7-.1 2.5-.3" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2.5 12S5.8 5 12 5s9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full rounded-lg bg-expoia-navy px-4 py-3 font-semibold text-white transition hover:bg-expoia-cyan disabled:opacity-60"
        >
          {enviando ? "Verificando..." : "Entrar al panel"}
        </button>
      </form>
    </main>
  );
}
