
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: string;
  variables: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useMessageTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['message-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(template => ({
        id: template.id,
        name: template.name,
        content: template.content,
        type: template.type,
        variables: template.variables || [],
        active: template.active,
        createdAt: new Date(template.created_at),
        updatedAt: new Date(template.updated_at)
      })) as MessageTemplate[];
    }
  });

  const processTemplate = (template: MessageTemplate, variables: Record<string, string>) => {
    let processedContent = template.content;
    
    template.variables.forEach(variable => {
      const value = variables[variable] || '';
      processedContent = processedContent.replace(
        new RegExp(`{{${variable}}}`, 'g'),
        value
      );
    });
    
    return processedContent;
  };

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('message_templates')
        .insert({
          name: template.name,
          content: template.content,
          type: template.type,
          variables: template.variables,
          active: template.active
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
    }
  });

  return {
    templates,
    isLoading,
    processTemplate,
    createTemplate
  };
};
