"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, CalendarClock, ClipboardList } from "lucide-react";
import { libraryApi } from "@/lib/library/api";
import {
  initialActivity,
  initialBooks,
  initialLoans,
  initialReservations,
  initialRoles,
  initialUsers
} from "@/lib/library/mock-data";
import { makeLocalId } from "@/lib/library/utils";
import { Book, Loan, Metric, Reservation, Role, Section, Toast, User } from "@/lib/library/types";

export function useLibraryData() {
  const [isRemote, setIsRemote] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [section, setSection] = useState<Section>("dashboard");
  const [query, setQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("Todos");
  const [toast, setToast] = useState<Toast | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [activity, setActivity] = useState(initialActivity);

  const showToast = (title: string, message: string) => setToast({ title, message });
  const addActivity = (message: string) => setActivity((current) => [message, ...current].slice(0, 5));

  const refresh = useCallback(async () => {
    try {
      const [remoteBooks, remoteUsers, remoteRoles, remoteLoans, remoteReservations] = await Promise.all([
        libraryApi.books(),
        libraryApi.users(),
        libraryApi.roles(),
        libraryApi.loans(),
        libraryApi.reservations()
      ]);

      setBooks(remoteBooks);
      setUsers(remoteUsers);
      setRoles(remoteRoles);
      setLoans(remoteLoans);
      setReservations(remoteReservations);
      setIsRemote(true);
    } catch {
      setIsRemote(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refresh]);

  const activeLoans = loans.filter((loan) => loan.state !== "Devuelto");
  const pendingReservations = reservations.filter((reservation) => reservation.state !== "Confirmada");

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return books.filter((book) => {
      const status = book.copies > 0 ? "Disponible" : "Reservar";
      const matchesQuery =
        !normalized ||
        [book.title, book.author, book.isbn, book.category].some((value) => value.toLowerCase().includes(normalized));
      const matchesFilter = availabilityFilter === "Todos" || status === availabilityFilter || (availabilityFilter === "Prestado" && book.copies === 0);

      return matchesQuery && matchesFilter;
    });
  }, [availabilityFilter, books, query]);

  const metrics: Metric[] = [
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

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      showToast("Acceso rechazado", "Ingresa correo y contrasena institucional.");
      return;
    }

    try {
      const { user } = await libraryApi.login(email, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setSection("dashboard");
      await refresh();
    } catch {
      setCurrentUser(null);
      setIsLoggedIn(false);
      showToast("Acceso rechazado", "El usuario no existe o la contrasena es incorrecta.");
    }
  };

  const recover = async (email: string) => {
    if (isRemote) {
      await libraryApi.recover(email);
    }

    showToast("Recuperacion enviada", `Se envio el enlace de recuperacion a ${email}.`);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSection("dashboard");
  };

  const createLoan = async (userName: string, bookTitle: string, due: string) => {
    const book = books.find((item) => item.title === bookTitle);
    const user = users.find((item) => item.name === userName) ?? users[0];

    if (!book || book.copies < 1 || !userName || !due) return;

    if (isRemote && book.id && user?.id) {
      await libraryApi.createLoan(user.id, book.id, due);
      await refresh();
    } else {
      setBooks((current) => current.map((item) => (item.title === bookTitle ? { ...item, copies: item.copies - 1 } : item)));
      setLoans((current) => [{ id: makeLocalId(), user: userName, book: bookTitle, due, state: "Activo" }, ...current]);
    }

    addActivity(`${userName} retiro ${bookTitle}`);
    setSection("prestamos");
    showToast("Prestamo registrado", `${bookTitle} quedo prestado a ${userName}.`);
  };

  const returnLoan = async (loanId: string | number) => {
    const loan = loans.find((item) => String(item.id) === String(loanId));
    if (!loan) return;

    if (isRemote) {
      await libraryApi.returnLoan(loanId);
      await refresh();
    } else {
      setLoans((current) => current.map((item) => (String(item.id) === String(loanId) ? { ...item, state: "Devuelto" } : item)));
      setBooks((current) => current.map((item) => (item.title === loan.book ? { ...item, copies: item.copies + 1 } : item)));
    }

    addActivity(`${loan.user} devolvio ${loan.book}`);
    setSection("prestamos");
    showToast("Devolucion registrada", `${loan.book} volvio al catalogo disponible.`);
  };

  const createReservation = async (userName: string, bookTitle: string) => {
    const book = books.find((item) => item.title === bookTitle);
    const user = users.find((item) => item.name === userName) ?? users[0];
    if (!book || !userName) return;

    const position = reservations.filter((reservation) => reservation.book === bookTitle && reservation.state !== "Cancelada").length + 1;

    if (isRemote && book.id && user?.id) {
      await libraryApi.createReservation(user.id, book.id);
      await refresh();
    } else {
      setReservations((current) => [
        { id: makeLocalId(), user: userName, book: bookTitle, position, state: position === 1 ? "Pendiente" : "En espera" },
        ...current
      ]);
    }

    addActivity(`${userName} reservo ${bookTitle}`);
    setSection("reservas");
    showToast("Reserva creada", `${userName} quedo en turno #${position} para ${bookTitle}.`);
  };

  const confirmReservation = async (reservationId: string | number) => {
    const reservation = reservations.find((item) => String(item.id) === String(reservationId));
    if (!reservation) return;

    if (isRemote) {
      await libraryApi.confirmReservation(reservationId);
      await refresh();
    } else {
      setReservations((current) =>
        current.map((item) => (String(item.id) === String(reservationId) ? { ...item, state: "Confirmada" } : item))
      );
    }

    addActivity(`${reservation.user} confirmo la reserva de ${reservation.book}`);
    setSection("reservas");
    showToast("Reserva confirmada", `${reservation.book} quedo confirmado para ${reservation.user}.`);
  };

  const createUser = async (name: string, email: string, roleName: string, password?: string) => {
    const role = roles.find((item) => item.name === roleName);
    if (!name || !email || !roleName) return;

    if (isRemote && role?.id) {
      await libraryApi.createUser(name, email, role.id, password);
      await refresh();
    } else {
      setUsers((current) => [{ name, email, role: roleName }, ...current]);
    }

    addActivity(`${name} fue registrado como ${roleName}`);
    showToast("Usuario creado", `${name} quedo disponible para prestamos, reservas e inicio de sesion.`);
  };

  const createRole = async (roleName: string) => {
    if (!roleName || roles.some((role) => role.name === roleName)) return;

    if (isRemote) {
      await libraryApi.createRole(roleName);
      await refresh();
    } else {
      setRoles((current) => [...current, { name: roleName }]);
    }

    addActivity(`Rol ${roleName} agregado`);
    showToast("Rol creado", `${roleName} quedo disponible para nuevos usuarios.`);
  };

  const updateUserPassword = async (userId: string, password: string) => {
    const user = users.find((item) => item.id === userId);

    if (!userId || !password || password.length < 6) {
      showToast("Contrasena no actualizada", "La contrasena debe tener minimo 6 caracteres.");
      return;
    }

    if (!isRemote) {
      showToast("Modo demo", "Conecta Supabase para cambiar contrasenas reales.");
      return;
    }

    await libraryApi.updateUserPassword(userId, password);
    showToast("Contrasena actualizada", `${user?.name ?? "El usuario"} ya puede iniciar sesion con la nueva contrasena.`);
  };

  return {
    activeLoans,
    activity,
    availabilityFilter,
    books,
    confirmReservation,
    createLoan,
    createReservation,
    createRole,
    createUser,
    currentUser,
    filteredBooks,
    isLoggedIn,
    isRemote,
    login,
    logout,
    metrics,
    pendingReservations,
    query,
    recover,
    refresh,
    reservations,
    returnLoan,
    roles,
    section,
    setAvailabilityFilter,
    setIsLoggedIn,
    setQuery,
    setSection,
    setToast,
    toast,
    updateUserPassword,
    users,
    loans
  };
}
