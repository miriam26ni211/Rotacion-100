
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Variables de entorno
const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const { usuario_id, monto, metodo } = await req.json();

    // Llamada a la función SQL en Supabase
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/registrar_pago_con_celebracion`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        p_usuario_id: usuario_id,
        p_monto: monto,
        p_metodo: metodo,
      }),
    });

    const data = await resp.json();

    return new Response(JSON.stringify({ ok: true, resultado: data }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
