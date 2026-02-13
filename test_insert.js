
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    const testId = '00000000-0000-0000-0000-000000000000';

    console.log('🧪 Testando inserção SEM CPF...');
    const { error: error1 } = await supabase
        .from('users')
        .insert([{
            id: testId,
            email: 'test@example.com',
            name: 'Test User',
            phone: '123456789',
            role: 'patient'
        }]);

    if (error1) {
        console.log('❌ Falha sem CPF:', error1.message, '| Código:', error1.code, '| Detalhes:', error1.details);
    } else {
        console.log('✅ Sucesso sem CPF!');
        // Limpar
        await supabase.from('users').delete().eq('id', testId);
    }

    console.log('\n🧪 Testando inserção com CPF NULL...');
    const { error: error2 } = await supabase
        .from('users')
        .insert([{
            id: testId,
            email: 'test@example.com',
            name: 'Test User',
            phone: '123456789',
            role: 'patient',
            cpf: null
        }]);

    if (error2) {
        console.log('❌ Falha com CPF NULL:', error2.message, '| Código:', error2.code);
    } else {
        console.log('✅ Sucesso com CPF NULL!');
        await supabase.from('users').delete().eq('id', testId);
    }
}

testInsert();
