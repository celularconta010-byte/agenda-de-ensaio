
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "https://esm.sh/web-push@3.6.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const vapidKeys = {
  publicKey: "BEPoMAPMzPpqD8YbbiwZkx3rVWd2i8bIe5NJ0pgLHDGk-8RLsYIu_FRGw3s0oKvHpbC_D2xZ0IeEjalqe-OJR0A",
  privateKey: "yHsxxPwUkcZt4Pyr2g0M7j7Cv4Y6J6OYib__sKptzY4"
};

webpush.setVapidDetails(
  'mailto:admin@agendadeensaio.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Verificar ensaios de hoje
    const today = new Date().toISOString().split('T')[0];
    const { data: rehearsals, error: rehearsalError } = await supabaseClient
      .from('ensaios')
      .select('*')
      .eq('rawDate', today);

    if (rehearsalError) throw rehearsalError;

    if (!rehearsals || rehearsals.length === 0) {
      return new Response(JSON.stringify({ message: 'Sem ensaios hoje.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Buscar assinaturas
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('*');

    if (subError) throw subError;

    // 3. Enviar notificações
    const results = [];
    for (const rehearsal of rehearsals) {
      const payload = JSON.stringify({
        title: `Hoje tem ensaio: ${rehearsal.churchName}`,
        body: `${rehearsal.time} em ${rehearsal.city}`,
        url: '/'
      });

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(sub.subscription, payload);
          results.push({ status: 'sent', id: sub.id });
        } catch (err) {
          console.error('Erro ao enviar push:', err);
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Assinatura inválida, remover do banco
            await supabaseClient.from('push_subscriptions').delete().eq('id', sub.id);
            results.push({ status: 'deleted', id: sub.id });
          } else {
            results.push({ status: 'error', error: err });
          }
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Processamento concluído', results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
