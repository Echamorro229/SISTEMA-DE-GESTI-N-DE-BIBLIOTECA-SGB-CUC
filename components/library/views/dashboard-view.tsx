import { BookOpen, CalendarClock, CheckCircle2, ClipboardList, Clock3, RefreshCw, UserCog, Users } from "lucide-react";
import { PermissionSet } from "@/lib/library/permissions";
import { Metric, ModalKind, Section } from "@/lib/library/types";
import { ActivityItem } from "../activity-item";

type DashboardViewProps = {
  metrics: Metric[];
  activity: string[];
  setSection: (section: Section) => void;
  openModal: (kind: ModalKind) => void;
  permissions: PermissionSet;
};

export function DashboardView({ metrics, activity, setSection, openModal, permissions }: DashboardViewProps) {
  return (
    <div className="page-stack">
      <section className="stats-grid">
        {metrics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="metric-card" key={stat.label}>
              <Icon size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </article>
          );
        })}
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="panel-header">
            <h2>Actividad reciente</h2>
            {permissions.canViewReports && (
              <button className="ghost-button" onClick={() => setSection("reportes")}>
                <RefreshCw size={17} />
                Ver reportes
              </button>
            )}
          </div>
          {activity.map((item, index) => (
            <ActivityItem
              key={`${item}-${index}`}
              icon={index === 0 ? CheckCircle2 : index === 1 ? Clock3 : CalendarClock}
              title={index === 0 ? "Ultima accion" : "Movimiento"}
              meta={item}
            />
          ))}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Accesos rapidos</h2>
          </div>
          <div className="quick-grid">
            {permissions.canCreateLoans && <button onClick={() => openModal("loan")}><BookOpen size={20} /> Nuevo prestamo</button>}
            {permissions.canReturnLoans && <button onClick={() => openModal("return")}><ClipboardList size={20} /> Registrar devolucion</button>}
            {permissions.canCreateReservations && <button onClick={() => openModal("reservation")}><CalendarClock size={20} /> Nueva reserva</button>}
            {permissions.canManageUsers && <button onClick={() => openModal("users")}><Users size={20} /> Usuarios</button>}
            {permissions.canManageRoles && <button onClick={() => openModal("roles")}><UserCog size={20} /> Roles</button>}
          </div>
        </div>
      </section>
    </div>
  );
}
