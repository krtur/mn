// Script para corrigir resultados TDAH sem therapist_id
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-anonima';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTdahResults() {
  console.log('🔧 Iniciando correção de resultados TDAH...');

  try {
    // 1. Buscar todos os resultados TDAH sem therapist_id
    const { data: screenings, error: screeningsError } = await supabase
      .from('tdah_screenings')
      .select('id, patient_id, therapist_id')
      .is('therapist_id', null);

    if (screeningsError) {
      throw screeningsError;
    }

    console.log(`📊 Encontrados ${screenings.length} resultados TDAH sem therapist_id`);

    // 2. Para cada resultado, buscar o therapist_id do paciente
    for (const screening of screenings) {
      console.log(`🔍 Processando screening ${screening.id} do paciente ${screening.patient_id}`);

      // Buscar o therapist_id do paciente
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('therapist_id')
        .eq('id', screening.patient_id)
        .single();

      if (userError) {
        console.error(`❌ Erro ao buscar therapist_id para paciente ${screening.patient_id}:`, userError);
        continue;
      }

      if (!userData?.therapist_id) {
        console.warn(`⚠️ Paciente ${screening.patient_id} não tem therapist_id`);
        continue;
      }

      console.log(`👨‍⚕️ Terapeuta encontrado: ${userData.therapist_id}`);

      // Atualizar o screening com o therapist_id correto
      const { error: updateError } = await supabase
        .from('tdah_screenings')
        .update({ therapist_id: userData.therapist_id })
        .eq('id', screening.id);

      if (updateError) {
        console.error(`❌ Erro ao atualizar screening ${screening.id}:`, updateError);
      } else {
        console.log(`✅ Screening ${screening.id} atualizado com therapist_id ${userData.therapist_id}`);
      }
    }

    console.log('🎉 Correção de resultados TDAH concluída!');
  } catch (error) {
    console.error('❌ Erro durante o processo de correção:', error);
  }
}

// Executar a função
fixTdahResults()
  .then(() => {
    console.log('Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
