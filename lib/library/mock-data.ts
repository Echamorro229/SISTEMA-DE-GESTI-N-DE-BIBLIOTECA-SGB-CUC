import { Book, Loan, Reservation, Role, User } from "./types";

export const initialBooks: Book[] = [
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

export const initialLoans: Loan[] = [
  { id: 1, user: "Laura Martinez", book: "Ingenieria de Software", due: "2026-05-08", state: "Activo" },
  { id: 2, user: "Carlos Perez", book: "Bases de Datos", due: "2026-05-03", state: "Vencido" },
  { id: 3, user: "Ana Romero", book: "Clean Code", due: "2026-05-12", state: "Activo" }
];

export const initialReservations: Reservation[] = [
  { id: 1, user: "Miguel Torres", book: "Clean Code", position: 1, state: "Pendiente" },
  { id: 2, user: "Sofia Jimenez", book: "Arquitectura de Computadores", position: 2, state: "En espera" },
  { id: 3, user: "Daniela Ruiz", book: "Diseno de Interfaces", position: 1, state: "Lista" }
];

export const initialRoles: Role[] = [
  { name: "Estudiante" },
  { name: "Bibliotecario" },
  { name: "Administrador" },
  { name: "Directivo" }
];

export const initialUsers: User[] = [
  { name: "Laura Martinez", email: "laura.martinez@cuc.edu.co", role: "Estudiante" },
  { name: "Carlos Perez", email: "carlos.perez@cuc.edu.co", role: "Estudiante" },
  { name: "Bibliotecario CUC", email: "biblioteca@cuc.edu.co", role: "Bibliotecario" }
];

export const initialActivity = [
  "Laura Martinez retiro Ingenieria de Software",
  "Carlos Perez supera la fecha limite",
  "Diseno de Interfaces disponible para retiro"
];

