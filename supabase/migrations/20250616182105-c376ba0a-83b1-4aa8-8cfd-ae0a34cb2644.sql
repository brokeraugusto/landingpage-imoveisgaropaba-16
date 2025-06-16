
-- Criar tabela de imóveis
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  video TEXT,
  featured BOOLEAN DEFAULT false,
  type TEXT CHECK (type IN ('apartment', 'house', 'commercial')) DEFAULT 'apartment',
  status TEXT CHECK (status IN ('for-sale', 'for-rent', 'sold')) DEFAULT 'for-sale',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT,
  property_id UUID REFERENCES public.properties(id),
  property_title TEXT,
  lead_source TEXT,
  interest TEXT,
  preferred_contact TEXT DEFAULT 'whatsapp',
  urgency TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  assigned_to TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de configurações do sistema
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Premium Imóveis',
  logo TEXT,
  logo_dark TEXT,
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#eab308',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  social_media JSONB DEFAULT '{}',
  tracking JSONB DEFAULT '{}',
  evolution_api JSONB DEFAULT '{}',
  n8n_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de mensagens WhatsApp
CREATE TABLE public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id),
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  direction TEXT CHECK (direction IN ('outbound', 'inbound')) DEFAULT 'outbound',
  status TEXT DEFAULT 'pending',
  evolution_message_id TEXT,
  template_used TEXT,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de templates de mensagens
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'lead_followup',
  variables TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de webhooks N8N
CREATE TABLE public.n8n_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de analytics
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  property_id UUID REFERENCES public.properties(id),
  lead_id UUID REFERENCES public.leads(id),
  user_session TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir dados iniciais
INSERT INTO public.properties (title, description, price, location, bedrooms, bathrooms, area, images, featured, type, status)
VALUES 
('Apartamento Moderno no Centro', 'Apartamento completamente renovado com vista panorâmica da cidade. Localizado no coração da cidade, próximo a restaurantes, shopping centers e transporte público.', 850000, 'Centro, São Paulo - SP', 3, 2, 120, ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop'], true, 'apartment', 'for-sale'),
('Casa de Luxo com Piscina', 'Casa de alto padrão em condomínio fechado, com piscina, churrasqueira e jardim amplo. Ideal para famílias que buscam conforto e segurança.', 1200000, 'Alphaville, Barueri - SP', 4, 3, 280, ARRAY['https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop'], true, 'house', 'for-sale'),
('Loft Contemporâneo', 'Loft moderno em edifício industrial reformado. Conceito aberto com pé direito alto e acabamentos de primeira qualidade.', 650000, 'Vila Madalena, São Paulo - SP', 1, 1, 85, ARRAY['https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop'], false, 'apartment', 'for-sale');

-- Inserir configurações padrão
INSERT INTO public.site_settings (company_name, contact_email, contact_phone, address, social_media, tracking)
VALUES ('Premium Imóveis', 'contato@premiumimoveis.com.br', '(11) 99999-9999', 'Rua das Flores, 123 - Centro, São Paulo - SP',
        '{"facebook": "", "instagram": "", "whatsapp": ""}',
        '{"googleAnalytics": "", "facebookPixel": "", "gtmId": ""}');

-- Inserir templates de mensagem padrão
INSERT INTO public.message_templates (name, content, type, variables)
VALUES 
('Novo Lead', '🏠 *NOVO LEAD CAPTADO*\n\n👤 *Nome:* {{name}}\n📧 *Email:* {{email}}\n📱 *Telefone:* {{phone}}\n🏡 *Imóvel:* {{propertyTitle}}\n📊 *Origem:* {{leadSource}}\n\n💬 *Mensagem:*\n{{message}}\n\n⏰ *Data:* {{timestamp}}\n\n*Entre em contato o quanto antes para maximizar a conversão!*', 'lead_notification', ARRAY['name', 'email', 'phone', 'propertyTitle', 'leadSource', 'message', 'timestamp']),
('Follow-up Automático', 'Olá {{name}}! 👋\n\nObrigado pelo seu interesse no imóvel {{propertyTitle}}.\n\nSou da {{companyName}} e estou aqui para ajudá-lo(a) com todas as informações que precisar.\n\nQuando seria um bom horário para conversarmos? 😊', 'lead_followup', ARRAY['name', 'propertyTitle', 'companyName']),
('Agendamento de Visita', 'Olá {{name}}! 🏠\n\nQue tal agendarmos uma visita ao imóvel {{propertyTitle}}?\n\nTenho alguns horários disponíveis:\n📅 Hoje às 14h\n📅 Amanhã às 10h\n📅 Amanhã às 16h\n\nQual funciona melhor para você?', 'visit_scheduling', ARRAY['name', 'propertyTitle']);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Criar policies para acesso público (temporário - em produção deve ser restrito)
CREATE POLICY "Allow public read on properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Allow public insert on leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on whatsapp_messages" ON public.whatsapp_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on message_templates" ON public.message_templates FOR SELECT USING (true);
CREATE POLICY "Allow public insert on analytics_events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Criar policies administrativas (para quando houver autenticação)
CREATE POLICY "Allow admin full access on properties" ON public.properties FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on leads" ON public.leads FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on site_settings" ON public.site_settings FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on whatsapp_messages" ON public.whatsapp_messages FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on message_templates" ON public.message_templates FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on n8n_webhooks" ON public.n8n_webhooks FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on analytics_events" ON public.analytics_events FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Criar índices para performance
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_featured ON public.properties(featured);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_whatsapp_messages_lead_id ON public.whatsapp_messages(lead_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_property_id ON public.analytics_events(property_id);
