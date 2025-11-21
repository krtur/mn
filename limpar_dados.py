#!/usr/bin/env python3
"""
Script para limpar dados fictícios do Supabase
Execute: python limpar_dados.py
"""

import os
from supabase import create_client, Client

# ============================================================================
# CONFIGURAÇÃO DO SUPABASE
# ============================================================================

SUPABASE_URL = "https://ygfxloachqjeslciyunr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZnhsb2FjaHFqZXNsY2l5dW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkxODYsImV4cCI6MjA3OTIzNTE4Nn0.bDtFyaGOZWG4PmpykJ-ebr_cqQB1dMBIF7ottQlQqR0"

# IDs dos terapeutas
THERAPIST_IDS = {
    "nadi": "83273ffc-c878-4abc-a24b-e35fd4801339",
    "marcelo": "028d8869-679f-4093-b435-1a43b6ced0e2"
}

# ============================================================================
# CONECTAR AO SUPABASE
# ============================================================================

print("🔗 Conectando ao Supabase...")
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Conectado ao Supabase!")
except Exception as e:
    print(f"❌ Erro ao conectar: {e}")
    exit(1)

# ============================================================================
# FUNÇÃO PARA DELETAR DADOS
# ============================================================================

def limpar_dados():
    try:
        print("\n" + "="*80)
        print("LIMPANDO DADOS FICTÍCIOS")
        print("="*80)
        
        # 1. Deletar documentos
        print("\n1️⃣  Deletando documentos...")
        supabase.table("documents").delete().neq("id", "").execute()
        print("✅ Documentos deletados!")
        
        # 2. Deletar mensagens
        print("\n2️⃣  Deletando mensagens...")
        supabase.table("messages").delete().neq("id", "").execute()
        print("✅ Mensagens deletadas!")
        
        # 3. Deletar agendamentos
        print("\n3️⃣  Deletando agendamentos...")
        supabase.table("appointments").delete().neq("id", "").execute()
        print("✅ Agendamentos deletados!")
        
        # 4. Deletar pacientes fictícios
        print("\n4️⃣  Deletando pacientes fictícios...")
        supabase.table("users").delete().eq("role", "patient").execute()
        print("✅ Pacientes fictícios deletados!")
        
        # 5. Deletar terapeutas antigos (se houver)
        print("\n5️⃣  Deletando terapeutas antigos...")
        supabase.table("users").delete().neq("id", "").execute()
        print("✅ Terapeutas antigos deletados!")
        
        # 6. Recriar terapeutas
        print("\n6️⃣  Recriando terapeutas...")
        
        therapists = [
            {
                "id": THERAPIST_IDS["nadi"],
                "email": "nadi@mnterapeutas.com",
                "name": "Nadielma",
                "cpf": "000.000.000-00",
                "phone": "(11) 99999-9999",
                "role": "therapist_a",
                "created_at": "2025-11-21T00:00:00Z",
                "updated_at": "2025-11-21T00:00:00Z"
            },
            {
                "id": THERAPIST_IDS["marcelo"],
                "email": "marcelo@mnterapeutas.com",
                "name": "Marcelo",
                "cpf": "000.000.000-00",
                "phone": "(11) 99999-9999",
                "role": "therapist_b",
                "created_at": "2025-11-21T00:00:00Z",
                "updated_at": "2025-11-21T00:00:00Z"
            }
        ]
        
        for therapist in therapists:
            supabase.table("users").insert(therapist).execute()
            print(f"✅ Terapeuta {therapist['name']} recriado!")
        
        # 7. Verificar resultado
        print("\n7️⃣  Verificando resultado...")
        
        users = supabase.table("users").select("*").execute()
        appointments = supabase.table("appointments").select("*").execute()
        messages = supabase.table("messages").select("*").execute()
        documents = supabase.table("documents").select("*").execute()
        
        print(f"\n📊 RESULTADO FINAL:")
        print(f"   Usuários: {len(users.data)}")
        print(f"   Agendamentos: {len(appointments.data)}")
        print(f"   Mensagens: {len(messages.data)}")
        print(f"   Documentos: {len(documents.data)}")
        
        print("\n" + "="*80)
        print("✅ LIMPEZA CONCLUÍDA COM SUCESSO!")
        print("="*80)
        print("\n🎉 Dados fictícios removidos!")
        print("📱 Recarregue o navegador (F5) para ver as mudanças")
        
    except Exception as e:
        print(f"\n❌ Erro ao limpar dados: {e}")
        exit(1)

# ============================================================================
# EXECUTAR
# ============================================================================

if __name__ == "__main__":
    limpar_dados()
