# ✅ Solução Final - Erro 401 RLS

**Problema**: Política já existe e está bloqueando cadastro
**Solução**: Limpar tudo e recriar com políticas simples

---

## 🚀 Execute Agora (1 minuto)

### Passo 1: Abrir SQL
Abra o arquivo: **`SUPABASE_FINAL_FIX.sql`**

### Passo 2: Copiar Tudo
Copie TODO o conteúdo (Ctrl+A, Ctrl+C)

### Passo 3: Executar no Supabase
1. Abra: https://app.supabase.com
2. Clique em: **SQL Editor**
3. Clique em: **New Query**
4. Cole o SQL (Ctrl+V)
5. Clique em: **Run** (botão azul)

**Resultado esperado**:
```
✓ DROP POLICY (múltiplas vezes)
✓ ALTER TABLE DISABLE ROW LEVEL SECURITY
✓ ALTER TABLE ENABLE ROW LEVEL SECURITY
✓ CREATE POLICY (4 vezes)
```

### Passo 4: Testar Cadastro
1. Volte para: http://localhost:3000
2. Clique em: **"Não tem conta? Cadastre-se"**
3. Preencha:
   - Email: `novo@example.com`
   - CPF: `12345678901`
   - Nome: `Novo Usuário`
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

## 📊 O Que Este SQL Faz

1. **Remove TODAS as políticas antigas** (que estavam conflitando)
2. **Desabilita RLS** temporariamente
3. **Reabilita RLS** com políticas limpas
4. **Cria 4 políticas simples** (uma por tabela)

---

## ✨ Resultado

Após executar:
- ✅ Cadastro funciona
- ✅ Login funciona
- ✅ Perfil funciona
- ✅ Documentos funcionam
- ✅ Agendamentos funcionam
- ✅ Mensagens funcionam

---

## ⚠️ Importante

Essas políticas são **permissivas demais para produção**.

Para produção, você precisará de políticas mais restritivas (como no `SUPABASE_RLS_FIX.sql`).

---

## 🎉 Pronto!

Execute o SQL e o cadastro deve funcionar perfeitamente! ✅

---

**Última atualização**: 20 de Novembro de 2025
