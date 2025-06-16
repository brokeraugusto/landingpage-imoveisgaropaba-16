
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface WhatsAppMessage {
  number: string;
  message: string;
  delay?: number;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  leadSource?: string;
}

export const useEvolutionAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('evolution-api-url') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('evolution-api-key') || '');
  const [instanceName, setInstanceName] = useState(localStorage.getItem('evolution-instance') || '');

  const saveConfig = (url: string, key: string, instance: string) => {
    localStorage.setItem('evolution-api-url', url);
    localStorage.setItem('evolution-api-key', key);
    localStorage.setItem('evolution-instance', instance);
    setApiUrl(url);
    setApiKey(key);
    setInstanceName(instance);
  };

  const sendWhatsAppMessage = async (data: WhatsAppMessage) => {
    if (!apiUrl || !apiKey || !instanceName) {
      toast({
        title: "Erro de Configuração",
        description: "Configure a Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/message/sendText/${instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          number: data.number,
          textMessage: {
            text: data.message
          }
        }),
      });

      if (response.ok) {
        toast({
          title: "Mensagem Enviada",
          description: "Lead enviado via WhatsApp com sucesso!",
        });
        return true;
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      toast({
        title: "Erro no Envio",
        description: "Não foi possível enviar a mensagem via WhatsApp",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendLeadToWhatsApp = async (leadData: LeadData, realtorPhone: string) => {
    const message = `🏠 *NOVO LEAD CAPTADO*

👤 *Nome:* ${leadData.name}
📧 *Email:* ${leadData.email}
📱 *Telefone:* ${leadData.phone}
${leadData.propertyTitle ? `🏡 *Imóvel:* ${leadData.propertyTitle}` : ''}
${leadData.leadSource ? `📊 *Origem:* ${leadData.leadSource}` : ''}

💬 *Mensagem:*
${leadData.message}

⏰ *Data:* ${new Date().toLocaleString('pt-BR')}

*Entre em contato o quanto antes para maximizar a conversão!*`;

    return await sendWhatsAppMessage({
      number: realtorPhone,
      message: message
    });
  };

  return {
    isLoading,
    apiUrl,
    apiKey,
    instanceName,
    saveConfig,
    sendWhatsAppMessage,
    sendLeadToWhatsApp
  };
};
