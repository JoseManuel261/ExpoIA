"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Envuelve cualquier bloque para que aparezca con sentido al entrar en
// pantalla (no de golpe, y solo una vez, no cada vez que se hace scroll
// de más). Se usa con "delay" escalonado para listas, creando un efecto
// de cascada real en vez de que todo aparezca en simultáneo.
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
