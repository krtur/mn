#!/usr/bin/env node

/**
 * Script para listar TODOS os usuários do banco
 * Execute: node listar_todos_usuarios.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ygfxloachqjeslciyunr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function listarUsuarios() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("LISTANDO TODOS OS USUÁRIOS DO BANCO");
    console.log("=".repeat(80) + "\n");

    // Buscar TODOS os usuários sem filtro
    const { data: users, error } = await supabase
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Erro ao buscar usuários:", error.message);
      return;
    }

    console.log(`📊 Total de usuários: ${users?.length || 0}\n`);

    if (!users || users.length === 0) {
      console.log("✅ Nenhum usuário encontrado!");
      return;
    }

    // Mostrar cada usuário
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Telefone: ${user.phone}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Criado em: ${user.created_at}`);
      console.log("");
    });

    console.log("=".repeat(80) + "\n");

  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

listarUsuarios();
