"use client";

import { FormEvent, useState } from "react";
import { LogIn, X } from "lucide-react";
import { Toast } from "@/lib/library/types";
import { Brand } from "./brand";
import { ToastNotice } from "./toast-notice";

type LoginScreenProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onRecover: (email: string) => Promise<void>;
  toast: Toast | null;
  setToast: (toast: Toast | null) => void;
};

export function LoginScreen({ onLogin, onRecover, toast, setToast }: LoginScreenProps) {
  const [recoverOpen, setRecoverOpen] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await onLogin(String(data.get("email") ?? ""), String(data.get("password") ?? ""));
  };

  const handleRecover = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setRecoverOpen(false);
    await onRecover(String(data.get("email") ?? ""));
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="hero-copy">
          <Brand large />
          <h1>SGB CUC</h1>
          <p>Consulta, prestamos, reservas, multas y reportes para la biblioteca universitaria.</p>
        </div>
      </section>

      <section className="login-panel" aria-label="Inicio de sesion">
        <form className="login-box" onSubmit={handleLogin}>
          <p className="eyebrow">Acceso institucional</p>
          <h2>Iniciar sesion</h2>
          <label>
            Correo institucional
            <input name="email" type="email" required placeholder="usuario@cuc.edu.co" />
          </label>
          <label>
            Contrasena
            <input name="password" type="password" required placeholder="********" />
          </label>
          <div className="login-row">
            <label className="checkline">
              <input type="checkbox" />
              Recordar
            </label>
            <button type="button" className="link-button" onClick={() => setRecoverOpen(true)}>
              Recuperar
            </button>
          </div>
          <button
            type="button"
            className="primary-action"
            onClick={(event) => event.currentTarget.form?.requestSubmit()}
          >
            <LogIn size={18} />
            Entrar
          </button>
        </form>
      </section>

      {recoverOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <section className="modal-card">
            <div className="modal-header">
              <h2>Recuperar acceso</h2>
              <button className="icon-button" onClick={() => setRecoverOpen(false)} title="Cerrar">
                <X size={18} />
              </button>
            </div>
            <form className="form-stack" onSubmit={handleRecover}>
              <label>
                Correo institucional
                <input name="email" type="email" required placeholder="usuario@cuc.edu.co" />
              </label>
              <button className="primary-action">Enviar enlace</button>
            </form>
          </section>
        </div>
      )}

      {toast && <ToastNotice toast={toast} onClose={() => setToast(null)} />}
    </main>
  );
}
