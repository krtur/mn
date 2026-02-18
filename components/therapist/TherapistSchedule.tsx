import React, { useState, useEffect } from 'react';
import { useTherapistAvailability } from '../../hooks/useTherapistAvailability';
import { supabase } from '../../services/supabase';
import { useAuth } from '../auth/AuthContext';

interface DaySchedule {
    dayOfWeek: number;
    isOpen: boolean;
    startTime: string;
    endTime: string;
    dbId?: string; // ID do registro no banco se existir
}

const DAYS_OF_WEEK = [
    { id: 1, label: 'Segunda-Feira' },
    { id: 2, label: 'Terça-Feira' },
    { id: 3, label: 'Quarta-Feira' },
    { id: 4, label: 'Quinta-Feira' },
    { id: 5, label: 'Sexta-Feira' },
    { id: 6, label: 'Sábado' },
    { id: 0, label: 'Domingo' },
];

export const TherapistSchedule: React.FC = () => {
    const { user } = useAuth();
    const { availability, loading, addAvailability, removeAvailability, updateAvailability } = useTherapistAvailability();

    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [saving, setSaving] = useState(false);

    // Inicializar estado com base na disponibilidade vinda do hook
    useEffect(() => {
        if (loading) return;

        const initialSchedule: DaySchedule[] = DAYS_OF_WEEK.map(day => {
            // Tenta encontrar configuração existente para o dia
            const existing = availability.find(a => a.day_of_week === day.id);

            return {
                dayOfWeek: day.id,
                isOpen: !!existing,
                startTime: existing?.start_time || '08:00',
                endTime: existing?.end_time || '18:00',
                dbId: existing?.id
            };
        });

        setSchedule(initialSchedule);
    }, [availability, loading]);

    const handleToggleDay = (dayIndex: number) => {
        setSchedule(prev => prev.map((day, idx) => {
            if (idx === dayIndex) {
                return { ...day, isOpen: !day.isOpen };
            }
            return day;
        }));
    };

    const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
        setSchedule(prev => prev.map((day, idx) => {
            if (idx === dayIndex) {
                return { ...day, [field]: value };
            }
            return day;
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        try {
            // Processar cada dia
            const promises = schedule.map(async (day) => {
                // 1. Se estava aberto e foi fechado -> Deletar
                if (day.dbId && !day.isOpen) {
                    await removeAvailability(day.dbId);
                }
                // 2. Se estava fechado e foi aberto -> Criar
                else if (!day.dbId && day.isOpen) {
                    await addAvailability(day.dayOfWeek, day.startTime, day.endTime);
                }
                // 3. Se continua aberto, verificar se horários mudaram -> Atualizar
                else if (day.dbId && day.isOpen) {
                    const original = availability.find(a => a.id === day.dbId);
                    if (original && (original.start_time !== day.startTime + ':00' || original.end_time !== day.endTime + ':00')) {
                        // Nota: start_time vem do banco como HH:MM:SS, o input é HH:MM. 
                        // Adicionar :00 para comparar ou ignorar segundos na comparação
                        await updateAvailability(day.dbId, day.startTime, day.endTime);
                    }
                }
            });

            await Promise.all(promises);
            alert('Horários atualizados com sucesso!');

        } catch (err) {
            console.error('Erro ao salvar horários:', err);
            alert('Erro ao salvar horários. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Configurar Disponibilidade Semanal</h2>

            <div className="space-y-6">
                {schedule.map((day, index) => {
                    const dayLabel = DAYS_OF_WEEK.find(d => d.id === day.dayOfWeek)?.label;

                    return (
                        <div key={day.dayOfWeek} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0">
                            <div className="w-32 font-medium text-slate-700">
                                {dayLabel}
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Toggle */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={day.isOpen}
                                        onChange={() => handleToggleDay(index)}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>

                                {/* Time Inputs */}
                                <div className={`flex items-center gap-2 transition-opacity ${day.isOpen ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 uppercase">Abre:</span>
                                        <input
                                            type="time"
                                            value={day.startTime}
                                            onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                            className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 uppercase">Fecha:</span>
                                        <input
                                            type="time"
                                            value={day.endTime}
                                            onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                            className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Salvando...
                        </>
                    ) : (
                        <>
                            💾 Salvar Horários
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
