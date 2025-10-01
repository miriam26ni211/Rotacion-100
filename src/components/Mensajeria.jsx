 import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

export default function Mensajeria({ usuarioId }) {
  const { t } = useTranslation();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  useEffect(() => {
    const fetchMensajes = async () => {
      const { data } = await supabase
        .from('mensajes')
        .select('*')
        .order('fecha_hora', { ascending: true });
      setMensajes(data || []);
    };
    fetchMensajes();

    const canal = supabase.channel('mensajeria')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, (payload) => {
        if (!payload.new.usuario_id || payload.new.usuario_id === usuarioId) {
          setMensajes(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, [usuarioId]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje) return;
    await supabase.from('mensajes').insert([{ usuario_id: usuarioId, mensaje: nuevoMensaje }]);
    setNuevoMensaje('');
  };

  return (
    <div className="mensajeria">
      <h3>{t('mensajeria')}</h3>
      <div className="mensajes-lista" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {mensajes.map(m => <div key={m.id}>{m.mensaje}</div>)}
      </div>
      <div className="nuevo-mensaje" style={{ marginTop: '10px' }}>
        <input type="text" value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} placeholder={t('escribe_mensaje')} />
        <button onClick={enviarMensaje}>{t('enviar')}</button>
      </div>
    </div>
  );
}
