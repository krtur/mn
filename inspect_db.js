
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ygfxloachqjeslciyunr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos em .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
    console.log('🔍 Inspecionando tabela "users"...');

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Erro ao buscar dados:', error);
        } else {
            console.log('✅ Dados da tabela (exemplo):', data[0]);
        }

        // OPTIONS request via raw fetch
        const optionsResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
            method: 'OPTIONS',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        if (optionsResponse.ok) {
            const schema = await optionsResponse.json();
            console.log('📋 Esquema da tabela (colunas):');
            if (schema.definitions && schema.definitions.users && schema.definitions.users.properties) {
                Object.entries(schema.definitions.users.properties).forEach(([col, details]) => {
                    const isRequired = (schema.definitions.users.required || []).includes(col);
                    console.log(` - ${col}: ${details.type} ${isRequired ? '(Obrigatório)' : '(Opcional)'}`);
                });
            } else {
                console.log(JSON.stringify(schema, null, 2));
            }
        } else {
            console.log('⚠️ OPTIONS não funcionou:', optionsResponse.status);
        }

    } catch (err) {
        console.error('❌ Erro inesperado:', err);
    }
}

inspectTable();
