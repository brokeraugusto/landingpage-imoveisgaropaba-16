
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Share2, MessageCircle } from 'lucide-react';
import { useEvolutionAPI } from '@/hooks/useEvolutionAPI';
import { toast } from '@/components/ui/use-toast';

interface CalculatorResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
}

const FinancingCalculator = () => {
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('9.5');
  const [loanTerm, setLoanTerm] = useState('360');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({ name: '', phone: '', email: '' });
  
  const { sendLeadToWhatsApp } = useEvolutionAPI();

  const calculateFinancing = () => {
    const value = parseFloat(propertyValue.replace(/\D/g, ''));
    const down = parseFloat(downPayment.replace(/\D/g, ''));
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm);
    
    if (!value || !down || value <= down) return;
    
    const loanAmount = value - down;
    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalAmount = monthlyPayment * months;
    const totalInterest = totalAmount - loanAmount;
    
    setResult({
      monthlyPayment,
      totalInterest,
      totalAmount: totalAmount + down
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleShareResult = () => {
    setShowContactForm(true);
  };

  const handleSendResult = async () => {
    if (!contactData.name || !contactData.phone || !result) return;
    
    const message = `Olá ${contactData.name}! Aqui está sua simulação de financiamento:

🏠 Valor do Imóvel: ${formatCurrency(parseFloat(propertyValue.replace(/\D/g, '')))}
💰 Entrada: ${formatCurrency(parseFloat(downPayment.replace(/\D/g, '')))}
📊 Taxa de Juros: ${interestRate}% a.a.
⏱️ Prazo: ${Math.floor(parseInt(loanTerm) / 12)} anos

📋 RESULTADO:
💳 Parcela Mensal: ${formatCurrency(result.monthlyPayment)}
💸 Total de Juros: ${formatCurrency(result.totalInterest)}
💯 Valor Total: ${formatCurrency(result.totalAmount)}

Entre em contato para mais detalhes e condições especiais!`;

    const success = await sendLeadToWhatsApp({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      message: 'Solicitou simulação de financiamento',
      leadSource: 'Calculadora de Financiamento'
    }, contactData.phone);

    if (success) {
      setShowContactForm(false);
      setContactData({ name: '', phone: '', email: '' });
    }
  };

  useEffect(() => {
    if (propertyValue && downPayment && interestRate && loanTerm) {
      calculateFinancing();
    }
  }, [propertyValue, downPayment, interestRate, loanTerm]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Calculator className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle>Calculadora de Financiamento</CardTitle>
        <CardDescription>
          Simule seu financiamento imobiliário e descubra o valor das parcelas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="property-value">Valor do Imóvel</Label>
            <Input
              id="property-value"
              placeholder="R$ 500.000"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="down-payment">Valor da Entrada</Label>
            <Input
              id="down-payment"
              placeholder="R$ 100.000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interest-rate">Taxa de Juros (% ao ano)</Label>
            <Input
              id="interest-rate"
              placeholder="9.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loan-term">Prazo (meses)</Label>
            <Input
              id="loan-term"
              placeholder="360"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
            />
          </div>
        </div>

        {result && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">Resultado da Simulação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Parcela Mensal</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.monthlyPayment)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total de Juros</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalAmount)}</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleShareResult} className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Receber no WhatsApp
              </Button>
            </div>
          </div>
        )}

        {showContactForm && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Seus Dados para Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Seu nome"
                value={contactData.name}
                onChange={(e) => setContactData({...contactData, name: e.target.value})}
              />
              <Input
                placeholder="Telefone/WhatsApp"
                value={contactData.phone}
                onChange={(e) => setContactData({...contactData, phone: e.target.value})}
              />
            </div>
            <Input
              placeholder="E-mail (opcional)"
              value={contactData.email}
              onChange={(e) => setContactData({...contactData, email: e.target.value})}
            />
            <div className="flex gap-2">
              <Button onClick={handleSendResult} className="flex-1">
                Enviar Simulação
              </Button>
              <Button variant="outline" onClick={() => setShowContactForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancingCalculator;
