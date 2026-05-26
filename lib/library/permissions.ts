import { ModalKind, Section, User } from "./types";

export type PermissionSet = {
  canCreateLoans: boolean;
  canReturnLoans: boolean;
  canCreateReservations: boolean;
  canConfirmReservations: boolean;
  canManageBooks: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canViewReports: boolean;
};

const basePermissions: PermissionSet = {
  canCreateLoans: false,
  canReturnLoans: false,
  canCreateReservations: false,
  canConfirmReservations: false,
  canManageBooks: false,
  canManageUsers: false,
  canManageRoles: false,
  canViewReports: false
};

export function roleName(user: User | null) {
  return user?.role ?? "Sin sesion";
}

export function permissionsFor(user: User | null): PermissionSet {
  switch (roleName(user)) {
    case "Administrador":
      return {
        canCreateLoans: true,
        canReturnLoans: true,
        canCreateReservations: true,
        canConfirmReservations: true,
        canManageBooks: true,
        canManageUsers: true,
        canManageRoles: true,
        canViewReports: true
      };
    case "Bibliotecario":
      return {
        ...basePermissions,
        canCreateLoans: true,
        canReturnLoans: true,
        canCreateReservations: true,
        canConfirmReservations: true,
        canManageBooks: true,
        canManageUsers: true,
        canViewReports: true
      };
    case "Directivo":
      return {
        ...basePermissions,
        canViewReports: true
      };
    case "Estudiante":
      return {
        ...basePermissions,
        canCreateReservations: true
      };
    default:
      return basePermissions;
  }
}

export function sectionsFor(user: User | null): Section[] {
  const permissions = permissionsFor(user);
  const sections: Section[] = ["dashboard", "catalogo"];

  if (permissions.canCreateLoans || permissions.canReturnLoans) {
    sections.push("prestamos");
  }

  if (permissions.canCreateReservations || permissions.canConfirmReservations) {
    sections.push("reservas");
  }

  if (permissions.canViewReports) {
    sections.push("reportes");
  }

  return sections;
}

export function canOpenModal(kind: ModalKind, permissions: PermissionSet) {
  const access: Record<ModalKind, boolean> = {
    recover: true,
    notifications: true,
    loan: permissions.canCreateLoans,
    return: permissions.canReturnLoans,
    reservation: permissions.canCreateReservations,
    "confirm-reservation": permissions.canConfirmReservations,
    book: permissions.canManageBooks,
    users: permissions.canManageUsers,
    roles: permissions.canManageRoles
  };

  return access[kind];
}
