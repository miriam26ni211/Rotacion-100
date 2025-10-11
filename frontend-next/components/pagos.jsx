// frontend-next/components/pagos.jsx
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase"; // tu archivo utils/supabase.js

export default function Pagos({ monto = 10.0 }) {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState(null);

  // Obtener usuario logueado al montar
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUsuario(session.user);
      }
    };
    fetchUser();
  }, []);

  const handlePago = async () => {
    setLoading(true);
    setMensaje("");

    if (!usuario) {
      setMensaje("Debes iniciar sesión para pagar.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://akccnxfcldeydrewlcff.functions.supabase.co/procesarPago",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuario.id,
            monto: monto,
            metodo: "stripe",
          }),
        }
      );

      // Revisar si hubo error HTTP
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();

      // Mostrar mensaje según respuesta de la función
      if (data === "USUARIO_100") {
        setMensaje("¡Felicidades! Llegaste a la posición 100 y ganaste el bono.");
      } else if (data?.success) {
        setMensaje("Pago realizado correctamente. Tu posición ha sido actualizada.");
      } else if (data?.error) {
        setMensaje(`Error: ${data.error}`);
      } else {
        setMensaje("Pago procesado, pero la respuesta es inesperada. Revisa logs.");
        console.log("Respuesta completa:", data);
      }
    } catch (error) {
      console.error("Error al procesar pago:", error);
      setMensaje(`Error al procesar el pago: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
      <h2>Pago de Lista Dinámica</h2>
      <p>Monto a pagar: ${monto.toFixed(2)}</p>
      <button onClick={handlePago} disabled={loading}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
      {mensaje && <p style={{ marginTop: "10px", color: mensaje.startsWith("Error") ? "red" : "green" }}>{mensaje}</p>}
    </div>
  );
}
