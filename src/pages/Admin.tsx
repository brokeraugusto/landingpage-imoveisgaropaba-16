
import { useState } from 'react';
import { Plus, Edit, Trash2, Settings, BarChart3, Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';
import LogoUpload from '@/components/LogoUpload';
import { useSettings } from '@/hooks/useSettings';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/types/property';

const Admin = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([]);
  const { settings, updateSettings } = useSettings();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setFormImages(property.images);
    setIsDialogOpen(true);
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setFormImages([]);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProperty(null);
    setFormImages([]);
  };

  const handleSaveSettings = (formData: FormData) => {
    const newSettings = {
      ...settings,
      companyName: formData.get('company-name') as string,
      contactEmail: formData.get('contact-email') as string,
      contactPhone: formData.get('contact-phone') as string,
      address: formData.get('address') as string,
      socialMedia: {
        facebook: formData.get('facebook') as string,
        instagram: formData.get('instagram') as string,
        whatsapp: formData.get('whatsapp') as string,
      }
    };

    if (updateSettings(newSettings)) {
      toast({
        title: "Configurações salvas!",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleSaveTracking = (formData: FormData) => {
    const newSettings = {
      ...settings,
      tracking: {
        googleAnalytics: formData.get('ga-id') as string,
        facebookPixel: formData.get('fb-pixel') as string,
        gtmId: formData.get('gtm-id') as string,
      }
    };

    if (updateSettings(newSettings)) {
      toast({
        title: "Códigos salvos!",
        description: "Os códigos de rastreamento foram salvos com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os códigos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
            <Button onClick={handleAddProperty} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Novo Imóvel
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home size={16} />
              Imóveis
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users size={16} />
              Leads
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className="bg-green-500">À Venda</Badge>
                        {property.featured && (
                          <Badge className="bg-yellow-500 text-black">Destaque</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                    <p className="text-xl font-bold text-blue-600 mb-4">{formatPrice(property.price)}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {property.bedrooms}q • {property.bathrooms}b • {property.area}m²
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total de Imóveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{properties.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Imóveis em Destaque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{properties.filter(p => p.featured).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Visitas Este Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Leads Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">João Silva</h4>
                      <p className="text-sm text-gray-600">joao@email.com • (11) 99999-9999</p>
                      <p className="text-sm text-blue-600">Interessado em: Apartamento Moderno no Centro</p>
                    </div>
                    <div className="text-sm text-gray-500">Hoje, 14:30</div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Maria Santos</h4>
                      <p className="text-sm text-gray-600">maria@email.com • (11) 88888-8888</p>
                      <p className="text-sm text-blue-600">Interessado em: Casa de Luxo com Piscina</p>
                    </div>
                    <div className="text-sm text-gray-500">Ontem, 16:45</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Logo Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Logotipos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LogoUpload
                    logo={settings.logo}
                    onLogoChange={(logo) => updateSettings({ logo })}
                    label="Logo Principal"
                  />
                  <LogoUpload
                    logo={settings.logoDark || ''}
                    onLogoChange={(logoDark) => updateSettings({ logoDark })}
                    label="Logo Dark Mode"
                    isDark={true}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações do Site</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSettings(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input 
                      id="company-name" 
                      name="company-name"
                      defaultValue={settings.companyName} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">E-mail de Contato</Label>
                    <Input 
                      id="contact-email" 
                      name="contact-email"
                      type="email" 
                      defaultValue={settings.contactEmail} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Telefone</Label>
                    <Input 
                      id="contact-phone" 
                      name="contact-phone"
                      defaultValue={settings.contactPhone} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Textarea 
                      id="address" 
                      name="address"
                      defaultValue={settings.address} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input 
                      id="facebook" 
                      name="facebook"
                      defaultValue={settings.socialMedia.facebook} 
                      placeholder="https://facebook.com/empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input 
                      id="instagram" 
                      name="instagram"
                      defaultValue={settings.socialMedia.instagram} 
                      placeholder="https://instagram.com/empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input 
                      id="whatsapp" 
                      name="whatsapp"
                      defaultValue={settings.socialMedia.whatsapp} 
                      placeholder="5511999999999"
                    />
                  </div>
                  <Button type="submit">Salvar Configurações</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Códigos de Rastreamento</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveTracking(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="ga-id">Google Analytics ID</Label>
                    <Input 
                      id="ga-id" 
                      name="ga-id"
                      defaultValue={settings.tracking.googleAnalytics}
                      placeholder="GA_MEASUREMENT_ID" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                    <Input 
                      id="fb-pixel" 
                      name="fb-pixel"
                      defaultValue={settings.tracking.facebookPixel}
                      placeholder="FACEBOOK_PIXEL_ID" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                    <Input 
                      id="gtm-id" 
                      name="gtm-id"
                      defaultValue={settings.tracking.gtmId}
                      placeholder="GTM-XXXXXXX" 
                    />
                  </div>
                  <Button type="submit">Salvar Códigos</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Property Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    defaultValue={editingProperty?.title || ''}
                    placeholder="Ex: Apartamento Moderno no Centro"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    defaultValue={editingProperty?.description || ''}
                    placeholder="Descreva o imóvel..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      defaultValue={editingProperty?.price || ''}
                      placeholder="850000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      defaultValue={editingProperty?.location || ''}
                      placeholder="Centro, São Paulo - SP"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      defaultValue={editingProperty?.bedrooms || ''}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      defaultValue={editingProperty?.bathrooms || ''}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      defaultValue={editingProperty?.area || ''}
                      placeholder="120"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select defaultValue={editingProperty?.type || 'apartment'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartamento</SelectItem>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="commercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={editingProperty?.status || 'for-sale'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for-sale">À Venda</SelectItem>
                        <SelectItem value="for-rent">Para Alugar</SelectItem>
                        <SelectItem value="sold">Vendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="video">URL do Vídeo (opcional)</Label>
                  <Input
                    id="video"
                    defaultValue={editingProperty?.video || ''}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
              </div>
              
              <div>
                <ImageUpload
                  images={formImages}
                  onImagesChange={setFormImages}
                  maxImages={10}
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" className="flex-1">
                {editingProperty ? 'Atualizar' : 'Criar'} Imóvel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
