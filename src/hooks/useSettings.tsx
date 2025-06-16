
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types/property';

const defaultSettings: SiteSettings = {
  companyName: 'Premium Imóveis',
  logo: '',
  primaryColor: '#1e40af',
  secondaryColor: '#eab308',
  contactEmail: 'contato@premiumimoveis.com.br',
  contactPhone: '(11) 99999-9999',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  socialMedia: {
    facebook: '',
    instagram: '',
    whatsapp: ''
  },
  tracking: {
    googleAnalytics: '',
    facebookPixel: '',
    gtmId: ''
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('site-settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = (newSettings: SiteSettings) => {
    try {
      localStorage.setItem('site-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    const newSettings = { ...settings, ...updates };
    return saveSettings(newSettings);
  };

  return {
    settings,
    loading,
    saveSettings,
    updateSettings
  };
};
