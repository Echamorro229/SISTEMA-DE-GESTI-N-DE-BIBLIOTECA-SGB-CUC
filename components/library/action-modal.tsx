"use client";

import { FormEvent } from "react";
import { AlertTriangle, CalendarClock, Users, X } from "lucide-react";
import { PermissionSet } from "@/lib/library/permissions";
import { Book, Loan, ModalKind, Reservation, Role, User } from "@/lib/library/types";
import { modalTitle } from "@/lib/library/utils";
import { ActivityItem } from "./activity-item";

type ActionModalProps = {
  activeLoans: Loan[];
  availableBooks: Book[];
  books: Book[];
  kind: ModalKind;
  onClose: () => void;
  onBookSubmit: (book: Omit<Book, "id">) => Promise<void>;
  onConfirmReservation: (reservationId: string | number) => Promise<void>;
  onLoanSubmit: (user: string, book: string, due: string) => Promise<void>;
  onRecover: (email: string) => Promise<void>;
  onReservationSubmit: (user: string, book: string) => Promise<void>;
  onReturnSubmit: (loanId: string | number) => Promise<void>;
  onRoleSubmit: (role: string) => Promise<void>;
  onUserSubmit: (name: string, email: string, role: string, password?: string) => Promise<void>;
  onUserPasswordSubmit: (userId: string, password: string) => Promise<void>;
  pendingReservations: Reservation[];
  roles: Role[];
  selectedBook: Book | null;
  users: User[];
  currentUser: User | null;
  permissions: PermissionSet;
};

export function ActionModal({
  activeLoans,
  availableBooks,
  books,
  kind,
  onClose,
  onBookSubmit,
  onConfirmReservation,
  onLoanSubmit,
  onRecover,
  onReservationSubmit,
  onReturnSubmit,
  onRoleSubmit,
  onUserSubmit,
  onUserPasswordSubmit,
  pendingReservations,
  roles,
  selectedBook,
  users,
  currentUser,
  permissions
}: ActionModalProps) {
  const selectedAvailableBook = selectedBook && selectedBook.copies > 0 ? selectedBook.title : availableBooks[0]?.title;
  const selectedReservedBook = selectedBook ? selectedBook.title : books.find((book) => book.copies === 0)?.title ?? books[0]?.title;
  const reservationUser = permissions.canConfirmReservations ? users[0]?.name : currentUser?.name;

  const handle = (action: (data: FormData) => Promise<void>) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await action(new FormData(event.currentTarget));
    onClose();
  };

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
          <form className="form-stack" onSubmit={handle((data) => onRecover(String(data.get("email") ?? "")))}>
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
          <form
            className="form-stack"
            onSubmit={handle((data) =>
              onLoanSubmit(String(data.get("user") ?? "").trim(), String(data.get("book") ?? ""), String(data.get("due") ?? ""))
            )}
          >
            <label>
              Usuario
              <select name="user" required defaultValue={users[0]?.name}>
                {users.map((user) => (
                  <option key={user.email} value={user.name}>{user.name}</option>
                ))}
              </select>
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

        {kind === "book" && (
          <form
            className="form-stack"
            onSubmit={handle((data) =>
              onBookSubmit({
                title: String(data.get("title") ?? ""),
                author: String(data.get("author") ?? ""),
                isbn: String(data.get("isbn") ?? ""),
                category: String(data.get("category") ?? ""),
                copies: Number(data.get("copies") ?? 0)
              })
            )}
          >
            <label>
              Titulo
              <input name="title" required placeholder="Titulo del libro" />
            </label>
            <label>
              Autor
              <input name="author" required placeholder="Autor" />
            </label>
            <label>
              ISBN
              <input name="isbn" required placeholder="978-000-000000-0" />
            </label>
            <label>
              Categoria
              <input name="category" required placeholder="Ej. Sistemas" />
            </label>
            <label>
              Copias disponibles
              <input name="copies" type="number" min={0} required defaultValue={1} />
            </label>
            <button className="primary-action">Guardar libro</button>
          </form>
        )}

        {kind === "return" && (
          <form className="form-stack" onSubmit={handle((data) => onReturnSubmit(String(data.get("loan") ?? "")))}>
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
          <form
            className="form-stack"
            onSubmit={handle((data) => onReservationSubmit(String(data.get("user") ?? "").trim(), String(data.get("book") ?? "")))}
          >
            <label>
              Usuario
              {permissions.canConfirmReservations ? (
                <select name="user" required defaultValue={reservationUser}>
                  {users.map((user) => (
                    <option key={user.email} value={user.name}>{user.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  name="user"
                  readOnly
                  required
                  defaultValue={reservationUser}
                  placeholder="Nombre del usuario"
                />
              )}
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
          <form className="form-stack" onSubmit={handle((data) => onConfirmReservation(String(data.get("reservation") ?? "")))}>
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
          <div className="form-sections">
            <form
              className="form-stack"
              onSubmit={handle((data) =>
                onUserSubmit(
                  String(data.get("name") ?? "").trim(),
                  String(data.get("email") ?? "").trim(),
                  String(data.get("role") ?? ""),
                  String(data.get("password") ?? "")
                )
              )}
            >
              <h3>Crear usuario</h3>
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
                    <option key={role.name}>{role.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Contrasena inicial
                <input name="password" type="password" minLength={6} placeholder="Minimo 6 caracteres" />
              </label>
              <button className="primary-action">Crear usuario</button>
            </form>

            <form
              className="form-stack"
              onSubmit={handle((data) =>
                onUserPasswordSubmit(String(data.get("userId") ?? ""), String(data.get("newPassword") ?? ""))
              )}
            >
              <h3>Cambiar contrasena</h3>
              <label>
                Usuario
                <select name="userId" required>
                  {users.filter((user) => user.id).map((user) => (
                    <option key={user.id} value={user.id}>{user.name} - {user.email}</option>
                  ))}
                </select>
              </label>
              <label>
                Nueva contrasena
                <input name="newPassword" type="password" required minLength={6} placeholder="Minimo 6 caracteres" />
              </label>
              <button className="primary-action">Actualizar contrasena</button>
            </form>
          </div>
        )}

        {kind === "roles" && (
          <form className="form-stack" onSubmit={handle((data) => onRoleSubmit(String(data.get("role") ?? "").trim()))}>
            <label>
              Nuevo rol
              <input name="role" required placeholder="Ej. Coordinador" />
            </label>
            <div className="tag-list">
              {roles.map((role) => (
                <span className="pill" key={role.name}>{role.name}</span>
              ))}
            </div>
            <button className="primary-action">Crear rol</button>
          </form>
        )}
      </section>
    </div>
  );
}
