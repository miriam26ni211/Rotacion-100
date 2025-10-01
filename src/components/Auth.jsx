// src/components/Auth.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // <- usar el cliente global

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  // Detectar si hay token de recuperación en la URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token") && hash.includes("type=recovery")) {
      setMode("reset");
      const params = new URLSearchParams(hash.replace("#", ""));
      setToken(params.get("access_token"));
    }
  }, []);

  // Login
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage(error.message);
    onLogin(data.user);
  };

  // Registro
  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setMessage(error.message);
    setMessage("Usuario registrado. Revisa tu email para confirmar.");
  };

  // Reset Password
  const handleReset = async () => {
    if (!newPassword) return setMessage("Ingresa la nueva contraseña");
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return setMessage(error.message);
    setMessage("Contraseña actualizada. Puedes iniciar sesión ahora.");
    setMode("login");
    window.location.hash = ""; // limpiar hash
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>
        {mode === "login" && "Iniciar sesión"}
        {mode === "register" && "Registrarse"}
        {mode === "reset" && "Restablecer contraseña"}
      </h2>

      {mode === "reset" ? (
        <>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleReset}>Actualizar contraseña</button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === "login" && <button onClick={handleLogin}>Iniciar sesión</button>}
          {mode === "register" && <button onClick={handleRegister}>Registrarse</button>}
          <p>
            {mode === "login" ? (
              <span onClick={() => setMode("register")} style={{ cursor: "pointer", color: "blue" }}>
                Registrarse
              </span>
            ) : (
              <span onClick={() => setMode("login")} style={{ cursor: "pointer", color: "blue" }}>
                Iniciar sesión
              </span>
            )}
          </p>
          {mode !== "reset" && (
            <p>
              <span
                onClick={() => setMode("reset")}
                style={{ cursor: "pointer", color: "blue" }}
              >
                Olvidé mi contraseña
              </span>
            </p>
          )}
        </>
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
