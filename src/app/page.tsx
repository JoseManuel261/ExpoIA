"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LogosSection from "@/components/LogosSection";
import Diagnostico from "@/components/Diagnostico";
import RegistroForm from "@/components/RegistroForm";
import Footer from "@/components/Footer";
import { ResultadoTest } from "@/lib/testData";

export default function Home() {
  const [resultadoTest, setResultadoTest] = useState<ResultadoTest | null>(null);

  return (
    <main>
      <Header />
      <Hero />
      <LogosSection />
      <Diagnostico onResultado={setResultadoTest} />

      <section id="registro" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:py-28">
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

      <Footer />
    </main>
  );
}
