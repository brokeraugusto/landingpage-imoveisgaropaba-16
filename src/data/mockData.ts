
import { Property, SiteSettings } from '@/types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Moderno no Centro',
    description: 'Apartamento completamente renovado com vista panorâmica da cidade. Localizado no coração da cidade, próximo a restaurantes, shopping centers e transporte público.',
    price: 850000,
    location: 'Centro, São Paulo - SP',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: true,
    type: 'apartment',
    status: 'for-sale',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Casa de Luxo com Piscina',
    description: 'Casa de alto padrão em condomínio fechado, com piscina, churrasqueira e jardim amplo. Ideal para famílias que buscam conforto e segurança.',
    price: 1200000,
    location: 'Alphaville, Barueri - SP',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: [
      'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'
    ],
    featured: true,
    type: 'house',
    status: 'for-sale',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Loft Contemporâneo',
    description: 'Loft moderno em edifício industrial reformado. Conceito aberto com pé direito alto e acabamentos de primeira qualidade.',
    price: 650000,
    location: 'Vila Madalena, São Paulo - SP',
    bedrooms: 1,
    bathrooms: 1,
    area: 85,
    images: [
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop'
    ],
    featured: false,
    type: 'apartment',
    status: 'for-sale',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16')
  }
];

export const mockSiteSettings: SiteSettings = {
  companyName: 'Premium Imóveis',
  logo: '/logo.png',
  primaryColor: '#1e40af',
  secondaryColor: '#f59e0b',
  contactEmail: 'contato@premiumimoveis.com.br',
  contactPhone: '(11) 99999-9999',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  socialMedia: {
    facebook: 'https://facebook.com/premiumimoveis',
    instagram: 'https://instagram.com/premiumimoveis',
    whatsapp: 'https://wa.me/5511999999999'
  },
  tracking: {
    googleAnalytics: 'GA_MEASUREMENT_ID',
    facebookPixel: 'FACEBOOK_PIXEL_ID',
    gtmId: 'GTM-XXXXXXX'
  }
};
