-- Verificar se o paciente tem therapist_id
SELECT id, name, email, role, therapist_id 
FROM users 
WHERE id = '7b47c09e-30e9-468d-abc9-d2dcdb1f1876';

-- Se não tiver, atualizar com um terapeuta
-- Descomente a linha abaixo e execute:
-- UPDATE users SET therapist_id = '83273ffc-c878-4abc-a24b-e35fd4801339' WHERE id = '7b47c09e-30e9-468d-abc9-d2dcdb1f1876';
