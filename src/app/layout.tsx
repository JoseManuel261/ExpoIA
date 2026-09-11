import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EXPOIA 2026 | Convierte tu próximo reto en una oportunidad rentable",
  description:
    "Diagnostica el potencial de IA de tu negocio en 2 minutos y regístrate para conectar con soluciones reales en EXPOIA 2026, Neiva.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
