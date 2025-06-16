
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvolutionAPI } from '@/hooks/useEvolutionAPI';
import { MessageCircle, Settings, Save } from 'lucide-react';

const EvolutionAPIConfig = () => {
  const { apiUrl, apiKey, instanceName, saveConfig } = useEvolutionAPI();
  const [url, setUrl] = useState(apiUrl);
  const [key, setKey] = useState(apiKey);
  const [instance, setInstance] = useState(instanceName);

  const handleSave = () => {
    saveConfig(url, key, instance);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <MessageCircle className="h-8 w-8 text-green-600 mr-2" />
          <Settings className="h-6 w-6 text-gray-600" />
        </div>
        <CardTitle>Configuração Evolution API</CardTitle>
        <CardDescription>
          Configure sua instância da Evolution API para automação via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-url">URL da API</Label>
          <Input
            id="api-url"
            placeholder="https://sua-evolution-api.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Sua chave da API"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instance">Nome da Instância</Label>
          <Input
            id="instance"
            placeholder="nome-da-instancia"
            value={instance}
            onChange={(e) => setInstance(e.target.value)}
          />
        </div>
        
        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configuração
        </Button>
      </CardContent>
    </Card>
  );
};

export default EvolutionAPIConfig;
