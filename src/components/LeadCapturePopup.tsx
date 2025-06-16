
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Gift, Home, MessageCircle } from 'lucide-react';
import { useEvolutionAPI } from '@/hooks/useEvolutionAPI';
import { toast } from '@/components/ui/use-toast';

interface LeadCapturePopupProps {
  trigger?: 'time' | 'scroll' | 'exit';
  delay?: number;
  title?: string;
  description?: string;
  offer?: string;
}

const LeadCapturePopup = ({ 
  trigger = 'time', 
  delay = 30000,
  title = "Encontre o Imóvel dos Seus Sonhos!",
  description = "Receba em primeira mão os melhores imóveis da região",
  offer = "Avaliação Gratuita do Seu Imóvel"
}: LeadCapturePopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  const [hasShown, setHasShown] = useState(false);
  
  const { sendLeadToWhatsApp } = useEvolutionAPI();

  useEffect(() => {
    if (hasShown) return;

    const hasSeenPopup = localStorage.getItem('leadPopupSeen');
    if (hasSeenPopup) return;

    let timeoutId: NodeJS.Timeout;
    let scrollHandler: () => void;
    let mouseHandler: (e: MouseEvent) => void;

    switch (trigger) {
      case 'time':
        timeoutId = setTimeout(() => {
          setIsOpen(true);
          setHasShown(true);
        }, delay);
        break;
        
      case 'scroll':
        scrollHandler = () => {
          const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercent > 50) {
            setIsOpen(true);
            setHasShown(true);
            window.removeEventListener('scroll', scrollHandler);
          }
        };
        window.addEventListener('scroll', scrollHandler);
        break;
        
      case 'exit':
        mouseHandler = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            setIsOpen(true);
            setHasShown(true);
            document.removeEventListener('mouseleave', mouseHandler);
          }
        };
        document.addEventListener('mouseleave', mouseHandler);
        break;
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
      if (mouseHandler) document.removeEventListener('mouseleave', mouseHandler);
    };
  }, [trigger, delay, hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e telefone para continuar",
        variant: "destructive",
      });
      return;
    }

    const success = await sendLeadToWhatsApp({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || `Interesse: ${formData.interest}`,
      leadSource: 'Pop-up de Captura'
    }, formData.phone);

    if (success) {
      localStorage.setItem('leadPopupSeen', 'true');
      setIsOpen(false);
      toast({
        title: "Obrigado!",
        description: "Em breve entraremos em contato via WhatsApp",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('leadPopupSeen', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-yellow-500" />
            {title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <Home className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">{description}</p>
            {offer && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-yellow-800 font-semibold">🎁 {offer}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Seu nome completo *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Input
              placeholder="WhatsApp/Telefone *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            
            <Input
              placeholder="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <Input
              placeholder="Que tipo de imóvel procura?"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
            />

            <Textarea
              placeholder="Deixe sua mensagem (opcional)"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={3}
            />

            <Button type="submit" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Quero Receber no WhatsApp
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            Seus dados estão seguros conosco e não serão compartilhados.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCapturePopup;
