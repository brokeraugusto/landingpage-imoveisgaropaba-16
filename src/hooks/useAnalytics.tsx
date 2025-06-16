
import { useEffect } from 'react';
import { useSettings } from './useSettings';

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  propertyId?: string;
  leadSource?: string;
}

export const useAnalytics = () => {
  const { settings } = useSettings();

  // Inicializar Google Analytics
  useEffect(() => {
    if (settings.tracking.googleAnalytics) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.tracking.googleAnalytics}`;
      script.async = true;
      document.head.appendChild(script);

      const configScript = document.createElement('script');
      configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.tracking.googleAnalytics}');
      `;
      document.head.appendChild(configScript);
    }

    // Inicializar Facebook Pixel
    if (settings.tracking.facebookPixel) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.tracking.facebookPixel}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    // Inicializar GTM
    if (settings.tracking.gtmId) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${settings.tracking.gtmId}');
      `;
      document.head.appendChild(script);
    }
  }, [settings.tracking]);

  const trackEvent = (event: AnalyticsEvent) => {
    console.log('Analytics Event:', event);
    
    // Google Analytics
    if (window.gtag && settings.tracking.googleAnalytics) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_property_id: event.propertyId,
        custom_parameter_lead_source: event.leadSource
      });
    }

    // Facebook Pixel
    if (window.fbq && settings.tracking.facebookPixel) {
      window.fbq('track', event.action, {
        content_category: event.category,
        content_name: event.label,
        value: event.value,
        property_id: event.propertyId,
        lead_source: event.leadSource
      });
    }

    // GTM (Google Tag Manager)
    if (window.dataLayer && settings.tracking.gtmId) {
      window.dataLayer.push({
        event: event.action,
        event_category: event.category,
        event_label: event.label,
        event_value: event.value,
        property_id: event.propertyId,
        lead_source: event.leadSource
      });
    }
  };

  const trackPageView = (page: string) => {
    trackEvent({
      action: 'page_view',
      category: 'engagement',
      label: page
    });
  };

  const trackPropertyView = (propertyId: string, propertyTitle: string) => {
    trackEvent({
      action: 'view_item',
      category: 'property',
      label: propertyTitle,
      propertyId: propertyId
    });
  };

  const trackLead = (leadSource: string, propertyId?: string) => {
    trackEvent({
      action: 'generate_lead',
      category: 'conversion',
      label: leadSource,
      propertyId: propertyId,
      leadSource: leadSource,
      value: 1
    });
  };

  const trackContact = (method: 'form' | 'whatsapp' | 'phone' | 'email') => {
    trackEvent({
      action: 'contact',
      category: 'engagement',
      label: method,
      value: 1
    });
  };

  const trackCalculatorUse = () => {
    trackEvent({
      action: 'use_calculator',
      category: 'engagement',
      label: 'financing_calculator',
      value: 1
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackPropertyView,
    trackLead,
    trackContact,
    trackCalculatorUse
  };
};

// Declarações para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}
