import { ModalKind, Reservation } from "@/lib/library/types";
import { DataPanel } from "../data-panel";

export function ReservationsView({
  reservations,
  openModal
}: {
  reservations: Reservation[];
  openModal: (kind: ModalKind) => void;
}) {
  return (
    <DataPanel
      columns={["Usuario", "Libro", "Turno", "Estado"]}
      rows={reservations.map((reservation) => ({
        id: reservation.id,
        cells: [reservation.user, reservation.book, `#${reservation.position}`, reservation.state]
      }))}
      primaryAction="Nueva reserva"
      secondaryAction="Confirmar reserva"
      onPrimaryAction={() => openModal("reservation")}
      onSecondaryAction={() => openModal("confirm-reservation")}
    />
  );
}
