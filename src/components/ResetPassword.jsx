// src/components/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSearchParams } from "react-router-dom"; // si usas react-router

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // ⚡ Obtener token del query param
  const accessToken = searchParams.get("access_token");

  const handleReset = async () => {
    if (!newPassword) return setMessage("Ingresa la nueva contraseña");
    if (!accessToken) return setMessage("Token inválido o faltante");

    setMessage("");
    const { data, error } = await supabase.auth.updateUser(
      { password: newPassword },
      { access_token: accessToken }
    );

    if (error) return setMessage(error.message);
    setMessage("Contraseña actualizada correctamente ✅");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Actualizar contraseña</h2>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleReset} style={{ width: "100%" }}>
        Actualizar
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
