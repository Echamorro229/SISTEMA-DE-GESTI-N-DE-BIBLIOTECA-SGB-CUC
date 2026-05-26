import { BarChart3, BookOpen, CalendarClock, ClipboardList } from "lucide-react";
import { NavItem, Section } from "./types";

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Panel", icon: BarChart3 },
  { id: "catalogo", label: "Catalogo", icon: BookOpen },
  { id: "prestamos", label: "Prestamos", icon: ClipboardList },
  { id: "reservas", label: "Reservas", icon: CalendarClock },
  { id: "reportes", label: "Reportes", icon: BarChart3 }
];

export function pageTitle(section: Section) {
  const titles: Record<Section, string> = {
    dashboard: "Panel principal",
    catalogo: "Catalogo de libros",
    prestamos: "Gestion de prestamos",
    reservas: "Gestion de reservas",
    reportes: "Reportes"
  };

  return titles[section];
}

