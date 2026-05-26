import { AlertTriangle, BookOpen, CalendarClock, CheckCircle2, ClipboardList, Users } from "lucide-react";
import { Book, Loan, Reservation, User } from "@/lib/library/types";

type ReportsViewProps = {
  books: Book[];
  loans: Loan[];
  reservations: Reservation[];
  users: User[];
};

type ReportMetric = {
  label: string;
  value: string;
  detail: string;
  icon: typeof BookOpen;
  tone: "blue" | "green" | "amber" | "teal";
};

export function ReportsView({ books, loans, reservations, users }: ReportsViewProps) {
  const today = new Date().toISOString().slice(0, 10);
  const activeLoans = loans.filter((loan) => loan.state !== "Devuelto");
  const overdueLoans = activeLoans.filter((loan) => loan.state === "Vencido" || loan.due < today);
  const returnedLoans = loans.filter((loan) => loan.state === "Devuelto");
  const pendingReservations = reservations.filter((reservation) => reservation.state !== "Confirmada" && reservation.state !== "Cancelada");
  const confirmedReservations = reservations.filter((reservation) => reservation.state === "Confirmada");
  const availableCopies = books.reduce((total, book) => total + book.copies, 0);
  const unavailableTitles = books.filter((book) => book.copies === 0);
  const pendingFines = overdueLoans.length * 40000;

  const metrics: ReportMetric[] = [
    {
      label: "Prestamos activos",
      value: activeLoans.length.toString(),
      detail: `${overdueLoans.length} vencidos requieren gestion`,
      icon: ClipboardList,
      tone: overdueLoans.length > 0 ? "amber" : "blue"
    },
    {
      label: "Reservas abiertas",
      value: pendingReservations.length.toString(),
      detail: `${confirmedReservations.length} reservas confirmadas`,
      icon: CalendarClock,
      tone: "teal"
    },
    {
      label: "Copias disponibles",
      value: availableCopies.toLocaleString("es-CO"),
      detail: `${unavailableTitles.length} titulos sin copias`,
      icon: BookOpen,
      tone: "green"
    },
    {
      label: "Multas estimadas",
      value: `$${pendingFines.toLocaleString("es-CO")}`,
      detail: "$40.000 por prestamo vencido",
      icon: AlertTriangle,
      tone: overdueLoans.length > 0 ? "amber" : "green"
    }
  ];

  const loanStatus = [
    { label: "Activos", value: activeLoans.length, className: "blue" },
    { label: "Vencidos", value: overdueLoans.length, className: "amber" },
    { label: "Devueltos", value: returnedLoans.length, className: "green" }
  ];
  const reservationStatus = ["Pendiente", "En espera", "Lista", "Confirmada", "Cancelada"].map((state) => ({
    label: state,
    value: reservations.filter((reservation) => reservation.state === state).length
  }));
  const roleSummary = users.reduce<Record<string, number>>((summary, user) => {
    summary[user.role] = (summary[user.role] ?? 0) + 1;
    return summary;
  }, {});
  const topLoanBooks = countBy(loans.map((loan) => loan.book)).slice(0, 5);
  const lowStockBooks = [...books].sort((a, b) => a.copies - b.copies).slice(0, 5);

  return (
    <div className="page-stack">
      <section className="report-summary-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className={`report-metric ${metric.tone}`} key={metric.label}>
              <span>
                <Icon size={20} />
              </span>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className="report-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Estado de prestamos</h2>
            <span className="report-chip">{loans.length} registros</span>
          </div>
          <StatusBars items={loanStatus} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Reservas por estado</h2>
            <span className="report-chip">{reservations.length} reservas</span>
          </div>
          <StatusBars items={reservationStatus} />
        </div>
      </section>

      <section className="report-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Libros con mayor movimiento</h2>
            <span className="report-chip">Top 5</span>
          </div>
          <ReportList
            empty="Aun no hay prestamos registrados."
            items={topLoanBooks.map((item) => ({
              title: item.label,
              meta: `${item.value} movimientos`,
              icon: BookOpen
            }))}
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Inventario critico</h2>
            <span className="report-chip">{unavailableTitles.length} agotados</span>
          </div>
          <ReportList
            empty="No hay libros en catalogo."
            items={lowStockBooks.map((book) => ({
              title: book.title,
              meta: `${book.copies} copias disponibles · ${book.category}`,
              icon: book.copies === 0 ? AlertTriangle : CheckCircle2
            }))}
          />
        </div>
      </section>

      <section className="report-grid wide-left">
        <div className="panel">
          <div className="panel-header">
            <h2>Prestamos vencidos</h2>
            <span className="report-chip">{overdueLoans.length} pendientes</span>
          </div>
          <div className="compact-table-wrap">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Libro</th>
                  <th>Vence</th>
                  <th>Multa</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.user}</td>
                    <td>{loan.book}</td>
                    <td>{loan.due}</td>
                    <td>$40.000</td>
                  </tr>
                ))}
                {overdueLoans.length === 0 && (
                  <tr>
                    <td colSpan={4}>No hay prestamos vencidos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Usuarios por rol</h2>
            <span className="report-chip">{users.length} usuarios</span>
          </div>
          <ReportList
            empty="No hay usuarios registrados."
            items={Object.entries(roleSummary).map(([role, count]) => ({
              title: role,
              meta: `${count} usuarios`,
              icon: Users
            }))}
          />
        </div>
      </section>
    </div>
  );
}

function StatusBars({ items }: { items: Array<{ label: string; value: number; className?: string }> }) {
  const total = Math.max(items.reduce((sum, item) => sum + item.value, 0), 1);

  return (
    <div className="status-bars">
      {items.map((item) => {
        const width = Math.max((item.value / total) * 100, item.value > 0 ? 8 : 0);

        return (
          <div className="status-row" key={item.label}>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <div className="status-track">
              <span className={item.className} style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReportList({
  empty,
  items
}: {
  empty: string;
  items: Array<{ title: string; meta: string; icon: typeof BookOpen }>;
}) {
  if (items.length === 0) {
    return <p className="empty-report">{empty}</p>;
  }

  return (
    <div className="report-list">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div className="report-list-item" key={`${item.title}-${item.meta}`}>
            <span>
              <Icon size={17} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.meta}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function countBy(values: string[]) {
  const summary = values.reduce<Record<string, number>>((current, value) => {
    current[value] = (current[value] ?? 0) + 1;
    return current;
  }, {});

  return Object.entries(summary)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
