// recoverPassword.js
// Versión rápida: usa las claves incrustadas (PRUEBA RÁPIDA)
// ⚠️ ADVERTENCIA: contiene la Service Role Key en texto plano. No subir a repositorios.

const SUPABASE_URL = "https://akccnxfcldeydrewlcff.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY2NueGZjbGRleWRyZXdsY2ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzYxNzIxNiwiZXhwIjoyMDczMTkzMjE2fQ.lolazB2np7U4LOdc_1nXfJ2cqyLkJu-554vhTJHVUjg";

// Cambia este email por la cuenta que quieres recuperar
const TARGET_EMAIL = "miriam26ni@gmail.com";

// Node 18+ tiene fetch global; si tu Node no lo tiene, instala node-fetch y require/import.
async function run() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ email: TARGET_EMAIL }),
    });

    const json = await res.json();

    // Si Supabase retorna directamente action_link o msg, lo mostramos.
    console.log("Status:", res.status);
    console.log("Respuesta completa:", JSON.stringify(json, null, 2));

    // Muchas instalaciones dev retornan action_link en la respuesta.
    if (json?.action_link) {
      console.log("\n➡️ Link de restablecimiento (úsalo en el navegador):");
      console.log(json.action_link);
    } else if (json?.msg) {
      console.log("\n➡️ Mensaje:", json.msg);
    } else {
      console.log("\n➡️ Revisa la respuesta arriba; si contiene action_link, cópialo y ábrelo en el navegador.");
    }
  } catch (err) {
    console.error("Error inesperado:", err);
  }
}

run();
