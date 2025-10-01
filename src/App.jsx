import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "./supabaseClient";

// Importar CSS para los tabs
import "./style/App.css";

// Componentes
import ListaDinamica from "./components/ListaDinamica";
import FormPago from "./components/FormPago";
import HistorialAdmin from "./components/HistorialAdmin";
import HistorialUsuario from "./components/HistorialUsuario";
import Notificaciones from "./components/Notificaciones";
import Mensajeria from "./components/Mensajeria";
import Payout from "./components/Payout";
import Contador from "./components/Contador";
import Auth from "./components/Auth";
import SendPasswordReset from "./components/SendPasswordReset";
import UpdatePassword from "./components/UpdatePassword";

export default function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  const ADMIN_ID = "f804db32-f0a0-4cdf-bd29-907414c6adcf";
  const usuarioRol = user?.id === ADMIN_ID ? "admin" : "usuario";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <>
          <header className="app-header">
            <h1>{t("Bienvenido")}</h1>
            <nav className="tabs">
              <NavLink
                to="/lista"
                className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
              >
                {t("Lista Dinámica")}
              </NavLink>
              <NavLink
                to="/formpago"
                className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
              >
                {t("FormPago")}
              </NavLink>
              {usuarioRol === "admin" && (
                <NavLink
                  to="/historialadmin"
                  className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
                >
                  {t("Historial Admin")}
                </NavLink>
              )}
              <NavLink
                to="/historialusuario"
                className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
              >
                {t("Historial Usuario")}
              </NavLink>
              <NavLink
                to="/notificaciones"
                className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
              >
                {t("Notificaciones")}
              </NavLink>
              <NavLink
                to="/mensajeria"
                className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
              >
                {t("Mensajería")}
              </NavLink>
              <NavLink
                to="/payout"
                className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
              >
                {t("Payout")}
              </NavLink>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/lista" replace />} />
              <Route path="/lista" element={<ListaDinamica usuarioId={user.id} />} />
              <Route path="/formpago" element={<FormPago usuarioId={user.id} />} />
              {usuarioRol === "admin" && <Route path="/historialadmin" element={<HistorialAdmin />} />}
              <Route path="/historialusuario" element={<HistorialUsuario usuarioId={user.id} />} />
              <Route path="/notificaciones" element={<Notificaciones usuarioId={user.id} />} />
              <Route path="/mensajeria" element={<Mensajeria usuarioId={user.id} />} />
              <Route path="/payout" element={<Payout usuarioId={user.id} />} />
              <Route path="/reset-password" element={<SendPasswordReset />} />
              <Route path="/update-password" element={<UpdatePassword />} />
            </Routes>
          </main>

          <footer>
            <Contador usuarioId={user.id} />
          </footer>
        </>
      ) : (
        <Routes>
          <Route path="/reset-password" element={<SendPasswordReset />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<Auth onLogin={setUser} />} />
        </Routes>
      )}
    </>
  );
}
