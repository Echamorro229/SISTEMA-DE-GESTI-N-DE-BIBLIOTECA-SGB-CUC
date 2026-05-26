import { BookOpen, Library } from "lucide-react";

export type Section = "dashboard" | "catalogo" | "prestamos" | "reservas" | "reportes";

export type ModalKind =
  | "recover"
  | "notifications"
  | "loan"
  | "return"
  | "reservation"
  | "confirm-reservation"
  | "book"
  | "users"
  | "roles";

export type Book = {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
};

export type Loan = {
  id: string | number;
  userId?: string;
  bookId?: string;
  user: string;
  book: string;
  due: string;
  state: "Activo" | "Vencido" | "Devuelto";
};

export type Reservation = {
  id: string | number;
  userId?: string;
  bookId?: string;
  user: string;
  book: string;
  position: number;
  state: "Pendiente" | "En espera" | "Lista" | "Confirmada" | "Cancelada";
};

export type Role = {
  id?: string;
  name: string;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  role: string;
  roleId?: string;
};

export type Toast = {
  title: string;
  message: string;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: typeof BookOpen;
};

export type NavItem = {
  id: Section;
  label: string;
  icon: typeof Library;
};
