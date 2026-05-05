import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGB CUC",
  description: "Frontend del Sistema de Gestion de Biblioteca CUC"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
