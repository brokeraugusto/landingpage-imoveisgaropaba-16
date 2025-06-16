import { Link } from 'react-router-dom';
import { Search, Star, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PropertyCard from '@/components/PropertyCard';
import ContactFormEnhanced from '@/components/ContactFormEnhanced';
import FinancingCalculator from '@/components/FinancingCalculator';
import LeadCapturePopup from '@/components/LeadCapturePopup';
import { mockProperties } from '@/data/mockData';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';
const Home = () => {
  const featuredProperties = mockProperties.filter(p => p.featured);
  const {
    trackPageView
  } = useAnalytics();
  useEffect(() => {
    trackPageView('home');
  }, [trackPageView]);
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Encontre o Imóvel dos Seus <span className="text-yellow-400">Sonhos</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200 animate-fade-in">
              Oferecemos os melhores imóveis com qualidade excepcional e atendimento personalizado
            </p>
            
            {/* Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto animate-scale-in">
              <div className="flex flex-col md:flex-row gap-4">
                <Input placeholder="Digite a localização desejada..." className="flex-1 text-gray-800" />
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                  <Search className="mr-2" size={20} />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Imóveis em Destaque</h2>
            <p className="text-gray-600 text-lg">Conheça nossas melhores opções selecionadas especialmente para você</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => <div key={property.id} className="animate-fade-in">
                <PropertyCard property={property} />
              </div>)}
          </div>

          <div className="text-center mt-12">
            <Link to="/imoveis">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg">
                Ver Todos os Imóveis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Financing Calculator Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Simule seu Financiamento</h2>
            <p className="text-gray-600 text-lg">Descubra o valor das parcelas do seu futuro imóvel</p>
          </div>
          <FinancingCalculator />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Por que Garopaba?</h2>
              <p className="text-gray-600 text-lg mb-6">Garopaba é o destino ideal para quem busca imóveis no litoral de Santa Catarina. Com praias paradisíacas, natureza preservada e qualidade de vida, é perfeita para investir, morar ou veranear com segurança e valorização.
            </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Segurança</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Qualidade de vida</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Suporte completo na documentação</span>
                </li>
              </ul>
            </div>
            <div className="animate-scale-in">
              <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop" alt="Nossa equipe" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Fale Conosco</h2>
              <p className="text-gray-600 text-lg mb-8">
                Tem alguma dúvida ou precisa de mais informações? Nossa equipe está pronta para atendê-lo.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-lg">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Telefone</h4>
                    <p className="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-lg">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">E-mail</h4>
                    <p className="text-gray-600">contato@premiumimoveis.com.br</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 text-lg">💬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">WhatsApp</h4>
                    <p className="text-gray-600">Resposta em até 30 minutos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-scale-in">
              <ContactFormEnhanced title="Solicite Informações" />
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Popup */}
      <LeadCapturePopup trigger="time" delay={45000} title="Não Perca as Melhores Oportunidades!" description="Receba primeiro os imóveis que combinam com seu perfil" offer="Consultoria Gratuita + Lista VIP de Imóveis" />
    </div>;
};
export default Home;