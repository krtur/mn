import { useState, useEffect } from 'react';
import { useAppointments } from './useAppointments';
import { useMessages } from './useMessages';
import { useDocuments } from './useDocuments';
import { usePatients } from './usePatients';
import { useAuth } from '../components/auth/AuthContext';

export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalMessages: number;
  unreadMessages: number;
  totalDocuments: number;
  totalPatients: number;
  appointmentsToday: number;
}

export const useDashboardStats = (): DashboardStats & { loading: boolean; error: string | null } => {
  const { user } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { conversations, loading: messagesLoading } = useMessages();
  const { documents, loading: documentsLoading } = useDocuments();
  const { patients, loading: patientsLoading } = usePatients();

  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    upcomingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalDocuments: 0,
    totalPatients: 0,
    appointmentsToday: 0,
  });

  useEffect(() => {
    if (!user) return;

    // Calcular estatísticas
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingAppointments = appointments.filter(
      (apt) => new Date(apt.start_time) > now && apt.status !== 'cancelled'
    );

    const confirmedAppointments = appointments.filter(
      (apt) => apt.status === 'confirmed'
    );

    const cancelledAppointments = appointments.filter(
      (apt) => apt.status === 'cancelled'
    );

    const appointmentsToday = appointments.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime() && apt.status !== 'cancelled';
    });

    const unreadMessages = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

    setStats({
      totalAppointments: appointments.length,
      upcomingAppointments: upcomingAppointments.length,
      confirmedAppointments: confirmedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      totalMessages: conversations.length,
      unreadMessages,
      totalDocuments: documents.length,
      totalPatients: patients.length,
      appointmentsToday: appointmentsToday.length,
    });
  }, [appointments, conversations, documents, patients, user]);

  return {
    ...stats,
    loading: appointmentsLoading || messagesLoading || documentsLoading || patientsLoading,
    error: null,
  };
};
