-- Listar IDs e nomes dos terapeutas
SELECT id, name, email, role 
FROM users 
WHERE role LIKE 'therapist%';
