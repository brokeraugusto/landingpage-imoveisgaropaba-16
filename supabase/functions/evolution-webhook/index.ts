
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

    const webhookData = await req.json()
    console.log('Evolution API Webhook received:', webhookData)

    // Processar diferentes tipos de eventos do Evolution API
    const { event, data } = webhookData

    switch (event) {
      case 'messages.upsert':
        // Mensagem recebida ou enviada
        await handleMessage(supabaseClient, data)
        break
      
      case 'messages.update':
        // Status da mensagem atualizado
        await handleMessageUpdate(supabaseClient, data)
        break
      
      case 'qrcode.updated':
        // QR Code atualizado
        console.log('QR Code updated:', data)
        break
      
      default:
        console.log('Unhandled event type:', event)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function handleMessage(supabaseClient: any, messageData: any) {
  try {
    const { key, message, messageTimestamp } = messageData

    // Salvar mensagem no banco
    await supabaseClient
      .from('whatsapp_messages')
      .insert({
        evolution_message_id: key.id,
        phone_number: key.remoteJid.replace('@s.whatsapp.net', ''),
        message: message.conversation || message.extendedTextMessage?.text || 'Mídia recebida',
        message_type: getMessageType(message),
        direction: key.fromMe ? 'outbound' : 'inbound',
        status: 'delivered',
        media_url: await extractMediaUrl(message),
        created_at: new Date(messageTimestamp * 1000).toISOString()
      })

    console.log('Message saved successfully')
  } catch (error) {
    console.error('Error handling message:', error)
  }
}

async function handleMessageUpdate(supabaseClient: any, updateData: any) {
  try {
    const { key, update } = updateData

    // Atualizar status da mensagem
    await supabaseClient
      .from('whatsapp_messages')
      .update({
        status: update.status,
        updated_at: new Date().toISOString()
      })
      .eq('evolution_message_id', key.id)

    console.log('Message status updated successfully')
  } catch (error) {
    console.error('Error handling message update:', error)
  }
}

function getMessageType(message: any): string {
  if (message.conversation) return 'text'
  if (message.imageMessage) return 'image'
  if (message.videoMessage) return 'video'
  if (message.audioMessage) return 'audio'
  if (message.documentMessage) return 'document'
  return 'unknown'
}

async function extractMediaUrl(message: any): Promise<string | null> {
  // Em uma implementação real, você processaria e salvaria a mídia
  if (message.imageMessage) return 'image_url_placeholder'
  if (message.videoMessage) return 'video_url_placeholder'
  if (message.audioMessage) return 'audio_url_placeholder'
  if (message.documentMessage) return 'document_url_placeholder'
  return null
}
