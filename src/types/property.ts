
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  video?: string;
  featured: boolean;
  type: 'apartment' | 'house' | 'commercial';
  status: 'for-sale' | 'for-rent' | 'sold';
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
}

export interface SiteSettings {
  companyName: string;
  logo: string;
  logoDark?: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  tracking: {
    googleAnalytics?: string;
    facebookPixel?: string;
    gtmId?: string;
  };
}
