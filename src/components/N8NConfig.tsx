
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useN8N, N8NWebhook } from '@/hooks/useN8N';
import { Webhook, Plus, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const N8NConfig = () => {
  const { createWebhook, isLoading } = useN8N();
  const [webhookForm, setWebhookForm] = useState<Omit<N8NWebhook, 'id'>>({
    name: '',
    webhookUrl: '',
    eventType: 'new_lead',
    active: true,
    config: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookForm.name || !webhookForm.webhookUrl) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e URL do webhook são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createWebhook(webhookForm);
      setWebhookForm({
        name: '',
        webhookUrl: '',
        eventType: 'new_lead',
        active: true,
        config: {}
      });
    } catch (error) {
      console.error('Error creating webhook:', error);
    }
  };

  const eventTypes = [
    { value: 'new_lead', label: 'Novo Lead' },
    { value: 'property_view', label: 'Visualização de Imóvel' },
    { value: 'contact_form', label: 'Formulário de Contato' },
    { value: 'calculator_use', label: 'Uso da Calculadora' },
    { value: 'lead_status_change', label: 'Mudança de Status do Lead' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Webhook className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Configurar Webhook N8N</CardTitle>
              <CardDescription>
                Configure webhooks para automações avançadas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Nome do Webhook</Label>
              <Input
                id="webhook-name"
                placeholder="Ex: Automação de Leads"
                value={webhookForm.name}
                onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook N8N</Label>
              <Input
                id="webhook-url"
                placeholder="https://sua-instancia-n8n.com/webhook/..."
                value={webhookForm.webhookUrl}
                onChange={(e) => setWebhookForm({ ...webhookForm, webhookUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-type">Tipo de Evento</Label>
              <Select
                value={webhookForm.eventType}
                onValueChange={(value) => setWebhookForm({ ...webhookForm, eventType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((event) => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="webhook-active"
                checked={webhookForm.active}
                onCheckedChange={(checked) => setWebhookForm({ ...webhookForm, active: checked })}
              />
              <Label htmlFor="webhook-active">Webhook Ativo</Label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Criando...' : 'Criar Webhook'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automações Disponíveis</CardTitle>
          <CardDescription>
            Exemplos de automações que você pode configurar no N8N
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Distribuição Inteligente de Leads</h4>
              <p className="text-sm text-blue-700">
                Distribui automaticamente leads entre corretores baseado em critérios como localização, tipo de imóvel e carga de trabalho.
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Follow-up Automatizado</h4>
              <p className="text-sm text-green-700">
                Envia mensagens automáticas de follow-up via WhatsApp em intervalos programados.
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Integração com CRM</h4>
              <p className="text-sm text-purple-700">
                Sincroniza leads automaticamente com sistemas CRM externos como HubSpot, Pipedrive ou Salesforce.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900">Relatórios Automáticos</h4>
              <p className="text-sm text-yellow-700">
                Gera e envia relatórios de performance por email ou Slack em intervalos programados.
              </p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-900">Alertas Inteligentes</h4>
              <p className="text-sm text-red-700">
                Envia alertas quando leads de alto valor são criados ou quando há muito tempo sem follow-up.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Como Configurar:</h4>
            <ol className="text-sm space-y-1 text-gray-600">
              <li>1. Crie um workflow no N8N</li>
              <li>2. Configure um webhook trigger</li>
              <li>3. Copie a URL do webhook</li>
              <li>4. Configure aqui no sistema</li>
              <li>5. Teste a automação</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default N8NConfig;
