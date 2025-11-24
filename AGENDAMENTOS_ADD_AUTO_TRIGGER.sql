-- ============================================
-- ADICIONAR TRIGGER AUTOMÁTICO PARA GERAR RECORRÊNCIAS
-- ============================================

-- Criar função que gera agendamentos quando uma recorrência é criada
CREATE OR REPLACE FUNCTION generate_appointments_on_recurrence_insert()
RETURNS TRIGGER AS $$
DECLARE
  loop_date DATE;
  next_date DATE;
  appointment_start TIMESTAMP;
  appointment_end TIMESTAMP;
BEGIN
  loop_date := NEW.start_date;
  
  WHILE loop_date <= COALESCE(NEW.end_date, CURRENT_DATE + INTERVAL '1 year') LOOP
    -- Verificar se já existe agendamento para esta data
    IF NOT EXISTS (
      SELECT 1 FROM appointments 
      WHERE recurrence_id = NEW.id 
      AND DATE(start_time) = loop_date
    ) THEN
      appointment_start := loop_date || ' ' || NEW.start_time;
      appointment_end := loop_date || ' ' || NEW.end_time;
      
      INSERT INTO appointments (
        patient_id, therapist_id, start_time, end_time, 
        status, recurrence_id
      ) VALUES (
        NEW.patient_id, NEW.therapist_id, appointment_start, appointment_end,
        'confirmed', NEW.id
      );
    END IF;
    
    -- Calcular próxima data
    CASE NEW.frequency
      WHEN 'weekly' THEN
        next_date := loop_date + INTERVAL '1 week';
      WHEN 'biweekly' THEN
        next_date := loop_date + INTERVAL '2 weeks';
      WHEN 'monthly' THEN
        next_date := loop_date + INTERVAL '1 month';
      ELSE
        next_date := loop_date + INTERVAL '1 week';
    END CASE;
    
    loop_date := next_date;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS generate_appointments_on_recurrence_insert_trigger ON appointment_recurrences;

-- Criar trigger que executa quando uma recorrência é inserida
CREATE TRIGGER generate_appointments_on_recurrence_insert_trigger
AFTER INSERT ON appointment_recurrences
FOR EACH ROW
EXECUTE FUNCTION generate_appointments_on_recurrence_insert();

-- ============================================
-- RESULTADO
-- ============================================
-- Agora quando você criar uma recorrência, os agendamentos serão gerados automaticamente
-- Você não precisa mais executar SELECT generate_recurring_appointments();
