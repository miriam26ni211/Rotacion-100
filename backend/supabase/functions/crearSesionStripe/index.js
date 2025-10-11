// functions/crearSesionStripe/index.js
import Stripe from 'stripe';
import { serve } from 'https://deno.land/x/sift/mod.ts';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2025-08-14',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

serve(async (req) => {
  try {
    const { nombre, monto, usuarioId } = await req.json();

    if (!nombre || !monto || !usuarioId) {
      return new Response(JSON.stringify({ error: 'Campos incompletos' }), { status: 400 });
    }

    // 🚫 Verificación de monto mínimo
    if (monto < 10) {
      return new Response(
        JSON.stringify({ error: 'El monto mínimo permitido es $10 USD.' }),
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Donación de ${nombre}` },
            unit_amount: Math.round(monto * 100), // en centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${Deno.env.get('FRONTEND_URL')}/gracias`,
      cancel_url: `${Deno.env.get('FRONTEND_URL')}/cancelado`,
      metadata: { usuario_id: usuarioId, nombre, monto: monto.toString() }, // 👈 corregido
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

