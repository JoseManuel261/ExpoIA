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
