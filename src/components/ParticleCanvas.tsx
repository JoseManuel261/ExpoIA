"use client";

import { useEffect, useRef, RefObject } from "react";

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

const RADIO_REPULSION = 70;
const FUERZA_REPULSION = 26;
const RETORNO = 0.12;

const TOTAL_PARTICULAS = 500;

// Súbelo más (2.2, 2.5...) si quieres que viajen aún más lejos.
const ALCANCE = 1.7;

// Franja de desvanecimiento al borde del canvas, en px.
const MARGEN_BORDE = 60;

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

// Qué tan cerca está una coordenada del borde del canvas (0 = en el borde
// o fuera, 1 = lejos del borde). Función pura a nivel de módulo: antes se
// recreaba 500 veces por frame dentro del loop de dibujo, generando basura
// innecesaria para el garbage collector.
function factorBorde(coord: number, maximo: number) {
  if (coord < MARGEN_BORDE) return Math.max(coord / MARGEN_BORDE, 0);
  if (coord > maximo - MARGEN_BORDE) return Math.max((maximo - coord) / MARGEN_BORDE, 0);
  return 1;
}

export default function ParticleCanvas({ origenRef }: { origenRef?: RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particulasRef = useRef<Particula[]>([]);
  const offsetsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  // Desplazamiento de la cajita del logo respecto al contenedor del canvas
  // (ahora la sección completa). Se recalcula en cada resize.
  const origenOffsetRef = useRef({ x: 0, y: 0 });
  const origenScaleRef = useRef({ x: 1, y: 1 });
  // Tamaño del contenedor cacheado: getBoundingClientRect() fuerza un
  // reflow del layout cada vez que se llama. Antes se llamaba una vez por
  // FRAME (60x/seg), lo cual ya era caro. Ahora solo se recalcula cuando
  // de verdad cambia el tamaño (ajustarTamano).
  const rectRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    particulasRef.current = generarParticulas();
    offsetsRef.current = particulasRef.current.map(() => ({ x: 0, y: 0 }));
    // Ajusta el canvas al tamaño real del contenedor, respetando pantallas
    // de alta densidad (Retina) para que los círculos no se vean borrosos.
    // El dpr se limita a 2: en pantallas 3x/4x no aporta nitidez visible
    // para este tipo de gráfico y multiplica el costo de cada arc()/fill().
    function ajustarTamano() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      rectRef.current = { width: rect.width, height: rect.height };

      // Recalcula dónde queda la cajita del logo dentro del contenedor
      // grande, para que las partículas sigan naciendo ahí visualmente.
      if (origenRef?.current) {
        const rectOrigen = origenRef.current.getBoundingClientRect();
        origenOffsetRef.current = {
          x: rectOrigen.left - rect.left,
          y: rectOrigen.top - rect.top,
        };
        origenScaleRef.current = {
          x: rectOrigen.width / 320,
          y: rectOrigen.height / 720,
        };
      }
    }
    ajustarTamano();

    const resizeObserver = new ResizeObserver(ajustarTamano);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    if (origenRef?.current) resizeObserver.observe(origenRef.current);
    window.addEventListener("resize", ajustarTamano);

    // Repulsión del mouse: siempre activa, sin importar la preferencia de
    // "reducir movimiento" del sistema.
    function manejarMouseMove(e: MouseEvent) {
      const rect = canvas?.parentElement?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function manejarMouseOut() {
      mouseRef.current = null;
    }
    function manejarTouchMove(e: TouchEvent) {
      const rect = canvas?.parentElement?.getBoundingClientRect();
      const touch = e.touches[0];
      if (!rect || !touch) return;
      mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    window.addEventListener("mousemove", manejarMouseMove);
    window.addEventListener("mouseout", manejarMouseOut);
    window.addEventListener("touchmove", manejarTouchMove, { passive: true });

    let animId: number;
    const inicio = performance.now();

    function dibujarFrame(tiempo: number) {
      if (!ctx || !canvas) return;
      const rect = rectRef.current;
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

        const scale = origenScaleRef.current;
        const baseX = origenOffsetRef.current.x + (p.startX + dx) * scale.x;
        const baseY = origenOffsetRef.current.y + (p.startY + dy) * scale.y;

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

        // Fade adicional por cercanía al borde visible: sin importar en qué
        // punto de su recorrido esté la partícula, si se acerca al límite
        // del canvas (el mismo límite que recorta la sección) se desvanece
        // antes de cruzarlo, en vez de "cortarse" de golpe.
        const fadeBorde = Math.min(factorBorde(x, rect.width), factorBorde(y, rect.height));
        const opacidadFinal = opacidad * fadeBorde;

        if (opacidadFinal <= 0.01 || radio <= 0) continue;

        ctx.globalAlpha = opacidadFinal;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    function loop(ahora: number) {
      try {
        dibujarFrame((ahora - inicio) / 1000);
      } catch (err) {
        // Si el dibujo lanza una excepción, antes el loop moría en silencio
        // (nunca se volvía a pedir el siguiente frame) sin dejar rastro. Ahora
        // se reporta en la consola del navegador para poder diagnosticarlo.
        console.error("ParticleCanvas: error en el frame de animación", err);
      }
      animId = requestAnimationFrame(loop);
    }

    // --- Pausa cuando la sección no está a la vista ---
    // En vez de dejar el requestAnimationFrame corriendo para siempre (aunque
    // el usuario haya hecho scroll y ya no vea el hero), un IntersectionObserver
    // detiene el loop por completo cuando la sección sale del viewport, y lo
    // reinicia cuando vuelve a entrar. Así no se gasta CPU/batería dibujando
    // 500 partículas que nadie está viendo.
    let animando = false;

    function iniciarAnimacion() {
      if (animando) return;
      animando = true;
      animId = requestAnimationFrame(loop);
    }
    function detenerAnimacion() {
      if (!animando) return;
      animando = false;
      cancelAnimationFrame(animId);
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) iniciarAnimacion();
          else detenerAnimacion();
        }
      },
      { threshold: 0 }
    );
    if (canvas.parentElement) intersectionObserver.observe(canvas.parentElement);

    return () => {
      detenerAnimacion();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", ajustarTamano);
      window.removeEventListener("mousemove", manejarMouseMove);
      window.removeEventListener("mouseout", manejarMouseOut);
      window.removeEventListener("touchmove", manejarTouchMove);
    };
  }, [origenRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
      aria-hidden
    />
  );
}