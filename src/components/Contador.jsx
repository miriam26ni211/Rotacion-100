import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

export default function Contador({ usuarioId }) {
  const { t } = useTranslation();
  const [personasDelante, setPersonasDelante] = useState(0);

  useEffect(() => {
    if (!usuarioId) return;

    const fetchPersonasDelante = async () => {
      try {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('posicion')
          .eq('id', usuarioId)
          .single();

        const { count } = await supabase
          .from('usuarios')
          .select('id', { count: 'exact', head: true })
          .lt('posicion', usuario.posicion);

        setPersonasDelante(count || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPersonasDelante();

    // Suscripción v2
    const canal = supabase.channel('usuarios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, () => {
        fetchPersonasDelante();
      })
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, [usuarioId]);

  return <div className="contador">{t('personas_delante')}: {personasDelante}</div>;
}

