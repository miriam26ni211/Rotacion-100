// src/components/UpdatePassword.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔹 Revisar si la sesión de recuperación está disponible
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error obteniendo sesión:", error);
        setError("❌ Enlace inválido o expirado. Solicita uno nuevo.");
      }
      if (!data?.session) {
        setError("⚠️ No hay sesión activa de recuperación.");
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Tu contraseña fue actualizada con éxito.");
      setTimeout(() => {
        navigate("/"); // 👈 redirige al login o página principal
      }, 2000);
    }
  };

  return (
    <div>
      <h2>Actualizar contraseña</h2>
      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

