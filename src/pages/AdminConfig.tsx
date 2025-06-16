
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EvolutionAPIConfig from '@/components/EvolutionAPIConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/useSettings';
import { Settings, MessageCircle, BarChart3, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminConfig = () => {
  const { settings, updateSettings } = useSettings();
  const [trackingSettings, setTrackingSettings] = useState(settings.tracking);

  const handleSaveTracking = () => {
    const success = updateSettings({ tracking: trackingSettings });
    if (success) {
      toast({
        title: "Configurações salvas",
        description: "Analytics configurado com sucesso",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações do Sistema</h1>
            <p className="text-gray-600">Configure as integrações e automações da sua imobiliária</p>
          </div>

          <Tabs defaultValue="whatsapp" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Geral
              </TabsTrigger>
            </TabsList>

            <TabsContent value="whatsapp">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EvolutionAPIConfig />
                <Card>
                  <CardHeader>
                    <CardTitle>Como Configurar</CardTitle>
                    <CardDescription>
                      Siga os passos para integrar sua Evolution API
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">1. Instalar Evolution API</h4>
                      <p className="text-sm text-gray-600">
                        Configure sua instância da Evolution API seguindo a documentação oficial
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">2. Criar Instância</h4>
                      <p className="text-sm text-gray-600">
                        Crie uma nova instância e anote o nome, URL e chave da API
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">3. Configurar Webhook</h4>
                      <p className="text-sm text-gray-600">
                        Configure o webhook para receber status das mensagens
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">4. Conectar WhatsApp</h4>
                      <p className="text-sm text-gray-600">
                        Escaneie o QR Code para conectar seu WhatsApp Business
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Tracking</CardTitle>
                  <CardDescription>
                    Configure Google Analytics, Facebook Pixel e GTM para rastrear conversões
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga-id">Google Analytics ID</Label>
                    <Input
                      id="ga-id"
                      placeholder="G-XXXXXXXXXX"
                      value={trackingSettings.googleAnalytics || ''}
                      onChange={(e) => setTrackingSettings({
                        ...trackingSettings,
                        googleAnalytics: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                    <Input
                      id="fb-pixel"
                      placeholder="123456789012345"
                      value={trackingSettings.facebookPixel || ''}
                      onChange={(e) => setTrackingSettings({
                        ...trackingSettings,
                        facebookPixel: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                    <Input
                      id="gtm-id"
                      placeholder="GTM-XXXXXXX"
                      value={trackingSettings.gtmId || ''}
                      onChange={(e) => setTrackingSettings({
                        ...trackingSettings,
                        gtmId: e.target.value
                      })}
                    />
                  </div>
                  
                  <Button onClick={handleSaveTracking}>
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Leads</CardTitle>
                  <CardDescription>
                    Configure como os leads são processados e distribuídos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Funcionalidades Implementadas:</h4>
                      <ul className="mt-2 space-y-1 text-blue-800">
                        <li>✅ Captura automática via formulários</li>
                        <li>✅ Envio automático via WhatsApp</li>
                        <li>✅ Pop-ups inteligentes de captura</li>
                        <li>✅ Calculadora de financiamento</li>
                        <li>✅ Tracking completo de conversões</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900">Próximas Funcionalidades:</h4>
                      <ul className="mt-2 space-y-1 text-yellow-800">
                        <li>🔄 Sistema de distribuição de leads</li>
                        <li>🔄 CRM integrado</li>
                        <li>🔄 Automação de follow-up</li>
                        <li>🔄 Relatórios avançados</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configurações básicas do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      As configurações gerais já estão disponíveis através do hook useSettings.
                      Esta seção pode ser expandida para incluir mais opções conforme necessário.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;
