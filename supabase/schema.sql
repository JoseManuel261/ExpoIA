-- Ejecutar en el SQL Editor del proyecto de Supabase de EXPOIA.

create table if not exists registros_interes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text not null,
  correo text not null,
  telefono text not null,
  principal_reto text not null,
  resultado_porcentaje integer,
  resultado_etiqueta text,
  created_at timestamptz not null default now()
);

-- La inserción se hace desde la API route del servidor usando la
-- Service Role Key, así que no es obligatorio abrir RLS al público.
-- Aun así, se activa RLS por buenas prácticas y se deja bloqueada
-- por defecto (ninguna policy de acceso público).
alter table registros_interes enable row level security;

-- Formulario COMPLETO de inscripción (botón "Otros" en la sección de
-- Registro), con las mismas 10 preguntas del formulario oficial de
-- Google Forms usado para la inscripción de asistentes.
create table if not exists registros_completos (
  id uuid primary key default gen_random_uuid(),
  correo text not null,
  nombre text not null,
  telefono text not null,
  tipo_vinculacion text not null,
  tipo_vinculacion_otro text,
  pais text not null,
  pais_otro text,
  ciudad text not null,
  institucion text,
  programa_o_sector text,
  expectativas text[] not null default '{}',
  expectativas_otro text,
  autoriza_datos boolean not null,
  created_at timestamptz not null default now()
);

alter table registros_completos enable row level security;