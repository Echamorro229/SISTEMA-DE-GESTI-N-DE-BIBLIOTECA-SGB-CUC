-- Reinicia SOLO los usuarios principales de acceso.
-- No borra prestamos, reservas, actividades, libros ni usuarios existentes.
-- Ejecuta este archivo en Supabase SQL Editor si no puedes iniciar sesion.

insert into public.roles(name)
values ('Estudiante'), ('Bibliotecario'), ('Administrador'), ('Directivo')
on conflict (name) do nothing;

insert into public.users(name, email, role_id, password_hash)
select 'Administrador CUC', 'admin@cuc.edu.co', roles.id, '$2b$10$8iTtB3VuET9f3/QFwFIEMeqUfixV/Rycevz547/JrVQQzzk9IQprO'
from public.roles
where roles.name = 'Administrador'
on conflict (email) do update
set
  name = excluded.name,
  role_id = excluded.role_id,
  password_hash = excluded.password_hash;

insert into public.users(name, email, role_id, password_hash)
select 'Bibliotecario CUC', 'bibliotecario@cuc.edu.co', roles.id, '$2b$10$459p5ctvy/3wcTP7hDPpn.FyCIUn5n/JV/lNPyqFAwpt2vlsiEvd2'
from public.roles
where roles.name = 'Bibliotecario'
on conflict (email) do update
set
  name = excluded.name,
  role_id = excluded.role_id,
  password_hash = excluded.password_hash;

insert into public.users(name, email, role_id, password_hash)
select 'Directivo CUC', 'directivo@cuc.edu.co', roles.id, '$2b$10$4g8K2oWLkxjtllYkrimZiuMBZ/DiIjwYNeRA2E8v/2zp0TgNWHwp2'
from public.roles
where roles.name = 'Directivo'
on conflict (email) do update
set
  name = excluded.name,
  role_id = excluded.role_id,
  password_hash = excluded.password_hash;

insert into public.users(name, email, role_id, password_hash)
select 'Estudiante CUC', 'estudiante@cuc.edu.co', roles.id, '$2b$10$yQBnNeeRnNTQcJ/DvsxjbuDN23LGv/UEPnWnwEb7Vl.RfYtMKuvjC'
from public.roles
where roles.name = 'Estudiante'
on conflict (email) do update
set
  name = excluded.name,
  role_id = excluded.role_id,
  password_hash = excluded.password_hash;

