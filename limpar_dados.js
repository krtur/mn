#!/usr/bin/env node

/**
 * Script para limpar dados fictícios do Supabase
 * Execute: node limpar_dados.js
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================================

const SUPABASE_URL = "https://ygfxloachqjeslciyunr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0";

// IDs dos terapeutas
const THERAPIST_IDS = {
  nadi: "83273ffc-c878-4abc-a24b-e35fd4801339",
  marcelo: "028d8869-679f-4093-b435-1a43b6ced0e2"
};

// ============================================================================
// CONECTAR AO SUPABASE
// ============================================================================

console.log("🔗 Conectando ao Supabase...");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// FUNÇÃO PARA LIMPAR DADOS
// ============================================================================

async function limparDados() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("LIMPANDO DADOS FICTÍCIOS");
    console.log("=".repeat(80));

    // 1. Deletar documentos
    console.log("\n1️⃣  Deletando documentos...");
    await supabase.from("documents").delete().neq("id", "");
    console.log("✅ Documentos deletados!");

    // 2. Deletar mensagens
    console.log("\n2️⃣  Deletando mensagens...");
    await supabase.from("messages").delete().neq("id", "");
    console.log("✅ Mensagens deletadas!");

    // 3. Deletar agendamentos
    console.log("\n3️⃣  Deletando agendamentos...");
    await supabase.from("appointments").delete().neq("id", "");
    console.log("✅ Agendamentos deletados!");

    // 4. Deletar pacientes fictícios
    console.log("\n4️⃣  Deletando pacientes fictícios...");
    await supabase.from("users").delete().eq("role", "patient");
    console.log("✅ Pacientes fictícios deletados!");

    // 5. Deletar terapeutas antigos
    console.log("\n5️⃣  Deletando terapeutas antigos...");
    await supabase.from("users").delete().neq("id", "");
    console.log("✅ Terapeutas antigos deletados!");

    // 6. Recriar terapeutas
    console.log("\n6️⃣  Recriando terapeutas...");

    const therapists = [
      {
        id: THERAPIST_IDS.nadi,
        email: "nadi@mnterapeutas.com",
        name: "Nadielma",
        cpf: "000.000.000-00",
        phone: "(11) 99999-9999",
        role: "therapist_a",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: THERAPIST_IDS.marcelo,
        email: "marcelo@mnterapeutas.com",
        name: "Marcelo",
        cpf: "000.000.000-00",
        phone: "(11) 99999-9999",
        role: "therapist_b",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const therapist of therapists) {
      const { error } = await supabase.from("users").insert([therapist]);
      if (error) {
        console.error(`❌ Erro ao criar ${therapist.name}:`, error.message);
      } else {
        console.log(`✅ Terapeuta ${therapist.name} recriado!`);
      }
    }

    // 7. Verificar resultado
    console.log("\n7️⃣  Verificando resultado...");

    const { data: users } = await supabase.from("users").select("*");
    const { data: appointments } = await supabase.from("appointments").select("*");
    const { data: messages } = await supabase.from("messages").select("*");
    const { data: documents } = await supabase.from("documents").select("*");

    console.log("\n📊 RESULTADO FINAL:");
    console.log(`   Usuários: ${users?.length || 0}`);
    console.log(`   Agendamentos: ${appointments?.length || 0}`);
    console.log(`   Mensagens: ${messages?.length || 0}`);
    console.log(`   Documentos: ${documents?.length || 0}`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ LIMPEZA CONCLUÍDA COM SUCESSO!");
    console.log("=".repeat(80));
    console.log("\n🎉 Dados fictícios removidos!");
    console.log("📱 Recarregue o navegador (F5) para ver as mudanças");
    console.log("\n");

  } catch (error) {
    console.error("\n❌ Erro ao limpar dados:", error.message);
    process.exit(1);
  }
}

// ============================================================================
// EXECUTAR
// ============================================================================

limparDados();
