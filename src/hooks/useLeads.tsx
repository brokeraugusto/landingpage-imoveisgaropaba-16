
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContactForm } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { useAnalytics } from './useAnalytics';
import { useEvolutionAPI } from './useEvolutionAPI';

interface Lead extends ContactForm {
  id: string;
  leadSource?: string;
  interest?: string;
  preferredContact?: string;
  urgency?: string;
  status?: string;
  assignedTo?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const useLeads = () => {
  const queryClient = useQueryClient();
  const { trackLead } = useAnalytics();
  const { sendLeadToWhatsApp } = useEvolutionAPI();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone,
        message: lead.message || '',
        propertyId: lead.property_id,
        propertyTitle: lead.property_title,
        leadSource: lead.lead_source,
        interest: lead.interest,
        preferredContact: lead.preferred_contact,
        urgency: lead.urgency,
        status: lead.status,
        assignedTo: lead.assigned_to,
        tags: lead.tags || [],
        createdAt: new Date(lead.created_at),
        updatedAt: new Date(lead.updated_at)
      })) as Lead[];
    }
  });

  const createLead = useMutation({
    mutationFn: async (leadData: ContactForm & { leadSource?: string }) => {
      console.log('Creating lead:', leadData);
      
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          message: leadData.message,
          property_id: leadData.propertyId,
          property_title: leadData.propertyTitle || 'Contato geral',
          lead_source: leadData.leadSource || 'website',
          status: 'new'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Enviar via WhatsApp
      try {
        await sendLeadToWhatsApp({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          message: leadData.message,
          propertyId: leadData.propertyId,
          propertyTitle: leadData.propertyTitle,
          leadSource: leadData.leadSource
        }, '5511999999999'); // Número do corretor - deve vir das configurações
      } catch (whatsappError) {
        console.error('WhatsApp error:', whatsappError);
        // Não falha o lead se o WhatsApp falhar
      }

      // Tracking
      trackLead(leadData.leadSource || 'website', leadData.propertyId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead criado com sucesso!",
        description: "O lead foi salvo e enviado via WhatsApp para o corretor.",
      });
    },
    onError: (error) => {
      console.error('Create lead error:', error);
      toast({
        title: "Erro ao criar lead",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  return {
    leads,
    isLoading,
    createLead,
    updateLeadStatus
  };
};
