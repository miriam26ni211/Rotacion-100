// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// 🌟 URL y ANON KEY de tu proyecto Supabase desde variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🌟 Creamos la instancia única de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// -----------------------------
// Funciones de autenticación
// -----------------------------

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email, redirectTo) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  return { data, error };
};

// -----------------------------
// Manejo de sesión
// -----------------------------

// Obtiene el usuario actual automáticamente
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
};

// Escucha cambios de sesión (login/logout)
export const onAuthStateChange = (callback) => {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => listener.subscription.unsubscribe();
};

// 🌟 Función de pago automática
// Llama a tu función serverless procesarPago con el usuario logueado
export const procesarPago = async (monto, metodo) => {
  const usuario = await getCurrentUser();
  if (!usuario) throw new Error("Usuario no autenticado");

  const response = await fetch(
    "https://akccnxfcldeydrewlcff.functions.supabase.co/procesarPago",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuario.id, // ✅ se usa automáticamente
        monto,
        metodo,
      }),
    }
  );
  const data = await response.json();
  return data;
};

