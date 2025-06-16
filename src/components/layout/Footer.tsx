
import { Facebook, Instagram, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            {settings.logoDark ? (
              <div className="flex items-center">
                <img 
                  src={settings.logoDark} 
                  alt={settings.companyName}
                  className="h-8 max-w-48 object-contain"
                />
              </div>
            ) : (
              <h3 className="text-2xl font-bold text-yellow-400">{settings.companyName}</h3>
            )}
            <p className="text-gray-300">
              Sua melhor escolha em imóveis de qualidade. 
              Encontre o lar dos seus sonhos conosco.
            </p>
            <div className="flex space-x-4">
              {settings.socialMedia.facebook && (
                <a 
                  href={settings.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Facebook size={24} />
                </a>
              )}
              {settings.socialMedia.instagram && (
                <a 
                  href={settings.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Instagram size={24} />
                </a>
              )}
              {settings.socialMedia.whatsapp && (
                <a 
                  href={`https://wa.me/${settings.socialMedia.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <MessageCircle size={24} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/imoveis" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Serviços</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Compra de Imóveis</li>
              <li>Venda de Imóveis</li>
              <li>Locação</li>
              <li>Avaliação Imobiliária</li>
              <li>Consultoria</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-yellow-400" />
                <span className="text-gray-300">{settings.contactPhone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-yellow-400" />
                <span className="text-gray-300">{settings.contactEmail}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-yellow-400 mt-1" />
                <span className="text-gray-300">
                  {settings.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} {settings.companyName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
