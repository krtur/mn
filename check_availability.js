
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar dotenv
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAvailability() {
    console.log('🔍 Verificando tabela therapist_availability...');

    const { data: availability, error } = await supabase
        .from('therapist_availability')
        .select('*, therapist:users(name, email)');

    if (error) {
        console.error('❌ Erro ao buscar disponibilidade:', error);
        return;
    }

    if (!availability || availability.length === 0) {
        console.log('⚠️ Nenhuma disponibilidade encontrada no banco de dados.');
    } else {
        console.log(`✅ Encontrados ${availability.length} registros de disponibilidade:`);
        availability.forEach(a => {
            console.log(`- Terapeuta: ${a.therapist?.name} (${a.therapist_id})`);
            console.log(`  Dia da semana: ${a.day_of_week} (0=Dom, 1=Seg...)`);
            console.log(`  Horário: ${a.start_time} - ${a.end_time}`);
            console.log('---');
        });
    }
}

checkAvailability();
