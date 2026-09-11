// Lógica del Test de EXPOIA — 100% local, sin llamadas a servidor ni IA.
// El puntaje es una suma de pesos por respuesta, normalizada a porcentaje.

export type Ruta =
  | "vender-mas"
  | "reducir-costos"
  | "mejores-decisiones"
  | "optimizar-operacion"
  | "fidelizar-clientes";

export const RUTAS: Record<Ruta, string> = {
  "vender-mas": "Vender más",
  "reducir-costos": "Reducir costos",
  "mejores-decisiones": "Tomar mejores decisiones",
  "optimizar-operacion": "Optimizar la operación",
  "fidelizar-clientes": "Fidelizar clientes",
};

export interface Opcion {
  texto: string;
  puntos: number; // 0 a 3
  ruta?: Ruta; // solo la pregunta 3 usa esto para clasificar la ruta principal
}

export interface Pregunta {
  id: string;
  texto: string;
  opciones: Opcion[];
}

export const PREGUNTAS: Pregunta[] = [
  {
    id: "gestion-info",
    texto: "¿Cómo manejas hoy la información de clientes, ventas o inventario?",
    opciones: [
      { texto: "En papel o de memoria", puntos: 0 },
      { texto: "En hojas de Excel sueltas", puntos: 1 },
      { texto: "En un software de gestión (contable, POS, CRM)", puntos: 2 },
      { texto: "En un sistema integrado que ya cruza varias áreas", puntos: 3 },
    ],
  },
  {
    id: "tareas-repetitivas",
    texto: "¿Cuánto tiempo del equipo se va en tareas repetitivas cada semana?",
    opciones: [
      { texto: "Casi nada, ya está resuelto", puntos: 0 },
      { texto: "Algunas horas sueltas", puntos: 1 },
      { texto: "Un día completo de trabajo", puntos: 2 },
      { texto: "Varios días — es un dolor de cabeza real", puntos: 3 },
    ],
  },
  {
    id: "principal-reto",
    texto: "¿Cuál es el principal reto de tu negocio en este momento?",
    opciones: [
      { texto: "Conseguir y cerrar más clientes", puntos: 2, ruta: "vender-mas" },
      { texto: "Bajar costos operativos", puntos: 2, ruta: "reducir-costos" },
      { texto: "Decidir con más certeza y menos intuición", puntos: 2, ruta: "mejores-decisiones" },
      { texto: "Que los procesos internos fluyan mejor", puntos: 2, ruta: "optimizar-operacion" },
      { texto: "Que los clientes actuales vuelvan y recomienden", puntos: 2, ruta: "fidelizar-clientes" },
    ],
  },
  {
    id: "herramientas-ia",
    texto: "¿Ya usan alguna herramienta de inteligencia artificial en el negocio?",
    opciones: [
      { texto: "No, nunca la hemos probado", puntos: 0 },
      { texto: "La probamos una vez, sin continuidad", puntos: 1 },
      { texto: "La usamos para tareas puntuales", puntos: 2 },
      { texto: "Ya es parte de cómo trabajamos", puntos: 3 },
    ],
  },
  {
    id: "urgencia",
    texto: "¿Qué tan urgente sientes la necesidad de resolver esto?",
    opciones: [
      { texto: "Es una idea a futuro, sin afán", puntos: 0 },
      { texto: "Nos gustaría resolverlo este año", puntos: 1 },
      { texto: "Nos está costando dinero no resolverlo ya", puntos: 2 },
      { texto: "Es urgente, lo necesitamos ya", puntos: 3 },
    ],
  },
];

const PUNTOS_MAXIMOS = PREGUNTAS.reduce(
  (acc, p) => acc + Math.max(...p.opciones.map((o) => o.puntos)),
  0
);

export interface ResultadoTest {
  porcentaje: number;
  ruta: Ruta;
  etiqueta: string;
  mensaje: string;
}

export function calcularResultado(
  respuestas: Record<string, Opcion>
): ResultadoTest {
  let puntos = 0;
  let ruta: Ruta = "mejores-decisiones";

  for (const pregunta of PREGUNTAS) {
    const opcion = respuestas[pregunta.id];
    if (!opcion) continue;
    puntos += opcion.puntos;
    if (opcion.ruta) ruta = opcion.ruta;
  }

  const porcentaje = Math.round((puntos / PUNTOS_MAXIMOS) * 100);

  let etiqueta: string;
  let mensaje: string;

  if (porcentaje < 34) {
    etiqueta = "Etapa inicial";
    mensaje =
      "Todavía hay procesos manuales que consumen tiempo valioso. Justo ahí es donde una primera solución de IA suele dar el retorno más rápido.";
  } else if (porcentaje < 67) {
    etiqueta = "En transformación";
    mensaje =
      "Ya diste los primeros pasos. El siguiente nivel es conectar lo que tienes hoy para que trabaje junto, no por separado.";
  } else {
    etiqueta = "Lista para escalar";
    mensaje =
      "Tu negocio ya tiene la base digital lista. El reto ahora es exprimir esos datos para tomar decisiones más rápidas y rentables.";
  }

  return { porcentaje, ruta, etiqueta, mensaje };
}
