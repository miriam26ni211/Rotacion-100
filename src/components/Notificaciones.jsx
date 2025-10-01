import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './HistorialUsuario.css';

export default function HistorialUsuario({ usuarioId }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) return;
    fetchHistorial();

    const channel = supabase
      .channel('public:historial')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'historial' },
        () => fetchHistorial()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [usuarioId]);

  const fetchHistorial = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('historial')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching historial:', error);
      setHistorial([]);
    } else {
      setHistorial(data);
    }
    setLoading(false);
  };

  return (
    <section className="historial-usuario">
      <h2>Historial del Usuario</h2>

      {loading ? (
        <p className="loading">Cargando historial…</p>
      ) : historial.length === 0 ? (
        <p className="no-data">No hay registros.</p>
      ) : (
        <ul className="historial-list">
          {historial.map((item) => (
            <li key={item.id} className="historial-item">
              <div className="historial-info">
                <span className="historial-fecha">
                  {new Date(item.created_at).toLocaleString()}
                </span>
                <span className="historial-detalle">{item.detalle}</span>
              </div>
              <button
                className="btn-eliminar"
                onClick={async () => {
                  const { error } = await supabase
                    .from('historial')
                    .delete()
                    .eq('id', item.id);
                  if (error) console.error('Error al eliminar:', error);
                  else fetchHistorial();
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


