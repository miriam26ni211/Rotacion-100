import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./HistorialAdmin.css";

export default function HistorialAdmin() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    // Función para traer pagos y bonos
    const fetchHistorial = async () => {
      const { data, error } = await supabase
        .from("pagos")
        .select(`
          monto,
          fecha_hora,
          usuario:usuarios(nombre)
        `)
        .order("fecha_hora", { ascending: false });

      if (!error && data) {
        const transformados = data.map((item) => ({
          usuario: item.usuario?.nombre || "—",
          pago: item.monto > 0 ? `$${item.monto} - ${new Date(item.fecha_hora).toLocaleString()}` : "—",
          bono: item.monto === 0 ? new Date(item.fecha_hora).toLocaleString() : "—",
        }));
        setHistorial(transformados);
      }
    };

    fetchHistorial();

    // Realtime: actualiza automáticamente cuando se inserta un pago/bono
    const channel = supabase
      .channel("public:pagos")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pagos" }, fetchHistorial)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="historial-admin">
      <h2>Historial de Bonos y Pagos</h2>
      <table className="tabla-historial">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Pagos Realizados</th>
            <th>Bonos Ganados</th>
          </tr>
        </thead>
        <tbody>
          {historial.length === 0 ? (
            <tr>
              <td colSpan="3">No hay registros todavía</td>
            </tr>
          ) : (
            historial.map((item, idx) => (
              <tr key={idx}>
                <td>{item.usuario}</td>
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



