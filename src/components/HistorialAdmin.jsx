import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./HistorialAdmin.css";

export default function HistorialAdmin() {
  const [historial, setHistorial] = useState([]);
  const [guardandoIdx, setGuardandoIdx] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      const { data, error } = await supabase
        .from("pagos")
        .select(`
          id,
          monto,
          bono_pagado_auto,
          fecha_hora,
          metodo_pago,
          usuario:usuarios(nombre)
        `)
        .order("fecha_hora", { ascending: false });

      if (!error && data) {
        const transformados = data.map((item) => ({
          id: item.id,
          usuario: item.usuario?.nombre || "—",
          pago: item.monto > 0 ? new Date(item.fecha_hora).toLocaleString() : "—",
          bono: item.monto === 0 ? new Date(item.fecha_hora).toLocaleString() : "—",
          bonoPagado: "", // editable manualmente
          bonoPagadoAuto: item.bono_pagado_auto || "—",
        }));
        setHistorial(transformados);
      }
    };

    fetchHistorial();

    const canal = supabase
      .channel("public:pagos")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pagos" },
        fetchHistorial
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, []);

  const handleBonoPagadoChange = (idx, valor) => {
    const actualizado = [...historial];
    actualizado[idx].bonoPagado = valor;
    setHistorial(actualizado);
  };

  const guardarBonoPagado = async (idx) => {
    const item = historial[idx];
    if (!item.id) return;

    setGuardandoIdx(idx);

    const { error } = await supabase
      .from("pagos")
      .update({ bono_pagado_manual: item.bonoPagado })
      .eq("id", item.id);

    setGuardandoIdx(null);

    if (error) {
      console.error("Error guardando bono pagado:", error.message);
      alert("Error guardando, inténtalo de nuevo.");
    }
  };

  return (
    <div className="historial-admin">
      <h2>Historial de Bonos y Pagos</h2>

      <div className="tabla-container">
        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Pagos Realizados</th>
              <th>Bonos Ganados</th>
              <th>Bonos Pagados</th>
              <th>Bono Pagado Automático</th>
            </tr>
          </thead>
          <tbody>
            {historial.length === 0 ? (
              <tr>
                <td colSpan="5" className="sin-registros">
                  No hay registros todavía
                </td>
              </tr>
            ) : (
              historial.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.usuario}</td>
                  <td>{item.pago}</td>
                  <td>{item.bono}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Número o método..."
                      value={item.bonoPagado}
                      onChange={(e) => handleBonoPagadoChange(idx, e.target.value)}
                      onBlur={() => guardarBonoPagado(idx)}
                      onKeyDown={(e) => e.key === "Enter" && guardarBonoPagado(idx)}
                      className="input-bono"
                    />
                    {guardandoIdx === idx && <span className="guardando">Guardando...</span>}
                  </td>
                  <td>{item.bonoPagadoAuto}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
