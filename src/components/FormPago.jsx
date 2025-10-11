import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import './FormPago.css';

export default function FormPago({ usuarioId }) {
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    fetchPagos();
    const channel = supabase
      .channel('public:pagos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pagos' },
        () => fetchPagos()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchPagos = async () => {
    const { data, error } = await supabase
      .from('pagos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error cargando pagos:', error.message);
      return;
    }
    setPagos(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = parseFloat(monto);

    if (!nombre || !monto) return alert(t('formPago.errorCampos'));
    if (isNaN(value) || value < 10) return alert(t('formPago.errorMonto'));

    try {
      // Llamada a tu API que crea sesión de Stripe
      const res = await fetch('/api/crearSesionStripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, monto: value, usuarioId }),
      });

      const { url, error } = await res.json();
      if (error) return alert('Error creando sesión Stripe: ' + error);

      // Redirige al checkout seguro de Stripe
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert('Error al procesar el pago');
    }
  };

  return (
    <section className="form-pago">
      <h2>{t('formPago.titulo')}</h2>

      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          {t('formPago.nombre')}:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t('formPago.nombrePlaceholder')}
          />
        </label>

        <label>
          {t('formPago.monto')}:
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder={t('formPago.montoPlaceholder')}
            step="0.01"
            min="10"
          />
        </label>

        <button type="submit">{t('formPago.boton')}</button>
      </form>

      <div className="pagos-list">
        <ul>
          {pagos.map((p) => (
            <li key={p.id}>
              {p.nombre} – ${p.monto.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


