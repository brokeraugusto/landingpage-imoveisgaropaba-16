
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';

export const useProperties = () => {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description || '',
        price: prop.price,
        location: prop.location,
        bedrooms: prop.bedrooms || 0,
        bathrooms: prop.bathrooms || 0,
        area: prop.area || 0,
        images: prop.images || [],
        video: prop.video || '',
        featured: prop.featured || false,
        type: prop.type as 'apartment' | 'house' | 'commercial',
        status: prop.status as 'for-sale' | 'for-rent' | 'sold',
        createdAt: new Date(prop.created_at),
        updatedAt: new Date(prop.updated_at)
      })) as Property[];
    }
  });

  const createProperty = useMutation({
    mutationFn: async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          images: property.images,
          video: property.video,
          featured: property.featured,
          type: property.type,
          status: property.status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });

  const updateProperty = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Property> & { id: string }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });

  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });

  return {
    properties,
    isLoading,
    error,
    createProperty,
    updateProperty,
    deleteProperty
  };
};
