import { expect, test } from "@playwright/test";

test.describe("button behaviors", () => {
  test("desktop buttons perform local frontend actions", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop flow is covered only in the desktop project.");

    await page.goto("/");

    await page.getByRole("button", { name: "Recuperar" }).click();
    await expect(page.getByRole("dialog")).toContainText("Recuperar acceso");
    await page.getByRole("dialog").getByPlaceholder("usuario@cuc.edu.co").fill("edinson@cuc.edu.co");
    await page.getByRole("button", { name: "Enviar enlace" }).click();
    await expect(page.getByRole("status")).toContainText("Recuperacion enviada");

    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("heading", { name: "Panel principal" })).toBeVisible();

    await page.getByTitle("Notificaciones").click();
    await expect(page.getByRole("dialog")).toContainText("Reservas pendientes");
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();

    await page.getByRole("button", { name: /Nuevo prestamo/ }).click();
    await expect(page.getByRole("dialog")).toContainText("Registrar prestamo");
    await page.getByLabel("Usuario").fill("Usuario Prueba Prestamo");
    await page.getByRole("button", { name: "Guardar prestamo" }).click();
    await expect(page.getByRole("heading", { name: "Gestion de prestamos" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Usuario Prueba Prestamo" })).toBeVisible();

    await page.getByRole("button", { name: "Registrar devolucion" }).click();
    await expect(page.getByRole("dialog")).toContainText("Registrar devolucion");
    await page.getByRole("dialog").getByRole("button", { name: "Registrar devolucion" }).click();
    await expect(page.getByText("Devuelto").first()).toBeVisible();

    await page.getByRole("button", { name: "Panel" }).click();
    await page.getByRole("button", { name: /Usuarios/ }).click();
    await expect(page.getByRole("dialog")).toContainText("Administrar usuarios");
    await page.getByLabel("Nombre").fill("Nuevo Usuario CUC");
    await page.getByLabel("Correo").fill("nuevo.usuario@cuc.edu.co");
    await page.getByRole("button", { name: "Crear usuario" }).click();
    await expect(page.getByRole("status")).toContainText("Usuario creado");

    await page.getByRole("button", { name: /Roles/ }).click();
    await expect(page.getByRole("dialog")).toContainText("Administrar roles");
    await page.getByLabel("Nuevo rol").fill("Coordinador");
    await page.getByRole("button", { name: "Crear rol" }).click();
    await expect(page.getByRole("status")).toContainText("Rol creado");

    await page.getByRole("button", { name: "Catalogo" }).click();
    await expect(page.getByRole("heading", { name: "Catalogo de libros" })).toBeVisible();
    await page.getByPlaceholder("Buscar por titulo, autor, ISBN o categoria").fill("clean");
    await expect(page.getByRole("heading", { name: "Clean Code" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ingenieria de Software" })).toHaveCount(0);

    await page.getByLabel("Filtro de disponibilidad").selectOption("Reservar");
    await page.getByRole("button", { name: "Reservar" }).click();
    await expect(page.getByRole("dialog")).toContainText("Crear reserva");
    await page.getByLabel("Usuario").fill("Usuario Reserva");
    await page.getByRole("button", { name: "Guardar reserva" }).click();
    await expect(page.getByRole("heading", { name: "Gestion de reservas" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Usuario Reserva" })).toBeVisible();

    await page.getByRole("button", { name: "Confirmar reserva" }).click();
    await expect(page.getByRole("dialog")).toContainText("Confirmar reserva");
    await page.getByRole("dialog").getByRole("button", { name: "Confirmar reserva" }).click();
    await expect(page.getByText("Confirmada").first()).toBeVisible();

    await page.getByRole("button", { name: "Reportes" }).click();
    await expect(page.getByRole("heading", { name: "Reportes" })).toBeVisible();
    await expect(page.getByText("Usuarios registrados")).toBeVisible();

    await page.getByTitle("Cerrar sesion").click();
    await expect(page.getByRole("heading", { name: "Iniciar sesion" })).toBeVisible();
  });

  test("mobile menu opens, closes and navigates", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile menu is covered only in the mobile project.");

    await page.goto("/");
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.getByTitle("Abrir menu").click();
    await page.getByRole("button", { name: "Catalogo" }).click();

    await expect(page.getByRole("heading", { name: "Catalogo de libros" })).toBeVisible();
  });
});
