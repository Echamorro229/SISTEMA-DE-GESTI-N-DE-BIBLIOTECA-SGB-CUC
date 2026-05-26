"use client";

import { Bell, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { navItems, pageTitle } from "@/lib/library/navigation";
import { ModalKind, Section, User } from "@/lib/library/types";
import { Brand } from "./brand";

type AppLayoutProps = {
  children: React.ReactNode;
  section: Section;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSection: (section: Section) => void;
  openModal: (kind: ModalKind) => void;
  onLogout: () => void;
  isRemote: boolean;
  currentUser: User | null;
  allowedSections: Section[];
};

export function AppLayout({
  children,
  section,
  sidebarOpen,
  setSidebarOpen,
  setSection,
  openModal,
  onLogout,
  isRemote,
  currentUser,
  allowedSections
}: AppLayoutProps) {
  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <Brand />
          <div>
            <strong>SGB CUC</strong>
            <span>Biblioteca Universitaria</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Modulos principales">
          {navItems.filter((item) => allowedSections.includes(item.id)).map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={section === item.id ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setSection(item.id);
                  setSidebarOpen(false);
                }}
                title={item.label}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="role-card">
          <ShieldCheck size={20} />
          <div>
            <strong>{currentUser?.role ?? "Sin rol"}</strong>
            <span>{currentUser?.name ?? (isRemote ? "Conectado a Supabase" : "Modo demo local")}</span>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} title="Abrir menu">
            <Menu size={22} />
          </button>
          <div>
            <p className="eyebrow">Sistema de Gestion de Biblioteca</p>
            <h1>{pageTitle(section)}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" onClick={() => openModal("notifications")} title="Notificaciones">
              <Bell size={20} />
            </button>
            <button className="icon-button" onClick={onLogout} title="Cerrar sesion">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {sidebarOpen && (
          <button className="scrim" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menu">
            <X size={24} />
          </button>
        )}

        {children}
      </section>
    </main>
  );
}
