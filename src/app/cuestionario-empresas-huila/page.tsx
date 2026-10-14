import type { Metadata } from "next";
import CuestionarioEmpresas from "@/components/CuestionarioEmpresas";

export const metadata: Metadata = {
  title: "Cuestionario Empresas Huila | EXPOIA 2026",
  description: "Cuestionario de adopción, uso y necesidades de inteligencia artificial en las empresas del Huila.",
};

export default function CuestionarioEmpresasPage() {
  return <CuestionarioEmpresas />;
}