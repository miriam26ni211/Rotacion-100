// recoverPasswordEmail.js
// Prueba rápida para enviar un correo de restablecimiento usando la ANON KEY
// ⚠️ Recomendado: usar dotenv y .env en producción, no claves incrustadas.

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // si tienes .env, cargará las variables

// URL y ANON KEY: toma de env si existen, si no usa el literal (fallback para pruebas)
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://akccnxfcldeydrewlcff.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY2NueGZjbGRleWRyZXdsY2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTcyMTYsImV4cCI6MjA3MzE5MzIxNn0.dSjJG8oFfvngq_Skr03yXXus2ej8CRT6l25mBRsk3gY";

// Validación básica
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Falta SUPABASE_URL o SUPABASE_ANON_KEY (revisa .env o las variables).");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Cambia aquí el email y la URL de redirección que quieras usar.
 * redirectTo debe ser una URL válida de tu frontend donde el usuario actualizará su contraseña.
 */
const TARGET_EMAIL = "miriam26ni@gmail.com";
const REDIRECT_TO = "http://localhost:5173/update-password";

async function sendResetEmail() {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(TARGET_EMAIL, {
      redirectTo: REDIRECT_TO,
    });

    if (error) {
      console.error("❌ Error al solicitar restablecimiento:", error.message || error);
      return;
    }

    console.log("✅ Petición enviada. Respuesta completa:");
    console.log(JSON.stringify(data, null, 2));

    // Si el proyecto devuelve el action_link en la respuesta (útil cuando no hay SMTP), lo mostramos
    if (data?.action_link) {
      console.log("\n➡️ Link de restablecimiento (cópialo y pégalo en el navegador):");
      console.log(data.action_link);
    } else {
      console.log("\n➡️ Si no aparece action_link, revisa tu bandeja de entrada (o carpeta SPAM).");
    }
  } catch (err) {
    console.error("❌ Error inesperado:", err);
  }
}

sendResetEmail();
