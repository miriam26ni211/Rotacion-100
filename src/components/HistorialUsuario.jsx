import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./HistorialUsuario.css";

export default function HistorialUsuario({ usuarioId, idioma = "es" }) {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      const { data, error } = await supabase
        .from("pagos")
        .select(`
          monto,
          fecha_hora
        `)
        .eq("usuario_id", usuarioId)
        .order("fecha_hora", { ascending: false });

      if (!error && data) {
        const transformados = data.map((item) => ({
          pago: item.monto > 0 ? `$${item.monto} - ${new Date(item.fecha_hora).toLocaleString()}` : "—",
          bono: item.monto === 0 ? new Date(item.fecha_hora).toLocaleString() : "—",
        }));
        setHistorial(transformados);
      }
    };

    fetchHistorial();

    const channel = supabase
      .channel("public:pagos")
      .on("postgres_changes", { event: "*", schema: "public", table: "pagos" }, fetchHistorial)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [usuarioId]);

  return (
    <div className="historial-usuario">
      <h2>Historial de Bonos y Pagos</h2>
      <table className="tabla-historial">
        <thead>
          <tr>
            <th>Pagos Realizados</th>
            <th>Bonos Ganados</th>
          </tr>
        </thead>
        <tbody>
          {historial.length === 0 ? (
            <tr>
              <td colSpan="2">No hay registros todavía</td>
            </tr>
          ) : (
            historial.map((item, idx) => (
              <tr key={idx}>
                <td>{item.pago}</td>
                <td>{item.bono}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
