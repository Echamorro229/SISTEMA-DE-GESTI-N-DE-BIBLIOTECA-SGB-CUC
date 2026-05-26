import { Loan, ModalKind } from "@/lib/library/types";
import { DataPanel } from "../data-panel";

export function LoansView({ loans, openModal }: { loans: Loan[]; openModal: (kind: ModalKind) => void }) {
  return (
    <DataPanel
      columns={["Usuario", "Libro", "Vence", "Estado"]}
      rows={loans.map((loan) => ({
        id: loan.id,
        cells: [loan.user, loan.book, loan.due, loan.state]
      }))}
      primaryAction="Registrar prestamo"
      secondaryAction="Registrar devolucion"
      onPrimaryAction={() => openModal("loan")}
      onSecondaryAction={() => openModal("return")}
    />
  );
}
