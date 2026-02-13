
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUnique() {
    const testId1 = '11111111-1111-1111-1111-111111111111';
    const testId2 = '22222222-2222-2222-2222-222222222222';

    console.log('🧪 Testando se o CPF permite strings vazias duplicadas...');

    try {
        const { error: error1 } = await supabase
            .from('users')
            .insert([{
                id: testId1,
                email: 'test1@example.com',
                name: 'Test 1',
                phone: '1',
                role: 'patient',
                cpf: ''
            }]);

        if (error1) {
            console.log('❌ Falha na primeira inserção:', error1.message);
        } else {
            console.log('✅ Primeira inserção OK');

            const { error: error2 } = await supabase
                .from('users')
                .insert([{
                    id: testId2,
                    email: 'test2@example.com',
                    name: 'Test 2',
                    phone: '2',
                    role: 'patient',
                    cpf: ''
                }]);

            if (error2) {
                console.log('❌ Falha na segunda inserção (Unique constraint?):', error2.message);
            } else {
                console.log('✅ Segunda inserção OK (Não há restrição de unicidade para string vazia)');
                await supabase.from('users').delete().in('id', [testId1, testId2]);
            }
        }
    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await supabase.from('users').delete().in('id', [testId1, testId2]);
    }
}

testUnique();
