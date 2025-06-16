
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteSettings } from '@/types/property';
import { useEffect } from 'react';

export const useSupabaseSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        companyName: data.company_name,
        logo: data.logo || '',
        logoDark: data.logo_dark || '',
        primaryColor: data.primary_color || '#1e40af',
        secondaryColor: data.secondary_color || '#eab308',
        contactEmail: data.contact_email || '',
        contactPhone: data.contact_phone || '',
        address: data.address || '',
        socialMedia: data.social_media || {},
        tracking: data.tracking || {},
        evolutionApi: data.evolution_api || {},
        n8nConfig: data.n8n_config || {}
      } as SiteSettings & { id: string; evolutionApi: any; n8nConfig: any };
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<SiteSettings>) => {
      if (!settings?.id) throw new Error('Settings ID not found');
      
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          company_name: newSettings.companyName,
          logo: newSettings.logo,
          logo_dark: newSettings.logoDark,
          primary_color: newSettings.primaryColor,
          secondary_color: newSettings.secondaryColor,
          contact_email: newSettings.contactEmail,
          contact_phone: newSettings.contactPhone,
          address: newSettings.address,
          social_media: newSettings.socialMedia,
          tracking: newSettings.tracking,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    }
  });

  // Sync with localStorage for backward compatibility
  useEffect(() => {
    if (settings && !isLoading) {
      try {
        localStorage.setItem('site-settings', JSON.stringify({
          companyName: settings.companyName,
          logo: settings.logo,
          logoDark: settings.logoDark,
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          address: settings.address,
          socialMedia: settings.socialMedia,
          tracking: settings.tracking
        }));
      } catch (error) {
        console.error('Error syncing settings to localStorage:', error);
      }
    }
  }, [settings, isLoading]);

  return {
    settings,
    isLoading,
    updateSettings
  };
};
