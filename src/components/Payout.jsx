import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Payout.css';

export default function Payout({ usuarioId }) {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoMonto, setNuevoMonto] = useState('');

  useEffect(() => {
    fetchPayouts();
    const channel = supabase
      .channel('public:payout')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payout' }, fetchPayouts)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [usuarioId]);

  const fetchPayouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payout')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha_hora', { ascending: false });
    if (!error) setPayouts(data);
    setLoading(false);
  };

  const handlePayout = async () => {
    if (!nuevoMonto) return alert('Ingresa un monto');
    await supabase.from('payout').insert([{ usuario_id: usuarioId, monto: parseFloat(nuevoMonto) }]);
    setNuevoMonto('');
  };

  return (
    <section className="payout-section">
      <h2>Payouts</h2>

      <div className="payout-form">
        <input
          type="number"
          value={nuevoMonto}
          onChange={(e) => setNuevoMonto(e.target.value)}
          placeholder="Monto a solicitar"
          step="0.01"
        />
        <button onClick={handlePayout}>Solicitar Payout</button>
      </div>

      <div className="payout-list">
        {loading ? <p>Cargando payouts…</p> :
          payouts.length === 0 ? <p>No hay payouts registrados</p> :
          <ul>
            {payouts.map(p => (
              <li key={p.id}>
                ${p.monto.toFixed(2)} - {new Date(p.fecha_hora).toLocaleString()}
              </li>
            ))}
          </ul>
        }
      </div>
    </section>
  );
}
