# ⚡ Quick Fix - Erro 401 RLS

**Erro**: `new row violates row-level security policy for table "users"`
**Solução**: Executar SQL para desabilitar RLS

---

## 🚀 Solução em 1 Minuto

### Passo 1: Copiar SQL
Abra o arquivo: `SUPABASE_DISABLE_RLS.sql`

Copie TODO o conteúdo (Ctrl+A, Ctrl+C)

### Passo 2: Executar no Supabase
1. Abra: https://app.supabase.com
2. Clique em: **SQL Editor**
3. Clique em: **New Query**
4. Cole o SQL (Ctrl+V)
5. Clique em: **Run** (botão azul)

**Resultado esperado**:
```
✓ ALTER TABLE
✓ DROP POLICY
✓ CREATE POLICY
... (mais operações)
```

### Passo 3: Testar Cadastro
1. Volte para: http://localhost:3000
2. Clique em: **"Não tem conta? Cadastre-se"**
3. Preencha:
   - Email: `teste@example.com`
   - CPF: `12345678901`
   - Nome: `Teste Silva`
   - Telefone: `11999999999`
   - Perfil: `Paciente`
4. Clique em: **"Criar Conta"**

**Resultado esperado**:
```
✓ Cadastro bem-sucedido
✓ Redirecionado para dashboard
✓ Usuário aparece no Supabase
```

---

## ✅ Pronto!

O cadastro deve funcionar agora! 🎉

---

**Última atualização**: 20 de Novembro de 2025
