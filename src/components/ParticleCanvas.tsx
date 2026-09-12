"use client";

import { useEffect, useRef } from "react";

interface Particula {
  size: number;
  color: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  // Ahora con 5 puntos: 4 tramos de recorrido en vez de 3, para que las
  // partículas viajen más lejos y el desvanecimiento se concentre solo
  // en el último tramo (en vez de repartirse en todo el trayecto).
  pathX: number[];
  pathY: number[];
  opacity: number[];
  scale: number[];
}

// Mismos parámetros de repulsión que ya habías ajustado.
const RADIO_REPULSION = 70;
const FUERZA_REPULSION = 26;
const RETORNO = 0.12;

const TOTAL_PARTICULAS = 500;

// Multiplica qué tan lejos llega el último punto del recorrido.
// Súbelo más (2.2, 2.5...) si quieres que viajen aún más lejos.
const ALCANCE = 10;

function generarParticulas(): Particula[] {
  return Array.from({ length: TOTAL_PARTICULAS }).map(() => {
    const tipoRand = Math.random();
    let startX = 0;
    let startY = 0;
    let pathX: number[] = [0, 0, 0, 0, 0];
    let pathY: number[] = [0, 0, 0, 0, 0];

    const color = Math.random() > 0.4 ? "#6ee7ff" : "#d314a7";
    const size = Math.random() * 3 + 1;
    const delay = Math.random() * 5;
    const duration = Math.random() * 2 + 2;

    const dispersionX = (Math.random() - 0.5) * 80;
    const dispersionY = (Math.random() - 0.5) * 80;

    // Se agregó un 5to punto (índice 4) más lejano que el anterior,
    // extendiendo el recorrido — el punto 3 queda como parada intermedia.
    if (tipoRand < 0.2) {
      startX = 120;
      startY = 480;
      pathX = [0, -60 + dispersionX * 0.5, -130 + dispersionX, -210 + dispersionX * 1.2, -210 + dispersionX * 1.2 * ALCANCE];
      pathY = [0, 10 + dispersionY * 0.5, 30 + dispersionY, 50 + dispersionY * 1.2, 50 + dispersionY * 1.2 * ALCANCE];
    } else if (tipoRand < 0.4) {
      startX = 110;
      startY = 410;
      pathX = [0, -50 + dispersionX * 0.4, -110 + dispersionX * 0.8, -190 + dispersionX, -190 + dispersionX * ALCANCE];
      pathY = [0, -30 + dispersionY * 0.4, -70 + dispersionY * 0.8, -125 + dispersionY, -125 + dispersionY * ALCANCE];
    } else if (tipoRand < 0.6) {
      startX = 170;
      startY = 240;
      pathX = [0, 20 + dispersionX * 0.4, 50 + dispersionX * 0.8, 85 + dispersionX, 85 + dispersionX * ALCANCE];
      pathY = [0, -40 + dispersionY * 0.4, -90 + dispersionY * 0.8, -150 + dispersionY, -150 + dispersionY * ALCANCE];
    } else if (tipoRand < 0.8) {
      startX = 170;
      startY = 550;
      pathX = [0, 60 + dispersionX * 0.4, 120 + dispersionX * 0.8, 180 + dispersionX, 180 + dispersionX * ALCANCE];
      pathY = [0, 20 + dispersionY * 0.4, 45 + dispersionY * 0.8, 70 + dispersionY, 70 + dispersionY * ALCANCE];
    } else {
      startX = 160;
      startY = 80;
      pathX = [0, dispersionX * 0.8, dispersionX * 1.5, dispersionX * 2.0, dispersionX * 2.0 * ALCANCE];
      pathY = [0, -20 + dispersionY * 0.5, -50 + dispersionY, -90 + dispersionY * 1.5, -90 + dispersionY * 1.5 * ALCANCE];
    }

    return {
      size,
      color,
      delay,
      duration,
      startX,
      startY,
      pathX,
      pathY,
      // 5 puntos → 4 tramos. La opacidad se mantiene en 1 hasta el
      // penúltimo punto y solo cae a 0 en el ÚLTIMO tramo: el fade-out
      // ahora pasa lejos del punto de origen, no repartido en todo el viaje.
      opacity: [0, 1, 1, 1, 0],
      scale: [0.2, 1.3, 1, 0.85, 0.15],
    };
  });
}

// Interpola un valor a través de N keyframes, dividiendo el progreso 0-1
// en (N-1) tramos iguales, con suavizado easeInOut en cada tramo.
function interpolarKeyframes(valores: number[], progreso: number) {
  const segmentos = valores.length - 1;
  const p = Math.min(Math.max(progreso, 0), 0.999999);
  const tramo = Math.floor(p * segmentos);
  const local = p * segmentos - tramo;
  const suavizado = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
  const a = valores[tramo];
  const b = valores[tramo + 1];
  return a + (b - a) * suavizado;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particulasRef = useRef<Particula[]>([]);
  const offsetsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    particulasRef.current = generarParticulas();
    offsetsRef.current = particulasRef.current.map(() => ({ x: 0, y: 0 }));

    // Ajusta el canvas al tamaño real del contenedor, respetando pantallas
    // de alta densidad (Retina) para que los círculos no se vean borrosos.
    function ajustarTamano() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ajustarTamano();

    const resizeObserver = new ResizeObserver(ajustarTamano);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    function manejarMouseMove(e: MouseEvent) {
      const rect = canvas?.parentElement?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function manejarMouseOut() {
      mouseRef.current = null;
    }
    window.addEventListener("mousemove", manejarMouseMove);
    window.addEventListener("mouseout", manejarMouseOut);

    let animId: number;
    const inicio = performance.now();

    function dibujar(ahora: number) {
      if (!ctx || !canvas) return;
      const tiempo = (ahora - inicio) / 1000; // segundos

      const rect = canvas.parentElement!.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const particulas = particulasRef.current;
      const offsets = offsetsRef.current;

      for (let i = 0; i < particulas.length; i++) {
        const p = particulas[i];

        // Progreso 0-1 dentro del ciclo de esta partícula (con su delay y loop infinito).
        const bruto = tiempo - p.delay;
        const progreso = (((bruto % p.duration) + p.duration) % p.duration) / p.duration;

        const dx = interpolarKeyframes(p.pathX, progreso);
        const dy = interpolarKeyframes(p.pathY, progreso);
        const opacidad = interpolarKeyframes(p.opacity, progreso);
        const escala = interpolarKeyframes(p.scale, progreso);

        const baseX = p.startX + dx;
        const baseY = p.startY + dy;

        // Repulsión del mouse, con inercia (igual que la versión anterior con divs).
        let objetivoX = 0;
        let objetivoY = 0;
        if (mouseRef.current) {
          const mdx = baseX - mouseRef.current.x;
          const mdy = baseY - mouseRef.current.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < RADIO_REPULSION) {
            const fuerza = (1 - dist / RADIO_REPULSION) * FUERZA_REPULSION;
            const nx = mdx / (dist || 0.0001);
            const ny = mdy / (dist || 0.0001);
            objetivoX = nx * fuerza;
            objetivoY = ny * fuerza;
          }
        }

        const offset = offsets[i];
        offset.x += (objetivoX - offset.x) * RETORNO;
        offset.y += (objetivoY - offset.y) * RETORNO;

        const x = baseX + offset.x;
        const y = baseY + offset.y;
        const radio = Math.max((p.size * escala) / 2, 0);

        if (opacidad <= 0.01 || radio <= 0) continue;

        ctx.globalAlpha = opacidad;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(dibujar);
    }
    animId = requestAnimationFrame(dibujar);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", manejarMouseMove);
      window.removeEventListener("mouseout", manejarMouseOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
      aria-hidden
    />
  );
}