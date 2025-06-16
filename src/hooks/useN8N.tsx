
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface N8NWebhook {
  id?: string;
  name: string;
  webhookUrl: string;
  eventType: string;
  active: boolean;
  config?: any;
}

export interface N8NLeadData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  leadSource?: string;
  timestamp: string;
}

export const useN8N = () => {
  const [isLoading, setIsLoading] = useState(false);

  const triggerN8NWebhook = async (eventType: string, data: any) => {
    setIsLoading(true);
    try {
      // Buscar webhooks ativos para este tipo de evento
      const { data: webhooks, error } = await supabase
        .from('n8n_webhooks')
        .select('*')
        .eq('event_type', eventType)
        .eq('active', true);

      if (error) throw error;

      // Enviar para cada webhook configurado
      for (const webhook of webhooks) {
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
              source: 'real-estate-system'
            }),
          });

          if (!response.ok) {
            console.error(`Webhook ${webhook.name} failed:`, response.statusText);
          } else {
            console.log(`Webhook ${webhook.name} triggered successfully`);
          }
        } catch (webhookError) {
          console.error(`Error triggering webhook ${webhook.name}:`, webhookError);
        }
      }
    } catch (error) {
      console.error('Error triggering N8N webhooks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createWebhook = async (webhook: Omit<N8NWebhook, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('n8n_webhooks')
        .insert(webhook)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Webhook criado",
        description: "Webhook N8N configurado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast({
        title: "Erro ao criar webhook",
        description: "Verifique a configuração e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const triggerLeadWebhook = async (leadData: N8NLeadData) => {
    await triggerN8NWebhook('new_lead', leadData);
  };

  const triggerPropertyViewWebhook = async (propertyData: any) => {
    await triggerN8NWebhook('property_view', propertyData);
  };

  const triggerContactWebhook = async (contactData: any) => {
    await triggerN8NWebhook('contact_form', contactData);
  };

  return {
    isLoading,
    triggerN8NWebhook,
    createWebhook,
    triggerLeadWebhook,
    triggerPropertyViewWebhook,
    triggerContactWebhook
  };
};
