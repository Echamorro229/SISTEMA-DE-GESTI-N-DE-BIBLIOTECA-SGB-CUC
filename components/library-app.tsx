"use client";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Library,
  LogIn,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Section = "dashboard" | "catalogo" | "prestamos" | "reservas" | "reportes";
type ModalKind = "recover" | "notifications" | "loan" | "return" | "reservation" | "confirm-reservation" | "users" | "roles";

type Book = {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
};

type Loan = {
  id: number;
  user: string;
  book: string;
  due: string;
  state: "Activo" | "Vencido" | "Devuelto";
};

type Reservation = {
  id: number;
  user: string;
  book: string;
  position: number;
  state: "Pendiente" | "En espera" | "Lista" | "Confirmada" | "Cancelada";
};

type User = {
  name: string;
  email: string;
  role: string;
};

type Toast = {
  title: string;
  message: string;
};

const initialBooks: Book[] = [
  {
    title: "Ingenieria de Software",
    author: "Ian Sommerville",
    isbn: "978-607-32-0603-7",
    category: "Sistemas",
    copies: 4
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-013-235088-4",
    category: "Programacion",
    copies: 0
  },
  {
    title: "Bases de Datos",
    author: "Abraham Silberschatz",
    isbn: "978-844-81-5671-8",
    category: "Datos",
    copies: 2
  },
  {
    title: "Arquitectura de Computadores",
    author: "William Stallings",
    isbn: "978-013-410161-3",
    category: "Hardware",
    copies: 0
  }
];

const initialLoans: Loan[] = [
  { id: 1, user: "Laura Martinez", book: "Ingenieria de Software", due: "2026-05-08", state: "Activo" },
  { id: 2, user: "Carlos Perez", book: "Bases de Datos", due: "2026-05-03", state: "Vencido" },
  { id: 3, user: "Ana Romero", book: "Clean Code", due: "2026-05-12", state: "Activo" }
];

const initialReservations: Reservation[] = [
  { id: 1, user: "Miguel Torres", book: "Clean Code", position: 1, state: "Pendiente" },
  { id: 2, user: "Sofia Jimenez", book: "Arquitectura de Computadores", position: 2, state: "En espera" },
  { id: 3, user: "Daniela Ruiz", book: "Diseno de Interfaces", position: 1, state: "Lista" }
];

const initialUsers: User[] = [
  { name: "Laura Martinez", email: "laura.martinez@cuc.edu.co", role: "Estudiante" },
  { name: "Carlos Perez", email: "carlos.perez@cuc.edu.co", role: "Estudiante" },
  { name: "Bibliotecario CUC", email: "biblioteca@cuc.edu.co", role: "Bibliotecario" }
];

const initialRoles = ["Estudiante", "Bibliotecario", "Administrador", "Directivo"];

const navItems: Array<{ id: Section; label: string; icon: typeof Library }> = [
  { id: "dashboard", label: "Panel", icon: BarChart3 },
  { id: "catalogo", label: "Catalogo", icon: BookOpen },
  { id: "prestamos", label: "Prestamos", icon: ClipboardList },
  { id: "reservas", label: "Reservas", icon: CalendarClock },
  { id: "reportes", label: "Reportes", icon: BarChart3 }
];

export function LibraryApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [section, setSection] = useState<Section>("dashboard");
  const [query, setQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("Todos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [activity, setActivity] = useState([
    "Laura Martinez retiro Ingenieria de Software",
    "Carlos Perez supera la fecha limite",
    "Diseno de Interfaces disponible para retiro"
  ]);

  const showToast = (title: string, message: string) => setToast({ title, message });

  const openModal = (kind: ModalKind, book?: Book) => {
    setSelectedBook(book ?? null);
    setModal(kind);
  };

  const activeLoans = loans.filter((loan) => loan.state !== "Devuelto");
  const pendingReservations = reservations.filter((reservation) => reservation.state !== "Confirmada");

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return books.filter((book) => {
      const status = bookStatus(book);
      const matchesQuery =
        !normalized ||
        [book.title, book.author, book.isbn, book.category].some((value) => value.toLowerCase().includes(normalized));
      const matchesFilter = availabilityFilter === "Todos" || status === availabilityFilter;

      return matchesQuery && matchesFilter;
    });
  }, [availabilityFilter, books, query]);

  const metrics = [
    {
      label: "Libros disponibles",
      value: books.reduce((total, book) => total + book.copies, 0).toLocaleString("es-CO"),
      detail: `${books.filter((book) => book.copies > 0).length} titulos con copias`,
      icon: BookOpen
    },
    {
      label: "Prestamos activos",
      value: activeLoans.length.toString(),
      detail: `${loans.filter((loan) => loan.state === "Vencido").length} vencidos`,
      icon: ClipboardList
    },
    {
      label: "Reservas en espera",
      value: pendingReservations.length.toString(),
      detail: `${reservations.filter((reservation) => reservation.state === "Lista").length} listas para retiro`,
      icon: CalendarClock
    },
    {
      label: "Multas pendientes",
      value: `$${(loans.filter((loan) => loan.state === "Vencido").length * 40000).toLocaleString("es-CO")}`,
      detail: "Calculado por retrasos",
      icon: AlertTriangle
    }
  ];

  const addActivity = (message: string) => setActivity((current) => [message, ...current].slice(0, 5));

  const handleLoanSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const bookTitle = String(data.get("book") ?? "");
    const user = String(data.get("user") ?? "").trim();
    const due = String(data.get("due") ?? "");
    const book = books.find((item) => item.title === bookTitle);

    if (!book || book.copies < 1 || !user || !due) return;

    setBooks((current) =>
      current.map((item) => (item.title === bookTitle ? { ...item, copies: item.copies - 1 } : item))
    );
    setLoans((current) => [
      { id: Date.now(), user, book: bookTitle, due, state: "Activo" },
      ...current
    ]);
    addActivity(`${user} retiro ${bookTitle}`);
    setSection("prestamos");
    setModal(null);
    showToast("Prestamo registrado", `${bookTitle} quedo prestado a ${user}.`);
  };

  const handleReturnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loanId = Number(data.get("loan"));
    const loan = loans.find((item) => item.id === loanId);

    if (!loan) return;

    setLoans((current) =>
      current.map((item) => (item.id === loanId ? { ...item, state: "Devuelto" } : item))
    );
    setBooks((current) =>
      current.map((item) => (item.title === loan.book ? { ...item, copies: item.copies + 1 } : item))
    );
    addActivity(`${loan.user} devolvio ${loan.book}`);
    setSection("prestamos");
    setModal(null);
    showToast("Devolucion registrada", `${loan.book} volvio al catalogo disponible.`);
  };

  const handleReservationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const bookTitle = String(data.get("book") ?? "");
    const user = String(data.get("user") ?? "").trim();

    if (!bookTitle || !user) return;

    const position = reservations.filter((reservation) => reservation.book === bookTitle && reservation.state !== "Cancelada").length + 1;
    setReservations((current) => [
      { id: Date.now(), user, book: bookTitle, position, state: position === 1 ? "Pendiente" : "En espera" },
      ...current
    ]);
    addActivity(`${user} reservo ${bookTitle}`);
    setSection("reservas");
    setModal(null);
    showToast("Reserva creada", `${user} quedo en turno #${position} para ${bookTitle}.`);
  };

  const handleConfirmReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reservationId = Number(data.get("reservation"));
    const reservation = reservations.find((item) => item.id === reservationId);

    if (!reservation) return;

    setReservations((current) =>
      current.map((item) => (item.id === reservationId ? { ...item, state: "Confirmada" } : item))
    );
    addActivity(`${reservation.user} confirmo la reserva de ${reservation.book}`);
    setSection("reservas");
    setModal(null);
    showToast("Reserva confirmada", `${reservation.book} quedo confirmado para ${reservation.user}.`);
  };

  const handleUserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const role = String(data.get("role") ?? "");

    if (!name || !email || !role) return;

    setUsers((current) => [{ name, email, role }, ...current]);
    addActivity(`${name} fue registrado como ${role}`);
    setModal(null);
    showToast("Usuario creado", `${name} quedo disponible para prestamos y reservas.`);
  };

  const handleRoleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const role = String(data.get("role") ?? "").trim();

    if (!role || roles.includes(role)) return;

    setRoles((current) => [...current, role]);
    addActivity(`Rol ${role} agregado`);
    setModal(null);
    showToast("Rol creado", `${role} quedo disponible para nuevos usuarios.`);
  };

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={() => setIsLoggedIn(true)}
        toast={toast}
        setToast={setToast}
      />
    );
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Library size={24} />
          </span>
          <div>
            <strong>SGB CUC</strong>
            <span>Biblioteca Universitaria</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Modulos principales">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={section === item.id ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setSection(item.id);
                  setSidebarOpen(false);
                }}
                title={item.label}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="role-card">
          <ShieldCheck size={20} />
          <div>
            <strong>Rol activo</strong>
            <span>Bibliotecario</span>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} title="Abrir menu">
            <Menu size={22} />
          </button>
          <div>
            <p className="eyebrow">Sistema de Gestion de Biblioteca</p>
            <h1>{pageTitle(section)}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" onClick={() => openModal("notifications")} title="Notificaciones">
              <Bell size={20} />
            </button>
            <button className="icon-button" onClick={() => setIsLoggedIn(false)} title="Cerrar sesion">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {sidebarOpen && (
          <button className="scrim" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menu">
            <X size={24} />
          </button>
        )}

        {section === "dashboard" && (
          <Dashboard metrics={metrics} activity={activity} setSection={setSection} openModal={openModal} />
        )}
        {section === "catalogo" && (
          <Catalog
            availabilityFilter={availabilityFilter}
            filteredBooks={filteredBooks}
            query={query}
            setAvailabilityFilter={setAvailabilityFilter}
            setQuery={setQuery}
            openModal={openModal}
          />
        )}
        {section === "prestamos" && <Loans loans={loans} openModal={openModal} />}
        {section === "reservas" && <Reservations reservations={reservations} openModal={openModal} />}
        {section === "reportes" && <Reports loans={loans} reservations={reservations} users={users} />}

        {modal && (
          <ActionModal
            activeLoans={activeLoans}
            availableBooks={books.filter((book) => book.copies > 0)}
            books={books}
            kind={modal}
            onClose={() => setModal(null)}
            onConfirmReservation={handleConfirmReservation}
            onLoanSubmit={handleLoanSubmit}
            onRecover={(email) => {
              setModal(null);
              showToast("Recuperacion enviada", `Se envio el enlace de recuperacion a ${email}.`);
            }}
            onReservationSubmit={handleReservationSubmit}
            onReturnSubmit={handleReturnSubmit}
            onRoleSubmit={handleRoleSubmit}
            onUserSubmit={handleUserSubmit}
            pendingReservations={pendingReservations}
            roles={roles}
            selectedBook={selectedBook}
            users={users}
          />
        )}

        {toast && <ToastNotice toast={toast} onClose={() => setToast(null)} />}
      </section>
    </main>
  );
}

function LoginScreen({
  onLogin,
  toast,
  setToast
}: {
  onLogin: () => void;
  toast: Toast | null;
  setToast: (toast: Toast | null) => void;
}) {
  const [recoverOpen, setRecoverOpen] = useState(false);

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="hero-copy">
          <span className="brand-mark large">
            <Library size={34} />
          </span>
          <h1>SGB CUC</h1>
          <p>Consulta, prestamos, reservas, multas y reportes para la biblioteca universitaria.</p>
        </div>
      </section>

      <section className="login-panel" aria-label="Inicio de sesion">
        <div className="login-box">
          <p className="eyebrow">Acceso institucional</p>
          <h2>Iniciar sesion</h2>
          <label>
            Correo institucional
            <input type="email" placeholder="usuario@cuc.edu.co" />
          </label>
          <label>
            Contrasena
            <input type="password" placeholder="********" />
          </label>
          <div className="login-row">
            <label className="checkline">
              <input type="checkbox" />
              Recordar
            </label>
            <button className="link-button" onClick={() => setRecoverOpen(true)}>
              Recuperar
            </button>
          </div>
          <button className="primary-action" onClick={onLogin}>
            <LogIn size={18} />
            Entrar
          </button>
        </div>
      </section>
      {recoverOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <section className="modal-card">
            <div className="modal-header">
              <h2>Recuperar acceso</h2>
              <button className="icon-button" onClick={() => setRecoverOpen(false)} title="Cerrar">
                <X size={18} />
              </button>
            </div>
            <form
              className="form-stack"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setRecoverOpen(false);
                setToast({
                  title: "Recuperacion enviada",
                  message: `Se envio el enlace de recuperacion a ${String(data.get("email") ?? "")}.`
                });
              }}
            >
              <label>
                Correo institucional
                <input name="email" type="email" required placeholder="usuario@cuc.edu.co" />
              </label>
              <button className="primary-action">Enviar enlace</button>
            </form>
          </section>
        </div>
      )}
      {toast && <ToastNotice toast={toast} onClose={() => setToast(null)} />}
    </main>
  );
}

function Dashboard({
  metrics,
  activity,
  setSection,
  openModal
}: {
  metrics: Array<{ label: string; value: string; detail: string; icon: typeof BookOpen }>;
  activity: string[];
  setSection: (section: Section) => void;
  openModal: (kind: ModalKind) => void;
}) {
  return (
    <div className="page-stack">
      <section className="stats-grid">
        {metrics.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="metric-card" key={stat.label}>
              <Icon size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </article>
          );
        })}
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="panel-header">
            <h2>Actividad reciente</h2>
            <button className="ghost-button" onClick={() => setSection("reportes")}>
              <RefreshCw size={17} />
              Ver reportes
            </button>
          </div>
          {activity.map((item, index) => (
            <ActivityItem
              key={item}
              icon={index === 0 ? CheckCircle2 : index === 1 ? Clock3 : CalendarClock}
              title={index === 0 ? "Ultima accion" : "Movimiento"}
              meta={item}
            />
          ))}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Accesos rapidos</h2>
          </div>
          <div className="quick-grid">
            <button onClick={() => openModal("loan")}><BookOpen size={20} /> Nuevo prestamo</button>
            <button onClick={() => openModal("return")}><ClipboardList size={20} /> Registrar devolucion</button>
            <button onClick={() => openModal("users")}><Users size={20} /> Usuarios</button>
            <button onClick={() => openModal("roles")}><UserCog size={20} /> Roles</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Catalog({
  availabilityFilter,
  query,
  setQuery,
  filteredBooks,
  setAvailabilityFilter,
  openModal
}: {
  availabilityFilter: string;
  query: string;
  setQuery: (value: string) => void;
  filteredBooks: Book[];
  setAvailabilityFilter: (value: string) => void;
  openModal: (kind: ModalKind, book?: Book) => void;
}) {
  return (
    <div className="page-stack">
      <section className="toolbar">
        <div className="searchbox">
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por titulo, autor, ISBN o categoria"
          />
        </div>
        <select
          aria-label="Filtro de disponibilidad"
          value={availabilityFilter}
          onChange={(event) => setAvailabilityFilter(event.target.value)}
        >
          <option>Todos</option>
          <option>Disponible</option>
          <option>Prestado</option>
          <option>Reservar</option>
        </select>
      </section>

      <section className="book-grid">
        {filteredBooks.map((book) => {
          const status = bookStatus(book);
          return (
            <article className="book-card" key={book.isbn}>
              <div className="book-cover">
                <BookOpen size={34} />
              </div>
              <div className="book-info">
                <span className="pill">{book.category}</span>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <small>ISBN {book.isbn}</small>
                <small>{book.copies} copias disponibles</small>
                <div className="book-actions">
                  <span className={book.copies > 0 ? "status available" : "status unavailable"}>
                    {status}
                  </span>
                  <button onClick={() => openModal(book.copies > 0 ? "loan" : "reservation", book)}>
                    {book.copies > 0 ? "Prestar" : "Reservar"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Loans({ loans, openModal }: { loans: Loan[]; openModal: (kind: ModalKind) => void }) {
  return (
    <DataPanel
      columns={["Usuario", "Libro", "Vence", "Estado"]}
      rows={loans.map((loan) => [loan.user, loan.book, loan.due, loan.state])}
      primaryAction="Registrar prestamo"
      secondaryAction="Registrar devolucion"
      onPrimaryAction={() => openModal("loan")}
      onSecondaryAction={() => openModal("return")}
    />
  );
}

function Reservations({
  reservations,
  openModal
}: {
  reservations: Reservation[];
  openModal: (kind: ModalKind) => void;
}) {
  return (
    <DataPanel
      columns={["Usuario", "Libro", "Turno", "Estado"]}
      rows={reservations.map((reservation) => [
        reservation.user,
        reservation.book,
        `#${reservation.position}`,
        reservation.state
      ])}
      primaryAction="Nueva reserva"
      secondaryAction="Confirmar reserva"
      onPrimaryAction={() => openModal("reservation")}
      onSecondaryAction={() => openModal("confirm-reservation")}
    />
  );
}

function Reports({ loans, reservations, users }: { loans: Loan[]; reservations: Reservation[]; users: User[] }) {
  const activeLoans = loans.filter((loan) => loan.state !== "Devuelto").length;
  const confirmedReservations = reservations.filter((reservation) => reservation.state === "Confirmada").length;

  return (
    <div className="page-stack">
      <section className="report-grid">
        <div className="panel">
          <h2>Prestamos por semana</h2>
          <div className="bars">
            {[64, 82, 58, 74, 96, 68].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Indicadores</h2>
          <ActivityItem icon={BookOpen} title="Prestamos activos" meta={`${activeLoans} prestamos en seguimiento`} />
          <ActivityItem icon={CalendarClock} title="Reservas confirmadas" meta={`${confirmedReservations} confirmadas`} />
          <ActivityItem icon={Users} title="Usuarios registrados" meta={`${users.length} usuarios locales`} />
        </div>
      </section>
    </div>
  );
}

function DataPanel({
  columns,
  rows,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction
}: {
  columns: string[];
  rows: string[][];
  primaryAction: string;
  secondaryAction: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}) {
  return (
    <section className="panel table-panel">
      <div className="panel-header">
        <h2>Seguimiento operativo</h2>
        <div className="panel-actions">
          <button className="ghost-button" onClick={onSecondaryAction}>{secondaryAction}</button>
          <button className="primary-small" onClick={onPrimaryAction}>{primaryAction}</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActionModal({
  activeLoans,
  availableBooks,
  books,
  kind,
  onClose,
  onConfirmReservation,
  onLoanSubmit,
  onRecover,
  onReservationSubmit,
  onReturnSubmit,
  onRoleSubmit,
  onUserSubmit,
  pendingReservations,
  roles,
  selectedBook,
  users
}: {
  activeLoans: Loan[];
  availableBooks: Book[];
  books: Book[];
  kind: ModalKind;
  onClose: () => void;
  onConfirmReservation: (event: FormEvent<HTMLFormElement>) => void;
  onLoanSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRecover: (email: string) => void;
  onReservationSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReturnSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRoleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUserSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pendingReservations: Reservation[];
  roles: string[];
  selectedBook: Book | null;
  users: User[];
}) {
  const selectedAvailableBook = selectedBook && selectedBook.copies > 0 ? selectedBook.title : availableBooks[0]?.title;
  const selectedReservedBook = selectedBook ? selectedBook.title : books.find((book) => book.copies === 0)?.title ?? books[0]?.title;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal-card">
        <div className="modal-header">
          <h2>{modalTitle(kind)}</h2>
          <button className="icon-button" onClick={onClose} title="Cerrar">
            <X size={18} />
          </button>
        </div>

        {kind === "recover" && (
          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              onRecover(String(data.get("email") ?? ""));
            }}
          >
            <label>
              Correo institucional
              <input name="email" type="email" required placeholder="usuario@cuc.edu.co" />
            </label>
            <button className="primary-action">Enviar enlace</button>
          </form>
        )}

        {kind === "notifications" && (
          <div className="notice-list">
            <ActivityItem icon={AlertTriangle} title="Prestamos vencidos" meta={`${activeLoans.filter((loan) => loan.state === "Vencido").length} prestamos requieren gestion`} />
            <ActivityItem icon={CalendarClock} title="Reservas pendientes" meta={`${pendingReservations.length} reservas por revisar`} />
            <ActivityItem icon={Users} title="Usuarios locales" meta={`${users.length} usuarios registrados en el frontend`} />
          </div>
        )}

        {kind === "loan" && (
          <form className="form-stack" onSubmit={onLoanSubmit}>
            <label>
              Usuario
              <input name="user" required defaultValue={users[0]?.name} placeholder="Nombre del usuario" />
            </label>
            <label>
              Libro disponible
              <select name="book" required defaultValue={selectedAvailableBook}>
                {availableBooks.map((book) => (
                  <option key={book.isbn} value={book.title}>{book.title}</option>
                ))}
              </select>
            </label>
            <label>
              Fecha de vencimiento
              <input name="due" type="date" required defaultValue="2026-05-15" />
            </label>
            <button className="primary-action">Guardar prestamo</button>
          </form>
        )}

        {kind === "return" && (
          <form className="form-stack" onSubmit={onReturnSubmit}>
            <label>
              Prestamo activo
              <select name="loan" required>
                {activeLoans.map((loan) => (
                  <option key={loan.id} value={loan.id}>{loan.user} - {loan.book}</option>
                ))}
              </select>
            </label>
            <button className="primary-action">Registrar devolucion</button>
          </form>
        )}

        {kind === "reservation" && (
          <form className="form-stack" onSubmit={onReservationSubmit}>
            <label>
              Usuario
              <input name="user" required defaultValue={users[0]?.name} placeholder="Nombre del usuario" />
            </label>
            <label>
              Libro
              <select name="book" required defaultValue={selectedReservedBook}>
                {books.map((book) => (
                  <option key={book.isbn} value={book.title}>{book.title}</option>
                ))}
              </select>
            </label>
            <button className="primary-action">Guardar reserva</button>
          </form>
        )}

        {kind === "confirm-reservation" && (
          <form className="form-stack" onSubmit={onConfirmReservation}>
            <label>
              Reserva pendiente
              <select name="reservation" required>
                {pendingReservations.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>{reservation.user} - {reservation.book}</option>
                ))}
              </select>
            </label>
            <button className="primary-action">Confirmar reserva</button>
          </form>
        )}

        {kind === "users" && (
          <form className="form-stack" onSubmit={onUserSubmit}>
            <label>
              Nombre
              <input name="name" required placeholder="Nombre completo" />
            </label>
            <label>
              Correo
              <input name="email" type="email" required placeholder="usuario@cuc.edu.co" />
            </label>
            <label>
              Rol
              <select name="role" required>
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <button className="primary-action">Crear usuario</button>
          </form>
        )}

        {kind === "roles" && (
          <form className="form-stack" onSubmit={onRoleSubmit}>
            <label>
              Nuevo rol
              <input name="role" required placeholder="Ej. Coordinador" />
            </label>
            <div className="tag-list">
              {roles.map((role) => (
                <span className="pill" key={role}>{role}</span>
              ))}
            </div>
            <button className="primary-action">Crear rol</button>
          </form>
        )}
      </section>
    </div>
  );
}

function ToastNotice({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>
        <Check size={18} />
      </span>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
      <button className="icon-button" onClick={onClose} title="Cerrar aviso">
        <X size={18} />
      </button>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  title,
  meta
}: {
  icon: typeof BookOpen;
  title: string;
  meta: string;
}) {
  return (
    <div className="activity-item">
      <span>
        <Icon size={18} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{meta}</p>
      </div>
    </div>
  );
}

function bookStatus(book: Book) {
  return book.copies > 0 ? "Disponible" : "Reservar";
}

function pageTitle(section: Section) {
  const titles: Record<Section, string> = {
    dashboard: "Panel principal",
    catalogo: "Catalogo de libros",
    prestamos: "Gestion de prestamos",
    reservas: "Gestion de reservas",
    reportes: "Reportes"
  };

  return titles[section];
}

function modalTitle(kind: ModalKind) {
  const titles: Record<ModalKind, string> = {
    recover: "Recuperar acceso",
    notifications: "Notificaciones",
    loan: "Registrar prestamo",
    return: "Registrar devolucion",
    reservation: "Crear reserva",
    "confirm-reservation": "Confirmar reserva",
    users: "Administrar usuarios",
    roles: "Administrar roles"
  };

  return titles[kind];
}
