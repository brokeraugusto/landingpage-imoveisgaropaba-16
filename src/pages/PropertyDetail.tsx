
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ContactForm from '@/components/ContactForm';
import { mockProperties } from '@/data/mockData';

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const property = mockProperties.find(p => p.id === id);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/imoveis" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Imóveis
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-500">À Venda</Badge>
                  {property.featured && (
                    <Badge className="bg-yellow-500 text-black">Destaque</Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    <Share2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Heart size={16} />
                  </Button>
                </div>
              </div>

              {property.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
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
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
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
            </div>

            {/* Video */}
            {property.video && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Virtual</h2>
                <div className="aspect-video">
                  <iframe
                    src={property.video}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title="Tour Virtual do Imóvel"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ContactForm 
              propertyId={property.id}
              title="Tenho Interesse"
            />

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
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
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Fale Conosco</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">📞</span>
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">✉️</span>
                  <span>contato@premiumimoveis.com.br</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
