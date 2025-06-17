
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Eye, MapPin, Bed, Bath, Square } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import PropertyForm from './PropertyForm';

const PropertyManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const { properties, isLoading, createProperty, updateProperty, deleteProperty } = useProperties();
  const { toast } = useToast();

  const handleCreateProperty = async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProperty.mutateAsync(data);
      toast({
        title: "Sucesso!",
        description: "Imóvel cadastrado com sucesso.",
      });
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar imóvel. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProperty = async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProperty) return;
    
    try {
      await updateProperty.mutateAsync({ id: editingProperty.id, ...data });
      toast({
        title: "Sucesso!",
        description: "Imóvel atualizado com sucesso.",
      });
      setEditingProperty(undefined);
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar imóvel. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty.mutateAsync(id);
      toast({
        title: "Sucesso!",
        description: "Imóvel removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover imóvel. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'for-sale': { label: 'À Venda', variant: 'default' as const },
      'for-rent': { label: 'Para Alugar', variant: 'secondary' as const },
      'sold': { label: 'Vendido', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      'apartment': 'Apartamento',
      'house': 'Casa',
      'commercial': 'Comercial',
    };
    
    return <Badge variant="outline">{typeMap[type as keyof typeof typeMap]}</Badge>;
  };

  if (showForm) {
    return (
      <PropertyForm
        property={editingProperty}
        onSubmit={editingProperty ? handleUpdateProperty : handleCreateProperty}
        onCancel={() => {
          setShowForm(false);
          setEditingProperty(undefined);
        }}
        isLoading={createProperty.isPending || updateProperty.isPending}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Imóveis</h1>
          <p className="text-gray-600">Gerencie todos os imóveis da sua imobiliária</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Imóvel
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Nenhum imóvel cadastrado ainda.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Cadastrar Primeiro Imóvel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {property.images.length > 0 && (
                <div className="relative h-48">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      Destaque
                    </Badge>
                  )}
                </div>
              )}
              
              <CardContent className="p-4">
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{property.title}</h3>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      R$ {property.price.toLocaleString('pt-BR')}
                    </span>
                    <div className="flex gap-2">
                      {getStatusBadge(property.status)}
                      {getTypeBadge(property.type)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area > 0 && (
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{property.area}m²</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProperty(property);
                      setShowForm(true);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProperty(property.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
