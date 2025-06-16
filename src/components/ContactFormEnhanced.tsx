
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { useEvolutionAPI } from '@/hooks/useEvolutionAPI';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/components/ui/use-toast';

interface ContactFormEnhancedProps {
  title?: string;
  propertyId?: string;
  propertyTitle?: string;
  showPropertySelect?: boolean;
}

const ContactFormEnhanced = ({ 
  title = "Entre em Contato",
  propertyId,
  propertyTitle,
  showPropertySelect = false
}: ContactFormEnhancedProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    preferredContact: 'whatsapp',
    urgency: 'normal'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendLeadToWhatsApp } = useEvolutionAPI();
  const { trackLead, trackContact } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e telefone",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Enviar lead via Evolution API
      const realtorPhone = "5511999887766"; // Telefone do corretor - deve vir das configurações
      const success = await sendLeadToWhatsApp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.message}\n\nInteresse: ${formData.interest}\nUrgência: ${formData.urgency}\nContato preferido: ${formData.preferredContact}`,
        propertyId: propertyId,
        propertyTitle: propertyTitle,
        leadSource: 'Formulário de Contato'
      }, realtorPhone);

      if (success) {
        // Tracking
        trackLead('contact_form', propertyId);
        trackContact('form');

        toast({
          title: "Mensagem enviada!",
          description: "Entraremos em contato em breve via WhatsApp",
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          interest: '',
          message: '',
          preferredContact: 'whatsapp',
          urgency: 'normal'
        });
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      toast({
        title: "Erro no envio",
        description: "Tente novamente ou entre em contato diretamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>
          Preencha o formulário e receba uma resposta rápida via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp/Telefone *</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest">Qual seu interesse?</Label>
            <Select value={formData.interest} onValueChange={(value) => setFormData({...formData, interest: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu interesse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprar">Comprar Imóvel</SelectItem>
                <SelectItem value="vender">Vender Imóvel</SelectItem>
                <SelectItem value="alugar">Alugar Imóvel</SelectItem>
                <SelectItem value="avaliar">Avaliar Imóvel</SelectItem>
                <SelectItem value="financiamento">Financiamento</SelectItem>
                <SelectItem value="consultoria">Consultoria</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contato Preferido</Label>
              <Select value={formData.preferredContact} onValueChange={(value) => setFormData({...formData, preferredContact: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Ligação</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Urgência</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgente (hoje)</SelectItem>
                  <SelectItem value="high">Alta (esta semana)</SelectItem>
                  <SelectItem value="normal">Normal (até 15 dias)</SelectItem>
                  <SelectItem value="low">Baixa (sem pressa)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Conte-nos mais sobre o que procura..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={4}
            />
          </div>

          {propertyTitle && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Imóvel de interesse:</strong> {propertyTitle}
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar via WhatsApp
              </>
            )}
          </Button>

          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-gray-600">Ou entre em contato diretamente:</p>
            <div className="flex justify-center space-x-4">
              <a href="tel:+5511999887766" className="flex items-center text-blue-600 hover:underline">
                <Phone className="h-4 w-4 mr-1" />
                (11) 99988-7766
              </a>
              <a href="mailto:contato@premiumimoveis.com.br" className="flex items-center text-blue-600 hover:underline">
                <Mail className="h-4 w-4 mr-1" />
                E-mail
              </a>
            </div>
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Clock className="h-3 w-3 mr-1" />
              Respondemos em até 30 minutos no horário comercial
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactFormEnhanced;
