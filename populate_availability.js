
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

const therapists = [
    { id: '83273ffc-c878-4abc-a24b-e35fd4801339', name: 'Nadielma' },
    { id: '028d8869-679f-4093-b435-1a43b6ced0e2', name: 'Marcelo' }
];

async function populateAvailability() {
    console.log('🚀 Iniciando população de horários...');

    for (const therapist of therapists) {
        console.log(`Processing ${therapist.name}...`);

        // Deletar existentes para evitar duplicatas (reset)
        const { error: deleteError } = await supabase
            .from('therapist_availability')
            .delete()
            .eq('therapist_id', therapist.id);

        if (deleteError) {
            console.error(`Erro ao limpar horários de ${therapist.name}:`, deleteError);
            continue;
        }

        const newSlots = [];
        // 1=Segunda a 5=Sexta
        for (let day = 1; day <= 5; day++) {
            newSlots.push({
                therapist_id: therapist.id,
                day_of_week: day,
                start_time: '08:00:00',
                end_time: '18:00:00',
                is_active: true
            });
        }

        const { error: insertError } = await supabase
            .from('therapist_availability')
            .insert(newSlots);

        if (insertError) {
            console.error(`❌ Erro ao inserir para ${therapist.name}:`, insertError);
        } else {
            console.log(`✅ Horários inseridos para ${therapist.name}`);
        }
    }
}

populateAvailability();
