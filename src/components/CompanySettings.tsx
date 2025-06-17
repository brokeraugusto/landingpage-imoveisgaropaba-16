
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseSettings } from '@/hooks/useSupabaseSettings';
import LogoUpload from './LogoUpload';

const settingsSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
  contactEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  contactPhone: z.string().min(10, 'Telefone deve ter pelo menos 10 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser um código hexadecimal válido'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser um código hexadecimal válido'),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const CompanySettings = () => {
  const { settings, isLoading, updateSettings } = useSupabaseSettings();
  const { toast } = useToast();
  const [logos, setLogos] = useState({
    light: settings?.logo || '',
    dark: settings?.logoDark || ''
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: settings?.companyName || '',
      contactEmail: settings?.contactEmail || '',
      contactPhone: settings?.contactPhone || '',
      address: settings?.address || '',
      primaryColor: settings?.primaryColor || '#1e40af',
      secondaryColor: settings?.secondaryColor || '#eab308',
      facebook: settings?.socialMedia?.facebook || '',
      instagram: settings?.socialMedia?.instagram || '',
      whatsapp: settings?.socialMedia?.whatsapp || '',
    },
  });

  const handleSubmit = async (data: SettingsFormData) => {
    try {
      await updateSettings.mutateAsync({
        companyName: data.companyName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        logo: logos.light,
        logoDark: logos.dark,
        socialMedia: {
          facebook: data.facebook,
          instagram: data.instagram,
          whatsapp: data.whatsapp,
        },
      });

      toast({
        title: "Sucesso!",
        description: "Configurações salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configurações da Empresa</h1>
        <p className="text-gray-600">Personalize as informações da sua imobiliária</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Premium Imóveis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contato</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone de Contato *</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Rua das Flores, 123 - Centro, São Paulo - SP"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logotipos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Logo Principal</h3>
                  <LogoUpload
                    currentLogo={logos.light}
                    onLogoChange={(url) => setLogos(prev => ({ ...prev, light: url }))}
                    variant="light"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Logo Escuro (Opcional)</h3>
                  <LogoUpload
                    currentLogo={logos.dark}
                    onLogoChange={(url) => setLogos(prev => ({ ...prev, dark: url }))}
                    variant="dark"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cores da Marca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor Primária</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" className="w-16 h-10 p-1" {...field} />
                        </FormControl>
                        <FormControl>
                          <Input placeholder="#1e40af" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor Secundária</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" className="w-16 h-10 p-1" {...field} />
                        </FormControl>
                        <FormControl>
                          <Input placeholder="#eab308" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/suaempresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/suaempresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="5511999999999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanySettings;
