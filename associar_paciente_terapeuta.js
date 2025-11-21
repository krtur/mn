#!/usr/bin/env node

/**
 * Script para associar pacientes aos terapeutas
 * Cria um agendamento automático para associação
 * Execute: node associar_paciente_terapeuta.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ygfxloachqjeslciyunr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0";

// IDs dos terapeutas
const THERAPIST_IDS = {
  nadi: "83273ffc-c878-4abc-a24b-e35fd4801339",
  marcelo: "028d8869-679f-4093-b435-1a43b6ced0e2"
};

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function associarPacientes() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("ASSOCIANDO PACIENTES AOS TERAPEUTAS");
    console.log("=".repeat(80));

    // 1. Buscar todos os pacientes
    console.log("\n1️⃣  Buscando pacientes...");
    const { data: patients, error: patientsError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("role", "patient");

    if (patientsError) {
      console.error("❌ Erro ao buscar pacientes:", patientsError.message);
      return;
    }

    if (!patients || patients.length === 0) {
      console.log("✅ Nenhum paciente encontrado");
      return;
    }

    console.log(`✅ ${patients.length} paciente(s) encontrado(s)`);

    // 2. Para cada paciente, criar um agendamento com seu terapeuta
    console.log("\n2️⃣  Criando agendamentos de associação...");

    for (const patient of patients) {
      // Buscar o terapeuta do paciente (baseado no email ou assumir Marcelo)
      // Por enquanto, vamos associar todos ao Marcelo
      const therapistId = THERAPIST_IDS.marcelo;

      // Verificar se já existe agendamento
      const { data: existingAppointment } = await supabase
        .from("appointments")
        .select("id")
        .eq("patient_id", patient.id)
        .eq("therapist_id", therapistId)
        .single();

      if (existingAppointment) {
        console.log(`   ✅ ${patient.name} já está associado`);
        continue;
      }

      // Criar agendamento de associação (data futura)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const { error: insertError } = await supabase
        .from("appointments")
        .insert([
          {
            patient_id: patient.id,
            therapist_id: therapistId,
            start_time: tomorrow.toISOString(),
            end_time: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
            status: "pending",
            notes: "Agendamento de associação automática"
          }
        ]);

      if (insertError) {
        console.error(`   ❌ Erro ao associar ${patient.name}:`, insertError.message);
      } else {
        console.log(`   ✅ ${patient.name} associado ao Marcelo`);
      }
    }

    // 3. Verificar resultado
    console.log("\n3️⃣  Verificando resultado...");
    const { data: appointments } = await supabase
      .from("appointments")
      .select("*")
      .eq("therapist_id", THERAPIST_IDS.marcelo);

    console.log(`\n📊 Total de agendamentos do Marcelo: ${appointments?.length || 0}`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ ASSOCIAÇÃO CONCLUÍDA!");
    console.log("=".repeat(80));
    console.log("\n🎉 Pacientes associados aos terapeutas!");
    console.log("📱 Recarregue o navegador (F5) para ver as mudanças");
    console.log("\n");

  } catch (error) {
    console.error("\n❌ Erro:", error.message);
    process.exit(1);
  }
}

associarPacientes();
