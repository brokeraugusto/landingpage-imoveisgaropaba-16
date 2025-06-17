
-- Remove as políticas problemáticas que causam recursão infinita
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Cria uma função SECURITY DEFINER para verificar se o usuário é admin
-- Esta função contorna as políticas RLS e evita recursão
CREATE OR REPLACE FUNCTION public.has_admin_role(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Cria uma função para obter o role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Política simples para admins visualizarem todos os perfis (usando a função)
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.has_admin_role(auth.uid()));

-- Política simples para admins atualizarem todos os perfis (usando a função)
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.has_admin_role(auth.uid()));
