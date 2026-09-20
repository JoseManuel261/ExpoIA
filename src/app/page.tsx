"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Diagnostico from "@/components/Diagnostico";
import RegistroForm from "@/components/RegistroForm";
import LogosSection from "@/components/LogosSection";
import PasosSection from "@/components/PasosSection";
import SectoresSection from "@/components/SectoresSection";
import SpeakersSection from "@/components/SpeakersSection";
import AgendaSection from "@/components/AgendaSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { PREGUNTAS, calcularResultado, Opcion, ResultadoTest } from "@/lib/testData";

export default function Home() {
  // Único dueño del progreso del test: la instancia principal de <Diagnostico />
  // recibe este estado por props.
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, Opcion>>({});
  const [resultadoTest, setResultadoTest] = useState<ResultadoTest | null>(null);

  function elegirRespuesta(opcion: Opcion) {
    const pregunta = PREGUNTAS[paso];
    const nuevasRespuestas = { ...respuestas, [pregunta.id]: opcion };
    setRespuestas(nuevasRespuestas);

    if (paso === PREGUNTAS.length - 1) {
      setResultadoTest(calcularResultado(nuevasRespuestas));
    } else {
      setPaso((p) => p + 1);
    }
  }

  function reiniciarDiagnostico() {
    setPaso(0);
    setRespuestas({});
    setResultadoTest(null);
  }

  return (
    <main>
      <Header />
      <Hero />

      {/* Test y Registro: lo primero después del Hero, sin nada de relleno
          institucional entre medio. Son el corazón de la página. */}
      <Diagnostico
        paso={paso}
        resultado={resultadoTest}
        onElegir={elegirRespuesta}
        onReiniciar={reiniciarDiagnostico}
      />

      <section id="registro" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-24">
          <div>
            <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">
              REGISTRO DE INTERÉS
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-3xl font-semibold text-expoia-navy md:text-4xl">
              Cuéntanos qué quieres transformar.
            </h2>
            <p className="mt-4 max-w-[42ch] text-expoia-gray-dark">
              Cuando el registro oficial esté habilitado, tu inscripción
              quedará lista y podrás solicitar conexiones directas con
              soluciones de IA para tu sector.
            </p>
          </div>
          <RegistroForm resultadoTest={resultadoTest} />
        </div>
      </section>

      {/* Contenido de soporte / confianza, debajo de lo prioritario */}
      <LogosSection />
      <PasosSection />
      <SectoresSection />
      <SpeakersSection />
      <div id="agenda">
        <AgendaSection />
      </div>
      <FaqSection />
      <section className="border-b border-expoia-border bg-expoia-bg">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-14 text-center sm:px-6 sm:py-20">
          <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">
            ¿QUIERES VOLVER A EMPEZAR?
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-expoia-navy md:text-3xl">
            Revisa de nuevo tu nivel de preparación para la IA.
          </h2>
          <a
            href="#test"
            className="mt-6 rounded-full bg-expoia-magenta px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy"
          >
            Repetir el diagnóstico
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}