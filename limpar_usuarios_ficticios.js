#!/usr/bin/env node

/**
 * Script para deletar TODOS os usuários fictícios
 * Mantém apenas os 2 terapeutas reais
 * Execute: node limpar_usuarios_ficticios.js
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================================

const SUPABASE_URL = "https://ygfxloachqjeslciyunr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0";

// IDs dos terapeutas que devem ser mantidos
const THERAPIST_IDS = [
  "83273ffc-c878-4abc-a24b-e35fd4801339", // Nadielma
  "028d8869-679f-4093-b435-1a43b6ced0e2"  // Marcelo
];

// ============================================================================
// CONECTAR AO SUPABASE
// ============================================================================

console.log("🔗 Conectando ao Supabase...");
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// FUNÇÃO PARA LIMPAR USUÁRIOS FICTÍCIOS
// ============================================================================

async function limparUsuariosFicticios() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("DELETANDO USUÁRIOS FICTÍCIOS");
    console.log("=".repeat(80));

    // 1. Buscar todos os usuários
    console.log("\n1️⃣  Buscando todos os usuários...");
    const { data: allUsers, error: fetchError } = await supabase
      .from("users")
      .select("id, email, name, role");

    if (fetchError) {
      console.error("❌ Erro ao buscar usuários:", fetchError.message);
      return;
    }

    console.log(`✅ Total de usuários encontrados: ${allUsers?.length || 0}`);

    // 2. Listar usuários a serem deletados
    console.log("\n2️⃣  Usuários a serem deletados:");
    const usersToDelete = allUsers?.filter(
      user => !THERAPIST_IDS.includes(user.id)
    ) || [];

    if (usersToDelete.length === 0) {
      console.log("✅ Nenhum usuário fictício encontrado!");
      console.log("\n" + "=".repeat(80));
      console.log("✅ BANCO DE DADOS JÁ ESTÁ LIMPO!");
      console.log("=".repeat(80));
      return;
    }

    usersToDelete.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

    // 3. Deletar usuários fictícios
    console.log(`\n3️⃣  Deletando ${usersToDelete.length} usuários fictícios...`);

    for (const user of usersToDelete) {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (error) {
        console.error(`   ❌ Erro ao deletar ${user.name}:`, error.message);
      } else {
        console.log(`   ✅ ${user.name} deletado!`);
      }
    }

    // 4. Verificar resultado final
    console.log("\n4️⃣  Verificando resultado final...");
    const { data: remainingUsers } = await supabase
      .from("users")
      .select("id, email, name, role");

    console.log("\n📊 USUÁRIOS RESTANTES:");
    remainingUsers?.forEach(user => {
      console.log(`   ✅ ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ LIMPEZA CONCLUÍDA COM SUCESSO!");
    console.log("=".repeat(80));
    console.log(`\n🎉 ${usersToDelete.length} usuários fictícios foram deletados!`);
    console.log("📱 Recarregue o navegador (F5) para ver as mudanças");
    console.log("\n");

  } catch (error) {
    console.error("\n❌ Erro ao limpar usuários:", error.message);
    process.exit(1);
  }
}

// ============================================================================
// EXECUTAR
// ============================================================================

limparUsuariosFicticios();
