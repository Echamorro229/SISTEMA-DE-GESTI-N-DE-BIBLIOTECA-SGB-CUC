import { Book, Loan, Reservation, Role, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type SupabaseRelation<T> = T | T[] | null;

type RemoteBook = Book & { id: string };
type RemoteRole = { id: string; name: string };
type RemoteUser = {
  id: string;
  name: string;
  email: string;
  role?: RemoteRole;
  roles?: SupabaseRelation<RemoteRole>;
};
type RemoteLoan = {
  id: string;
  due_date: string;
  status: Loan["state"];
  users: SupabaseRelation<{ id: string; name: string }>;
  books: SupabaseRelation<{ id: string; title: string }>;
};
type RemoteReservation = {
  id: string;
  position: number;
  status: Reservation["state"];
  users: SupabaseRelation<{ id: string; name: string }>;
  books: SupabaseRelation<{ id: string; title: string }>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

function first<T>(value: SupabaseRelation<T> | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export const libraryApi = {
  health: () => request<{ ok: boolean }>("/health"),
  login: (email: string, password: string) =>
    request<{ user: RemoteUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }).then(({ user }) => {
      const role = user.role ?? first(user.roles);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: role?.name ?? "Sin rol",
          roleId: role?.id
        }
      };
    }),
  recover: (email: string) =>
    request<{ accepted: boolean; message: string }>("/auth/recover", {
      method: "POST",
      body: JSON.stringify({ email })
    }),
  books: async () => request<RemoteBook[]>("/books"),
  createBook: (book: Omit<Book, "id">) =>
    request<RemoteBook>("/books", {
      method: "POST",
      body: JSON.stringify(book)
    }),
  users: async () => {
    const users = await request<RemoteUser[]>("/users");

    return users.map<User>((user) => {
      const role = first(user.roles);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role?.name ?? "Sin rol",
        roleId: role?.id
      };
    });
  },
  roles: async () => request<Role[]>("/roles"),
  loans: async () => {
    const loans = await request<RemoteLoan[]>("/loans");

    return loans.map<Loan>((loan) => {
      const user = first(loan.users);
      const book = first(loan.books);

      return {
        id: loan.id,
        userId: user?.id,
        bookId: book?.id,
        user: user?.name ?? "Usuario no disponible",
        book: book?.title ?? "Libro no disponible",
        due: loan.due_date,
        state: loan.status
      };
    });
  },
  reservations: async () => {
    const reservations = await request<RemoteReservation[]>("/reservations");

    return reservations.map<Reservation>((reservation) => {
      const user = first(reservation.users);
      const book = first(reservation.books);

      return {
        id: reservation.id,
        userId: user?.id,
        bookId: book?.id,
        user: user?.name ?? "Usuario no disponible",
        book: book?.title ?? "Libro no disponible",
        position: reservation.position,
        state: reservation.status
      };
    });
  },
  createUser: (name: string, email: string, roleId: string, password?: string) =>
    request<RemoteUser>("/users", {
      method: "POST",
      body: JSON.stringify({ name, email, roleId, password: password || undefined })
    }),
  updateUserPassword: (id: string, password: string) =>
    request<RemoteUser>(`/users/${id}/password`, {
      method: "PATCH",
      body: JSON.stringify({ password })
    }),
  createRole: (name: string) =>
    request<Role>("/roles", {
      method: "POST",
      body: JSON.stringify({ name })
    }),
  createLoan: (userId: string, bookId: string, dueDate: string) =>
    request<Loan>("/loans", {
      method: "POST",
      body: JSON.stringify({ userId, bookId, dueDate })
    }),
  returnLoan: (loanId: string | number) =>
    request<Loan>(`/loans/${loanId}/return`, {
      method: "PATCH"
    }),
  createReservation: (userId: string, bookId: string) =>
    request<Reservation>("/reservations", {
      method: "POST",
      body: JSON.stringify({ userId, bookId })
    }),
  confirmReservation: (reservationId: string | number) =>
    request<Reservation>(`/reservations/${reservationId}/confirm`, {
      method: "PATCH"
    })
};
