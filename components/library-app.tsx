"use client";

import { useEffect, useMemo, useState } from "react";
import { useLibraryData } from "@/hooks/use-library-data";
import { canOpenModal, permissionsFor, sectionsFor } from "@/lib/library/permissions";
import { Book, ModalKind } from "@/lib/library/types";
import { ActionModal } from "./library/action-modal";
import { AppLayout } from "./library/layout";
import { LoginScreen } from "./library/login-screen";
import { ToastNotice } from "./library/toast-notice";
import { CatalogView } from "./library/views/catalog-view";
import { DashboardView } from "./library/views/dashboard-view";
import { LoansView } from "./library/views/loans-view";
import { ReportsView } from "./library/views/reports-view";
import { ReservationsView } from "./library/views/reservations-view";

export function LibraryApp() {
  const library = useLibraryData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { isLoggedIn, section, setSection } = library;
  const permissions = useMemo(() => permissionsFor(library.currentUser), [library.currentUser]);
  const allowedSections = useMemo(() => sectionsFor(library.currentUser), [library.currentUser]);
  const visibleReservations =
    library.currentUser?.role === "Estudiante"
      ? library.reservations.filter((reservation) => reservation.userId === library.currentUser?.id || reservation.user === library.currentUser?.name)
      : library.reservations;

  useEffect(() => {
    if (isLoggedIn && !allowedSections.includes(section)) {
      setSection("dashboard");
    }
  }, [allowedSections, isLoggedIn, section, setSection]);

  const openModal = (kind: ModalKind, book?: Book) => {
    if (!canOpenModal(kind, permissions)) {
      library.setToast({
        title: "Accion no permitida",
        message: "Tu rol no tiene permisos para esta operacion."
      });
      return;
    }

    setSelectedBook(book ?? null);
    setModal(kind);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setModal(null);
  };

  if (!library.isLoggedIn) {
    return (
      <LoginScreen
        onLogin={library.login}
        onRecover={library.recover}
        toast={library.toast}
        setToast={library.setToast}
      />
    );
  }

  return (
    <AppLayout
      section={library.section}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      setSection={library.setSection}
      openModal={openModal}
      onLogout={library.logout}
      isRemote={library.isRemote}
      currentUser={library.currentUser}
      allowedSections={allowedSections}
    >
      {library.section === "dashboard" && (
        <DashboardView
          metrics={library.metrics}
          activity={library.activity}
          setSection={library.setSection}
          openModal={openModal}
          permissions={permissions}
        />
      )}
      {library.section === "catalogo" && (
        <CatalogView
          availabilityFilter={library.availabilityFilter}
          filteredBooks={library.filteredBooks}
          query={library.query}
          setAvailabilityFilter={library.setAvailabilityFilter}
          setQuery={library.setQuery}
          openModal={openModal}
          permissions={permissions}
        />
      )}
      {library.section === "prestamos" && <LoansView loans={library.loans} openModal={openModal} />}
      {library.section === "reservas" && (
        <ReservationsView reservations={visibleReservations} openModal={openModal} />
      )}
      {library.section === "reportes" && (
        <ReportsView books={library.books} loans={library.loans} reservations={library.reservations} users={library.users} />
      )}

      {modal && (
        <ActionModal
          activeLoans={library.activeLoans}
          availableBooks={library.books.filter((book) => book.copies > 0)}
          books={library.books}
          kind={modal}
          onClose={closeModal}
          onConfirmReservation={library.confirmReservation}
          onLoanSubmit={library.createLoan}
          onRecover={library.recover}
          onReservationSubmit={library.createReservation}
          onReturnSubmit={library.returnLoan}
          onRoleSubmit={library.createRole}
          onUserSubmit={library.createUser}
          pendingReservations={library.pendingReservations}
          roles={library.roles}
          selectedBook={selectedBook}
          users={library.users}
          currentUser={library.currentUser}
          permissions={permissions}
        />
      )}

      {library.toast && <ToastNotice toast={library.toast} onClose={() => library.setToast(null)} />}
    </AppLayout>
  );
}
