import { BookOpen, Search } from "lucide-react";
import { PermissionSet } from "@/lib/library/permissions";
import { Book, ModalKind } from "@/lib/library/types";
import { bookStatus } from "@/lib/library/utils";

type CatalogViewProps = {
  availabilityFilter: string;
  filteredBooks: Book[];
  query: string;
  setAvailabilityFilter: (value: string) => void;
  setQuery: (value: string) => void;
  openModal: (kind: ModalKind, book?: Book) => void;
  permissions: PermissionSet;
};

export function CatalogView({
  availabilityFilter,
  filteredBooks,
  query,
  setAvailabilityFilter,
  setQuery,
  openModal,
  permissions
}: CatalogViewProps) {
  return (
    <div className="page-stack">
      <section className="toolbar">
        <div className="searchbox">
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por titulo, autor, ISBN o categoria"
          />
        </div>
        <select
          aria-label="Filtro de disponibilidad"
          value={availabilityFilter}
          onChange={(event) => setAvailabilityFilter(event.target.value)}
        >
          <option>Todos</option>
          <option>Disponible</option>
          <option>Prestado</option>
          <option>Reservar</option>
        </select>
      </section>

      <section className="book-grid">
        {filteredBooks.map((book) => {
          const status = bookStatus(book);

          return (
            <article className="book-card" key={book.isbn}>
              <div className="book-cover">
                <BookOpen size={34} />
              </div>
              <div className="book-info">
                <span className="pill">{book.category}</span>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <small>ISBN {book.isbn}</small>
                <small>{book.copies} copias disponibles</small>
                <div className="book-actions">
                  <span className={book.copies > 0 ? "status available" : "status unavailable"}>
                    {status}
                  </span>
                  {permissions.canCreateLoans && book.copies > 0 && (
                    <button onClick={() => openModal("loan", book)}>Prestar</button>
                  )}
                  {(!permissions.canCreateLoans || book.copies === 0) && permissions.canCreateReservations && (
                    <button onClick={() => openModal("reservation", book)}>Reservar</button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
