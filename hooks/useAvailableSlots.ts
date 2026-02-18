import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface TimeSlot {
    time: string; // "10:00"
    available: boolean;
}

export const useAvailableSlots = (therapistId: string, date: string) => {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!therapistId || !date) {
            setSlots([]);
            return;
        }

        const fetchAvailability = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log(`🔍 Buscando disponibilidade para ${date} (Terapeuta: ${therapistId})`);

                // 1. Determinar dia da semana (0-6)
                // Correção de fuso horário: criar data com horário meio-dia para evitar problemas de timezone
                const dateObj = new Date(`${date}T12:00:00`);
                const dayOfWeek = dateObj.getDay();

                // 2. Buscar horário de trabalho do terapeuta para esse dia
                const { data: availabilityData, error: availError } = await supabase
                    .from('therapist_availability')
                    .select('*')
                    .eq('therapist_id', therapistId)
                    .eq('day_of_week', dayOfWeek)
                    .eq('is_active', true);

                if (availError) throw availError;

                if (!availabilityData || availabilityData.length === 0) {
                    console.log('❌ Terapeuta não atende neste dia da semana');
                    setSlots([]);
                    return;
                }

                // 3. Buscar agendamentos existentes para esse dia
                // Intervalo do dia inteiro
                const startOfDay = `${date}T00:00:00`;
                const endOfDay = `${date}T23:59:59`;

                const { data: existingAppointments, error: aptError } = await supabase
                    .from('appointments')
                    .select('start_time, end_time')
                    .eq('therapist_id', therapistId)
                    .gte('end_time', startOfDay) // Termina depois do início do dia
                    .lte('start_time', endOfDay) // Começa antes do fim do dia
                    .neq('status', 'cancelled'); // Ignorar cancelados

                if (aptError) throw aptError;

                console.log('📅 Agendamentos existentes:', existingAppointments);

                // 4. Gerar slots disponíveis
                const generatedSlots: TimeSlot[] = [];

                // Para cada bloco de disponibilidade do terapeuta
                availabilityData.forEach(block => {
                    // Block.start_time ex: "09:00:00" -> Pegar apenas "09:00"
                    let currentHour = parseInt(block.start_time.split(':')[0]);
                    let currentMinute = parseInt(block.start_time.split(':')[1]);

                    const endHour = parseInt(block.end_time.split(':')[0]);
                    const endMinute = parseInt(block.end_time.split(':')[1]);

                    // Converter para minutos para facilitar comparação
                    let currentTimeInMinutes = currentHour * 60 + currentMinute;
                    const endTimeInMinutes = endHour * 60 + endMinute;

                    // Duração da sessão: 60 minutos
                    const sessionDuration = 60;

                    // Gerar slots de 30 em 30 minutos (horas inteiras e meias)
                    while (currentTimeInMinutes + sessionDuration <= endTimeInMinutes) {
                        const h = Math.floor(currentTimeInMinutes / 60);
                        const m = currentTimeInMinutes % 60;
                        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

                        // Verificar conflitos
                        const slotStart = new Date(`${date}T${timeString}:00`);
                        const slotEnd = new Date(slotStart.getTime() + sessionDuration * 60000);

                        const isBlocked = existingAppointments?.some(apt => {
                            const aptStart = new Date(apt.start_time);
                            const aptEnd = new Date(apt.end_time);

                            // Lógica de sobreposição: (StartA < EndB) && (EndA > StartB)
                            return (slotStart < aptEnd && slotEnd > aptStart);
                        });

                        if (!isBlocked) {
                            generatedSlots.push({ time: timeString, available: true });
                        }

                        // Incrementar 30 minutos
                        currentTimeInMinutes += 30;
                    }
                });

                // Ordenar slots
                generatedSlots.sort((a, b) => a.time.localeCompare(b.time));

                setSlots(generatedSlots);

            } catch (err) {
                console.error('Erro ao calcular slots:', err);
                setError('Erro ao carregar horários disponíveis');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [therapistId, date]);

    return { slots, loading, error };
};
