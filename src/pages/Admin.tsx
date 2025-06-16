
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AdminHeader from '@/components/AdminHeader';
import { 
  Settings, 
  Users, 
  BarChart3, 
  MessageCircle, 
  Home,
  TrendingUp,
  Database,
  Webhook
} from 'lucide-react';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Painel de Controle
            </h1>
            <p className="text-gray-600">
              Gerencie seu sistema imobiliário de forma completa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configurações</CardTitle>
                    <CardDescription className="text-sm">
                      Sistema completo de configurações
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configure integrações, analytics, automações e muito mais.
                </p>
                <Link to="/admin/config">
                  <Button className="w-full">
                    Acessar Configurações
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Leads</CardTitle>
                    <CardDescription className="text-sm">
                      Gestão completa de leads
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Visualize, gerencie e converta seus leads de forma eficiente.
                </p>
                <Link to="/admin/config?tab=leads">
                  <Button variant="outline" className="w-full">
                    Ver Leads
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Analytics</CardTitle>
                    <CardDescription className="text-sm">
                      Tracking e relatórios
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configure Google Analytics, Facebook Pixel e GTM.
                </p>
                <Link to="/admin/config?tab=analytics">
                  <Button variant="outline" className="w-full">
                    Configurar Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">WhatsApp</CardTitle>
                    <CardDescription className="text-sm">
                      Automação de mensagens
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configure a Evolution API para automação no WhatsApp.
                </p>
                <Link to="/admin/config?tab=whatsapp">
                  <Button variant="outline" className="w-full">
                    Configurar WhatsApp
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Webhook className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Automações</CardTitle>
                    <CardDescription className="text-sm">
                      N8N e workflows
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configure automações avançadas com N8N.
                </p>
                <Link to="/admin/config?tab=automations">
                  <Button variant="outline" className="w-full">
                    Ver Automações
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Home className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Site Principal</CardTitle>
                    <CardDescription className="text-sm">
                      Voltar ao site público
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Visualize como está o site para os visitantes.
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Ir para o Site
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Supabase</p>
                    <p className="text-xs text-gray-600">Conectado</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Banco de Dados</p>
                    <p className="text-xs text-gray-600">Operacional</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Automações</p>
                    <p className="text-xs text-gray-600">Ativo</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">APIs</p>
                    <p className="text-xs text-gray-600">Funcionando</p>
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

export default Admin;
