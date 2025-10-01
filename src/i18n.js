// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      tabs: {
        lista: 'Lista dinámica',
        formpago: 'Formulario de pago',
        historialadmin: 'Historial Admin',
        historialusuario: 'Historial de usuario',
        notificaciones: 'Notificaciones',
        mensajeria: 'Mensajería',
        payout: 'Pagos'
      },
      formPago: {
        titulo: "Formulario de Pago",
        nombre: "Nombre",
        nombrePlaceholder: "Ingrese su nombre",
        monto: "Monto",
        montoPlaceholder: "10.00",
        metodo: "Método de pago",
        metodoOpciones: ["PayPal", "Zelle", "Tarjeta"],
        boton: "Pagar",
        errorCampos: "Debe completar todos los campos",
        errorMonto: "El monto debe ser un número >= 10"
      }
    }
  },
  en: {
    translation: {
      tabs: {
        lista: 'Dynamic list',
        formpago: 'Payment form',
        historialadmin: 'Admin history',
        historialusuario: 'User history',
        notificaciones: 'Notifications',
        mensajeria: 'Messaging',
        payout: 'Payout'
      },
      formPago: {
        titulo: "Payment Form",
        nombre: "Name",
        nombrePlaceholder: "Enter your name",
        monto: "Amount",
        montoPlaceholder: "10.00",
        metodo: "Payment Method",
        metodoOpciones: ["PayPal", "Zelle", "Card"],
        boton: "Pay",
        errorCampos: "All fields are required",
        errorMonto: "Amount must be a number >= 10"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  });

export default i18n;
