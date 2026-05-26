import { Book, ModalKind } from "./types";

export function bookStatus(book: Book) {
  return book.copies > 0 ? "Disponible" : "Reservar";
}

export function modalTitle(kind: ModalKind) {
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

export function makeLocalId() {
  return Date.now();
}

