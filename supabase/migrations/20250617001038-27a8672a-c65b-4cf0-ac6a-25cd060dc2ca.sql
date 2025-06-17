
-- Criar bucket para imagens de imóveis
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Política para permitir que qualquer usuário autenticado faça upload de imagens
CREATE POLICY "Allow authenticated users to upload property images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Política para permitir leitura pública das imagens
CREATE POLICY "Allow public access to property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Política para permitir que usuários autenticados deletem imagens
CREATE POLICY "Allow authenticated users to delete property images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados atualizem imagens
CREATE POLICY "Allow authenticated users to update property images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
