-- Verificar configurações de autenticação

-- 1. Verificar se o serviço de autenticação está habilitado
SELECT * FROM pg_extension WHERE extname = 'pgjwt';

-- 2. Verificar configurações de autenticação anônima
SELECT * FROM pg_roles WHERE rolname = 'anon';

-- 3. Verificar permissões do papel anônimo
SELECT 
  r.rolname, 
  r.rolsuper, 
  r.rolinherit,
  r.rolcreaterole,
  r.rolcreatedb,
  r.rolcanlogin,
  r.rolreplication,
  r.rolconnlimit,
  r.rolvaliduntil
FROM pg_roles r
WHERE r.rolname = 'anon';

-- 4. Verificar permissões de tabela para o papel anônimo
SELECT 
  grantee, 
  table_schema, 
  table_name, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'anon';

-- 5. Verificar schemas disponíveis (para identificar onde está a configuração de autenticação)
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name LIKE 'auth%' OR schema_name = 'supabase_auth';

-- 6. Verificar tabelas no schema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

