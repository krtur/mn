-- ============================================
-- ASSOCIAR TERAPEUTA AO JONAS
-- ============================================

-- 1. Ver dados do Jonas
SELECT id, name, email, role, therapist_id 
FROM users 
WHERE name = 'Jonas Machado' OR email LIKE '%jonas%';

-- 2. Ver terapeutas disponíveis
SELECT id, name, email, role 
FROM users 
WHERE role LIKE 'therapist%';

-- 3. Associar Jonas a Marcelo (terapeuta)
-- Substitua o ID do Marcelo se necessário
UPDATE users 
SET therapist_id = '028d8869-679f-4093-b435-1a43b6ced0e2'
WHERE name = 'Jonas Machado' AND role = 'patient';

-- 4. Verificar se foi atualizado
SELECT id, name, email, role, therapist_id 
FROM users 
WHERE name = 'Jonas Machado';
