-- Verificar políticas RLS para therapist_availability e appointments
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename IN ('therapist_availability', 'appointments');

-- Verificar se RLS está habilitado
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname IN ('therapist_availability', 'appointments');
