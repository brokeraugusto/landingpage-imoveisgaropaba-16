
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EvolutionAPIConfig from '@/components/EvolutionAPIConfig';
import N8NConfig from '@/components/N8NConfig';
import LeadDashboard from '@/components/LeadDashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/useSettings';
import { Settings, MessageCircle, BarChart3, Users, Webhook, Activity } from 'lucide-react';
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema de Gestão Imobiliária</h1>
            <p className="text-gray-600">Dashboard completo com automações, leads e integrações</p>
          </div>

          <Tabs defaultValue="leads" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="n8n" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                N8N
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="automations" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Automações
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Geral
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard de Leads</CardTitle>
                  <CardDescription>
                    Gerencie todos os leads captados pelo sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LeadDashboard />
                </CardContent>
              </Card>
            </TabsContent>

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
                        Configure o webhook para: {window.location.origin}/supabase/functions/v1/evolution-webhook
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

            <TabsContent value="n8n">
              <N8NConfig />
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

            <TabsContent value="automations">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Automações Ativas</CardTitle>
                    <CardDescription>
                      Sistema completo de automações implementado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h4 className="font-semibold text-green-900">Captura de Leads</h4>
                        </div>
                        <p className="text-sm text-green-700">
                          ✅ Formulários de contato<br/>
                          ✅ Pop-ups inteligentes<br/>
                          ✅ Calculadora de financiamento<br/>
                          ✅ Tracking automático
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <h4 className="font-semibold text-blue-900">WhatsApp Automático</h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          ✅ Envio automático de leads<br/>
                          ✅ Templates personalizáveis<br/>
                          ✅ Webhook de status<br/>
                          ✅ Histórico de mensagens
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <h4 className="font-semibold text-purple-900">Analytics Avançado</h4>
                        </div>
                        <p className="text-sm text-purple-700">
                          ✅ Google Analytics<br/>
                          ✅ Facebook Pixel<br/>
                          ✅ Google Tag Manager<br/>
                          ✅ Eventos personalizados
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <h4 className="font-semibold text-orange-900">N8N Integration</h4>
                        </div>
                        <p className="text-sm text-orange-700">
                          ✅ Webhooks configuráveis<br/>
                          ✅ Automações personalizadas<br/>
                          ✅ Integração com CRMs<br/>
                          ✅ Follow-up automático
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Funcionalidades</CardTitle>
                    <CardDescription>
                      Funcionalidades em desenvolvimento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Sistema de distribuição inteligente de leads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Chatbot inteligente com IA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Remarketing automatizado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Relatórios avançados por email</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Sistema totalmente funcional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">✅ Sistema Implementado com Sucesso!</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• Banco de dados Supabase configurado</p>
                        <p>• Hooks para todas as funcionalidades</p>
                        <p>• Evolution API integrada</p>
                        <p>• N8N webhooks funcionais</p>
                        <p>• Dashboard de leads completo</p>
                        <p>• Analytics implementado</p>
                        <p>• Sistema de automações ativo</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Como Usar o Sistema:</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>1. Configure suas integrações nas abas WhatsApp e N8N</p>
                        <p>2. Monitore leads na aba Leads</p>
                        <p>3. Configure Analytics para tracking</p>
                        <p>4. Visualize automações na aba Automações</p>
                      </div>
                    </div>
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
