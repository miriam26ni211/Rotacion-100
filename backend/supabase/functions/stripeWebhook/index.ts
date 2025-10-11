// ===============================================
// ⚡ Supabase Edge Function: stripeWebhook (producción)
// ===============================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Inicializa Stripe y Supabase
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Necesita permisos de escritura
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const signingSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  let event;

  try {
    const body = await req.text();

    // 🔹 Producción: verifica la firma real de Stripe
    event = stripe.webhooks.constructEvent(body, signature!, signingSecret!);

  } catch (err) {
    console.error("⚠️ Error verificando firma de Stripe:", err.message);
    return new Response(`Firma inválida: ${err.message}`, { status: 400 });
  }

  // 📦 Solo manejar pagos exitosos
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any;
    const usuario_id = paymentIntent.metadata?.usuario_id;
    const monto = paymentIntent.amount_received / 100; // Stripe envía centavos
    const metodo = "Stripe";

    console.log(`✅ Pago confirmado de ${monto} USD para usuario ${usuario_id}`);

    if (!usuario_id) {
      console.error("❌ No se encontró usuario_id en metadata del pago.");
      return new Response("Falta usuario_id en metadata", { status: 400 });
    }

    // 🧠 Llamar a la función SQL que maneja toda la lógica
    const { data, error } = await supabase.rpc("registrar_pago_con_celebracion", {
      p_usuario_id: usuario_id,
      p_monto: monto,
      p_metodo: metodo,
    });

    if (error) {
      console.error("❌ Error al registrar pago:", error);
      return new Response("Error registrando pago en DB", { status: 500 });
    }

    console.log("🎉 Pago registrado correctamente:", data);
  }

  // Stripe exige 200 OK para confirmar recepción
  return new Response("Webhook procesado", { status: 200 });
});
