export type DataRow = {
  id: string | number;
  cells: string[];
};

type DataPanelProps = {
  columns: string[];
  rows: DataRow[];
  primaryAction: string;
  secondaryAction: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

export function DataPanel({
  columns,
  rows,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction
}: DataPanelProps) {
  return (
    <section className="panel table-panel">
      <div className="panel-header">
        <h2>Seguimiento operativo</h2>
        <div className="panel-actions">
          <button className="ghost-button" onClick={onSecondaryAction}>{secondaryAction}</button>
          <button className="primary-small" onClick={onPrimaryAction}>{primaryAction}</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${columns[index]}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
