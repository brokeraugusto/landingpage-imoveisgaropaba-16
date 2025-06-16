
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeads } from '@/hooks/useLeads';
import { ContactForm as ContactFormType } from '@/types/property';
import { Mail, Phone, MessageCircle } from 'lucide-react';

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
  leadSource?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  propertyId, 
  propertyTitle,
  leadSource = 'contact_form'
}) => {
  const { createLead } = useLeads();
  const [formData, setFormData] = useState<ContactFormType>({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyId,
    propertyTitle
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createLead.mutateAsync({
        ...formData,
        leadSource
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        propertyId,
        propertyTitle
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <MessageCircle className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle>Entre em Contato</CardTitle>
        <CardDescription>
          {propertyTitle ? `Interessado em: ${propertyTitle}` : 'Estamos aqui para ajudar você'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Input
              name="phone"
              placeholder="Seu telefone (com DDD)"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              name="message"
              placeholder="Sua mensagem..."
              value={formData.message}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={createLead.isPending}
          >
            {createLead.isPending ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
          
          <div className="flex items-center justify-center gap-4 pt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>Telefone</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
