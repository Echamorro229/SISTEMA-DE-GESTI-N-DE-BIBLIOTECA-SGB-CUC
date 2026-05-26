create extension if not exists pgcrypto;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id),
  name text not null,
  email text not null unique,
  password_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  isbn text not null unique,
  category text not null,
  copies integer not null default 0 check (copies >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  book_id uuid not null references public.books(id),
  due_date date not null,
  returned_at timestamptz,
  status text not null default 'Activo' check (status in ('Activo', 'Vencido', 'Devuelto')),
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  book_id uuid not null references public.books(id),
  position integer not null check (position > 0),
  status text not null default 'Pendiente' check (status in ('Pendiente', 'En espera', 'Lista', 'Confirmada', 'Cancelada')),
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_books_search on public.books using gin (to_tsvector('simple', title || ' ' || author || ' ' || isbn || ' ' || category));
create index if not exists idx_loans_status on public.loans(status);
create index if not exists idx_reservations_status on public.reservations(status);

create or replace function public.create_loan(p_user_id uuid, p_book_id uuid, p_due_date date)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_book public.books%rowtype;
  v_loan public.loans%rowtype;
  v_user_name text;
begin
  select * into v_book from public.books where id = p_book_id for update;
  if not found then
    raise exception 'Libro no encontrado';
  end if;

  if v_book.copies < 1 then
    raise exception 'No hay copias disponibles para prestar';
  end if;

  select name into v_user_name from public.users where id = p_user_id;
  if v_user_name is null then
    raise exception 'Usuario no encontrado';
  end if;

  update public.books set copies = copies - 1 where id = p_book_id;

  insert into public.loans(user_id, book_id, due_date, status)
  values (p_user_id, p_book_id, p_due_date, 'Activo')
  returning * into v_loan;

  insert into public.activities(message)
  values (v_user_name || ' retiro ' || v_book.title);

  return to_jsonb(v_loan);
end;
$$;

create or replace function public.return_loan(p_loan_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_loan public.loans%rowtype;
  v_book_title text;
  v_user_name text;
begin
  select * into v_loan from public.loans where id = p_loan_id for update;
  if not found then
    raise exception 'Prestamo no encontrado';
  end if;

  if v_loan.status = 'Devuelto' then
    raise exception 'El prestamo ya fue devuelto';
  end if;

  update public.loans
  set status = 'Devuelto', returned_at = now()
  where id = p_loan_id
  returning * into v_loan;

  update public.books set copies = copies + 1 where id = v_loan.book_id;

  select title into v_book_title from public.books where id = v_loan.book_id;
  select name into v_user_name from public.users where id = v_loan.user_id;
  insert into public.activities(message)
  values (v_user_name || ' devolvio ' || v_book_title);

  return to_jsonb(v_loan);
end;
$$;

create or replace function public.create_reservation(p_user_id uuid, p_book_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_position integer;
  v_reservation public.reservations%rowtype;
  v_book_title text;
  v_user_name text;
begin
  select count(*) + 1 into v_position
  from public.reservations
  where book_id = p_book_id and status <> 'Cancelada';

  insert into public.reservations(user_id, book_id, position, status)
  values (p_user_id, p_book_id, v_position, case when v_position = 1 then 'Pendiente' else 'En espera' end)
  returning * into v_reservation;

  select title into v_book_title from public.books where id = p_book_id;
  select name into v_user_name from public.users where id = p_user_id;
  insert into public.activities(message)
  values (v_user_name || ' reservo ' || v_book_title);

  return to_jsonb(v_reservation);
end;
$$;

create or replace function public.confirm_reservation(p_reservation_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_reservation public.reservations%rowtype;
  v_book_title text;
  v_user_name text;
begin
  update public.reservations
  set status = 'Confirmada'
  where id = p_reservation_id and status <> 'Cancelada'
  returning * into v_reservation;

  if not found then
    raise exception 'Reserva no encontrada o cancelada';
  end if;

  select title into v_book_title from public.books where id = v_reservation.book_id;
  select name into v_user_name from public.users where id = v_reservation.user_id;
  insert into public.activities(message)
  values (v_user_name || ' confirmo la reserva de ' || v_book_title);

  return to_jsonb(v_reservation);
end;
$$;

create or replace function public.dashboard_summary()
returns jsonb
language sql
stable
security definer
as $$
  select jsonb_build_object(
    'availableCopies', coalesce((select sum(copies) from public.books), 0),
    'availableTitles', (select count(*) from public.books where copies > 0),
    'activeLoans', (select count(*) from public.loans where status <> 'Devuelto'),
    'expiredLoans', (select count(*) from public.loans where status <> 'Devuelto' and due_date < current_date),
    'pendingReservations', (select count(*) from public.reservations where status <> 'Confirmada'),
    'readyReservations', (select count(*) from public.reservations where status = 'Lista'),
    'pendingFines', (select count(*) * 40000 from public.loans where status <> 'Devuelto' and due_date < current_date),
    'users', (select count(*) from public.users),
    'activity', coalesce((select jsonb_agg(message order by created_at desc) from (select message, created_at from public.activities order by created_at desc limit 5) a), '[]'::jsonb)
  );
$$;

insert into public.roles(name)
values ('Estudiante'), ('Bibliotecario'), ('Administrador'), ('Directivo')
on conflict (name) do nothing;

insert into public.books(title, author, isbn, category, copies)
values
  ('Ingenieria de Software', 'Ian Sommerville', '978-607-32-0603-7', 'Sistemas', 4),
  ('Clean Code', 'Robert C. Martin', '978-013-235088-4', 'Programacion', 0),
  ('Bases de Datos', 'Abraham Silberschatz', '978-844-81-5671-8', 'Datos', 2),
  ('Arquitectura de Computadores', 'William Stallings', '978-013-410161-3', 'Hardware', 0)
on conflict (isbn) do nothing;

insert into public.users(name, email, role_id)
select 'Laura Martinez', 'laura.martinez@cuc.edu.co', roles.id from public.roles where roles.name = 'Estudiante'
on conflict (email) do nothing;

insert into public.users(name, email, role_id)
select 'Carlos Perez', 'carlos.perez@cuc.edu.co', roles.id from public.roles where roles.name = 'Estudiante'
on conflict (email) do nothing;

insert into public.users(name, email, role_id, password_hash)
select 'Bibliotecario CUC', 'bibliotecario@cuc.edu.co', roles.id, '$2b$10$459p5ctvy/3wcTP7hDPpn.FyCIUn5n/JV/lNPyqFAwpt2vlsiEvd2'
from public.roles where roles.name = 'Bibliotecario'
on conflict (email) do update set password_hash = excluded.password_hash, role_id = excluded.role_id;

insert into public.users(name, email, role_id, password_hash)
select 'Administrador CUC', 'admin@cuc.edu.co', roles.id, '$2b$10$8iTtB3VuET9f3/QFwFIEMeqUfixV/Rycevz547/JrVQQzzk9IQprO'
from public.roles where roles.name = 'Administrador'
on conflict (email) do update set password_hash = excluded.password_hash, role_id = excluded.role_id;

insert into public.users(name, email, role_id, password_hash)
select 'Directivo CUC', 'directivo@cuc.edu.co', roles.id, '$2b$10$4g8K2oWLkxjtllYkrimZiuMBZ/DiIjwYNeRA2E8v/2zp0TgNWHwp2'
from public.roles where roles.name = 'Directivo'
on conflict (email) do update set password_hash = excluded.password_hash, role_id = excluded.role_id;

insert into public.users(name, email, role_id, password_hash)
select 'Estudiante CUC', 'estudiante@cuc.edu.co', roles.id, '$2b$10$yQBnNeeRnNTQcJ/DvsxjbuDN23LGv/UEPnWnwEb7Vl.RfYtMKuvjC'
from public.roles where roles.name = 'Estudiante'
on conflict (email) do update set password_hash = excluded.password_hash, role_id = excluded.role_id;

insert into public.users(name, email, role_id)
select 'Ana Romero', 'ana.romero@cuc.edu.co', roles.id from public.roles where roles.name = 'Estudiante'
on conflict (email) do nothing;

insert into public.users(name, email, role_id)
select 'Miguel Torres', 'miguel.torres@cuc.edu.co', roles.id from public.roles where roles.name = 'Estudiante'
on conflict (email) do nothing;

insert into public.users(name, email, role_id)
select 'Sofia Jimenez', 'sofia.jimenez@cuc.edu.co', roles.id from public.roles where roles.name = 'Estudiante'
on conflict (email) do nothing;

insert into public.loans(user_id, book_id, due_date, status)
select users.id, books.id, '2026-05-08', 'Activo'
from public.users, public.books
where users.email = 'laura.martinez@cuc.edu.co' and books.isbn = '978-607-32-0603-7'
  and not exists (
    select 1 from public.loans where user_id = users.id and book_id = books.id and due_date = '2026-05-08'
  );

insert into public.loans(user_id, book_id, due_date, status)
select users.id, books.id, '2026-05-03', 'Vencido'
from public.users, public.books
where users.email = 'carlos.perez@cuc.edu.co' and books.isbn = '978-844-81-5671-8'
  and not exists (
    select 1 from public.loans where user_id = users.id and book_id = books.id and due_date = '2026-05-03'
  );

insert into public.loans(user_id, book_id, due_date, status)
select users.id, books.id, '2026-05-12', 'Activo'
from public.users, public.books
where users.email = 'ana.romero@cuc.edu.co' and books.isbn = '978-013-235088-4'
  and not exists (
    select 1 from public.loans where user_id = users.id and book_id = books.id and due_date = '2026-05-12'
  );

insert into public.reservations(user_id, book_id, position, status)
select users.id, books.id, 1, 'Pendiente'
from public.users, public.books
where users.email = 'miguel.torres@cuc.edu.co' and books.isbn = '978-013-235088-4'
  and not exists (
    select 1 from public.reservations where user_id = users.id and book_id = books.id
  );

insert into public.reservations(user_id, book_id, position, status)
select users.id, books.id, 2, 'En espera'
from public.users, public.books
where users.email = 'sofia.jimenez@cuc.edu.co' and books.isbn = '978-013-410161-3'
  and not exists (
    select 1 from public.reservations where user_id = users.id and book_id = books.id
  );

insert into public.activities(message)
values
  ('Laura Martinez retiro Ingenieria de Software'),
  ('Carlos Perez supera la fecha limite'),
  ('Diseno de Interfaces disponible para retiro')
on conflict do nothing;
