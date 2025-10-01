// src/components/SendPasswordReset.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function SendPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password", // 👈 aquí llega el usuario tras hacer clic en el correo
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Revisa tu bandeja de entrada, hemos enviado un enlace para restablecer tu contraseña.");
    }
  };

  return (
    <div>
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar enlace</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
