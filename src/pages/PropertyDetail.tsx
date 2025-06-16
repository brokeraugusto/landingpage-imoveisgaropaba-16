import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Share2, Heart, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import { mockProperties } from '@/data/mockData';

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  
  const property = mockProperties.find(p => p.id === id);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page view for campaigns
  useEffect(() => {
    if (property) {
      // Google Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: property.title,
          page_location: window.location.href,
          content_group1: 'Property Detail',
          custom_map: {
            property_id: property.id,
            property_price: property.price,
            property_type: property.type
          }
        });
      }

      // Facebook Pixel tracking
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_type: 'property',
          content_ids: [property.id],
          content_name: property.title,
          value: property.price,
          currency: 'BRL'
        });
      }
    }
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Imóvel não encontrado</h1>
          <Link to="/imoveis">
            <Button>Voltar para Imóveis</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const handleContactClick = (action: string) => {
    // Track conversion events
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_initiated', {
        event_category: 'Lead Generation',
        event_label: action,
        property_id: property.id
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: property.title,
        content_category: action,
        value: property.price,
        currency: 'BRL'
      });
    }
  };

  const handleWhatsAppClick = () => {
    handleContactClick('WhatsApp');
    const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${formatPrice(property.price)}. Link: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky CTA Bar for mobile */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transition-transform md:hidden ${isSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex p-4 gap-2">
          <Button 
            onClick={handleWhatsAppClick}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle size={20} className="mr-2" />
            WhatsApp
          </Button>
          <Button 
            onClick={() => handleContactClick('Phone')}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            asChild
          >
            <a href="tel:+5511999999999">
              <Phone size={20} className="mr-2" />
              Ligar
            </a>
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Link 
            to="/imoveis" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para Imóveis
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Title & Price - Mobile First */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={18} className="mr-2" />
                <span>{property.location}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {formatPrice(property.price)}
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="flex items-center"><Bed size={16} className="mr-1" />{property.bedrooms} quartos</span>
                <span className="flex items-center"><Bath size={16} className="mr-1" />{property.bathrooms} banheiros</span>
                <span className="flex items-center"><Square size={16} className="mr-1" />{property.area}m²</span>
              </div>
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-500 text-white">À Venda</Badge>
                  {property.featured && (
                    <Badge className="bg-yellow-500 text-black">Destaque</Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur">
                    <Share2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur">
                    <Heart size={16} />
                  </Button>
                </div>
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {property.images.length > 1 && (
                <CardContent className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Property Info - Desktop */}
            <Card className="hidden lg:block">
              <CardContent className="p-6">
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={20} className="mr-2" />
                  <span>{property.location}</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">{property.title}</h1>
                
                <div className="text-4xl font-bold text-blue-600 mb-6">
                  {formatPrice(property.price)}
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed size={24} className="mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Quartos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath size={24} className="mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Banheiros</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Square size={24} className="mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.area}m²</div>
                    <div className="text-sm text-gray-600">Área</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar size={24} className="mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-sm">{formatDate(property.createdAt)}</div>
                    <div className="text-sm text-gray-600">Publicado</div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Descrição</h2>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Description - Mobile */}
            <Card className="lg:hidden">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Descrição</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Video */}
            {property.video && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Virtual</h2>
                  <div className="aspect-video">
                    <iframe
                      src={property.video}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      title="Tour Virtual do Imóvel"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ContactForm 
              propertyId={property.id}
              title="Tenho Interesse"
            />

            {/* Quick Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contato Rápido</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageCircle size={20} className="mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    onClick={() => handleContactClick('Phone')}
                    className="w-full"
                    variant="outline"
                    asChild
                  >
                    <a href="tel:+5511999999999">
                      <Phone size={20} className="mr-2" />
                      (11) 99999-9999
                    </a>
                  </Button>
                  <Button 
                    onClick={() => handleContactClick('Email')}
                    className="w-full"
                    variant="outline"
                    asChild
                  >
                    <a href="mailto:contato@premiumimoveis.com.br">
                      <Mail size={20} className="mr-2" />
                      E-mail
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhes do Imóvel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-semibold capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold">À Venda</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área:</span>
                    <span className="font-semibold">{property.area}m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quartos:</span>
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banheiros:</span>
                    <span className="font-semibold">{property.bathrooms}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
