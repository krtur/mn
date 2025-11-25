-- Atualizar paciente com therapist_id do Marcelo
UPDATE users 
SET therapist_id = '028d8869-679f-4093-b435-1a43b6ced0e2' 
WHERE id = '7b47c09e-30e9-468d-abc9-d2dcdb1f1876';

-- Verificar se foi atualizado
SELECT id, name, email, role, therapist_id 
FROM users 
WHERE id = '7b47c09e-30e9-468d-abc9-d2dcdb1f1876';
