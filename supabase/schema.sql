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
  autoriza_datos boolean not null default false,
  created_at timestamptz not null default now()
);

-- La inserción se hace desde la API route del servidor usando la
-- Service Role Key, así que no es obligatorio abrir RLS al público.
-- Aun así, se activa RLS por buenas prácticas y se deja bloqueada
-- por defecto (ninguna policy de acceso público).
alter table registros_interes enable row level security;

-- Formulario actual de inscripción de asistentes.
create table if not exists registros_completos (
  id uuid primary key default gen_random_uuid(),
  correo text not null,
  nombre text not null,
  telefono text not null,
  tipo_vinculacion text not null,
  tipo_vinculacion_otro text,
  pais text not null default 'Colombia',
  pais_otro text,
  ciudad text not null,
  institucion text,
  programa_o_sector text,
  expectativas text[] not null default '{}',
  expectativas_otro text,
  rueda_negocios boolean not null default false,
  resultado_porcentaje integer,
  resultado_etiqueta text,
  autoriza_datos boolean not null,
  created_at timestamptz not null default now()
);

alter table registros_completos enable row level security;

-- Migración para proyectos que ya tenían creada la tabla.
alter table registros_completos
  add column if not exists rueda_negocios boolean not null default false;

alter table registros_completos
  add column if not exists resultado_porcentaje integer;

alter table registros_completos
  add column if not exists resultado_etiqueta text;

-- Respuestas del cuestionario de adopción de IA en empresas del Huila.
-- Las respuestas se conservan como JSON para no perder la estructura de
-- matrices ni bloquear futuras versiones del instrumento.
create table if not exists cuestionarios_empresas_huila (
  id uuid primary key default gen_random_uuid(),
  respuestas jsonb not null,
  autoriza_contacto boolean not null default false,
  autoriza_proveedores boolean not null default false,
  acepta_politica boolean not null,
  created_at timestamptz not null default now()
);

alter table cuestionarios_empresas_huila enable row level security;