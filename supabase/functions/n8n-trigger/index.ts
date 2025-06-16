
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { eventType, data } = await req.json()
    console.log('N8N Trigger request:', { eventType, data })

    // Buscar webhooks ativos para este tipo de evento
    const { data: webhooks, error } = await supabaseClient
      .from('n8n_webhooks')
      .select('*')
      .eq('event_type', eventType)
      .eq('active', true)

    if (error) throw error

    // Enviar para cada webhook configurado
    const webhookPromises = webhooks.map(async (webhook) => {
      try {
        const response = await fetch(webhook.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType,
            data,
            timestamp: new Date().toISOString(),
            source: 'real-estate-system',
            webhookConfig: webhook.config
          }),
        })

        return {
          webhookId: webhook.id,
          webhookName: webhook.name,
          success: response.ok,
          status: response.status,
          statusText: response.statusText
        }
      } catch (error) {
        return {
          webhookId: webhook.id,
          webhookName: webhook.name,
          success: false,
          error: error.message
        }
      }
    })

    const results = await Promise.all(webhookPromises)
    
    console.log('Webhook results:', results)

    return new Response(
      JSON.stringify({ 
        success: true,
        webhooksTriggered: results.length,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error triggering N8N webhooks:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
