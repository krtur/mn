# 🔧 Ajustes Necessários para Supabase

**Status**: ✅ Identificados e Prontos para Corrigir

---

## 📋 Componentes que Precisam de Ajustes

### 1. ❌ `components/patient/Profile.tsx`
**Problema**: Função `handleSubmit` não salva no Supabase
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsEditing(false);
  // TODO: Integrar com API para atualizar perfil
};
```

**Solução**: Usar `supabaseAPI.user.updateProfile()`

---

### 2. ❌ `components/therapist/Profile.tsx`
**Problema**: Função `handleSubmit` não salva no Supabase
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsEditing(false);
  // TODO: Integrar com API para atualizar perfil
};
```

**Solução**: Usar `supabaseAPI.user.updateProfile()`

---

### 3. ❌ `components/therapist/DocumentGeneration.tsx`
**Problema**: Função `handleSubmit` não salva documento no Supabase
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: Integrar com API para gerar documento
  console.log('Documento gerado:', formData);
};
```

**Solução**: Usar `supabaseAPI.document.create()`

---

## 📊 Componentes que Precisam de Dados Reais

### 4. ⚠️ `components/patient/Appointments.tsx`
**Status**: Usa dados mock
**Necessário**: Carregar agendamentos do Supabase
**Função**: `supabaseAPI.appointment.list()`

### 5. ⚠️ `components/patient/Messages.tsx`
**Status**: Usa dados mock
**Necessário**: Carregar mensagens do Supabase
**Função**: `supabaseAPI.message.list()`

### 6. ⚠️ `components/patient/Reports.tsx`
**Status**: Usa dados mock
**Necessário**: Carregar documentos do Supabase
**Função**: `supabaseAPI.document.list()`

### 7. ⚠️ `components/therapist/Schedule.tsx`
**Status**: Usa dados mock
**Necessário**: Carregar agendamentos do Supabase
**Função**: `supabaseAPI.appointment.list()`

### 8. ⚠️ `components/therapist/PatientList.tsx`
**Status**: Usa dados mock
**Necessário**: Carregar pacientes do Supabase
**Função**: `supabaseAPI.user.listPatients()`

### 9. ⚠️ `components/therapist/Messages.tsx`
**Status**: Usa dados mock
**Necessário**: Carregar mensagens do Supabase
**Função**: `supabaseAPI.message.list()`

---

## 🎯 Prioridade de Correção

### 🔴 CRÍTICO (Corrigir Primeiro)
1. `patient/Profile.tsx` - Atualizar perfil
2. `therapist/Profile.tsx` - Atualizar perfil
3. `therapist/DocumentGeneration.tsx` - Criar documentos

### 🟡 IMPORTANTE (Corrigir Depois)
4. `patient/Appointments.tsx` - Listar agendamentos
5. `patient/Messages.tsx` - Listar mensagens
6. `therapist/Schedule.tsx` - Listar agenda
7. `therapist/PatientList.tsx` - Listar pacientes

### 🟢 OPCIONAL (Melhorias)
8. `patient/Reports.tsx` - Listar relatórios
9. `therapist/Messages.tsx` - Listar mensagens

---

## 📝 Checklist de Correções

### Perfil do Paciente
- [ ] Importar `supabaseAPI`
- [ ] Importar `useAuth`
- [ ] Implementar `handleSubmit` com `updateProfile`
- [ ] Adicionar tratamento de erro
- [ ] Testar atualização

### Perfil do Terapeuta
- [ ] Importar `supabaseAPI`
- [ ] Importar `useAuth`
- [ ] Implementar `handleSubmit` com `updateProfile`
- [ ] Adicionar campos extras (CRP, especializações, bio)
- [ ] Testar atualização

### Geração de Documentos
- [ ] Importar `supabaseAPI`
- [ ] Importar `useAuth`
- [ ] Implementar `handleSubmit` com `document.create`
- [ ] Adicionar validações
- [ ] Testar criação

### Agendamentos (Paciente)
- [ ] Importar `supabaseAPI`
- [ ] Usar `useEffect` para carregar dados
- [ ] Implementar `handleCreate` com `appointment.create`
- [ ] Implementar `handleCancel` com `appointment.cancel`
- [ ] Testar funcionalidades

### Mensagens (Paciente)
- [ ] Importar `supabaseAPI`
- [ ] Usar `useEffect` para carregar dados
- [ ] Implementar `handleSend` com `message.send`
- [ ] Adicionar realtime com `realtimeAPI.subscribeToMessages`
- [ ] Testar envio e recebimento

---

## 🚀 Próximas Ações

1. **Hoje**: Corrigir os 3 componentes críticos
2. **Amanhã**: Corrigir os 4 componentes importantes
3. **Próxima semana**: Melhorias opcionais

---

**Tempo Estimado**:
- Crítico: ~1 hora
- Importante: ~2 horas
- Opcional: ~1 hora
- **Total**: ~4 horas

---

**Status**: ✅ Pronto para Corrigir
