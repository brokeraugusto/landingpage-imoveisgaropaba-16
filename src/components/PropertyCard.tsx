
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusBadge = (status: Property['status']) => {
    const statusMap = {
      'for-sale': { label: 'À Venda', variant: 'default' as const },
      'for-rent': { label: 'Para Alugar', variant: 'secondary' as const },
      'sold': { label: 'Vendido', variant: 'destructive' as const }
    };
    
    return statusMap[status];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={getStatusBadge(property.status).variant === 'default' ? 'bg-green-500' : 
                          getStatusBadge(property.status).variant === 'secondary' ? 'bg-blue-500' : 'bg-red-500'}>
            {getStatusBadge(property.status).label}
          </Badge>
          {property.featured && (
            <Badge className="bg-yellow-500 text-black">
              Destaque
            </Badge>
          )}
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <Heart size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Features */}
        <div className="flex items-center space-x-4 mb-4 text-gray-600">
          <div className="flex items-center">
            <Bed size={16} className="mr-1" />
            <span className="text-sm">{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span className="text-sm">{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square size={16} className="mr-1" />
            <span className="text-sm">{property.area}m²</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(property.price)}
          </div>
          <Link to={`/imovel/${property.id}`}>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
