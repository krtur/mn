import React, { useState } from 'react';

export type ViewType = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  color?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onCreateEvent?: (date: Date, time?: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateSelect,
  onEventClick,
  onCreateEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-teal-100 border-teal-300 text-teal-800';
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Dias vazios do mês anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-slate-50 min-h-24"></div>
      );
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`min-h-24 p-2 border cursor-pointer transition-colors ${
            isToday ? 'bg-teal-50 border-teal-300' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
          onClick={() => {
            onDateSelect?.(date);
            onCreateEvent?.(date);
          }}
        >
          <div className={`text-sm font-semibold ${isToday ? 'text-teal-600' : 'text-slate-700'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border cursor-pointer ${getEventColor(event.status)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
              >
                <div className="truncate font-semibold">{event.title}</div>
                <div className="truncate">{formatTime(event.start)}</div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-slate-500 px-1">
                +{dayEvents.length - 2} mais
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1 bg-slate-200 p-1 rounded-lg">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
          <div key={day} className="bg-slate-700 text-white text-center py-2 font-semibold text-sm rounded">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = getWeekStart(currentDate);
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      weekDays.push(
        <div
          key={i}
          className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors ${
            isToday ? 'bg-teal-50 border-teal-300' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
          onClick={() => {
            onDateSelect?.(date);
            onCreateEvent?.(date);
          }}
        >
          <div className={`text-sm font-semibold ${isToday ? 'text-teal-600' : 'text-slate-700'}`}>
            {date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
          </div>
          <div className="mt-2 space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-2 rounded border cursor-pointer ${getEventColor(event.status)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
              >
                <div className="font-semibold">{event.title}</div>
                <div>{formatTime(event.start)}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-2">{weekDays}</div>;
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate).sort((a, b) => a.start.getTime() - b.start.getTime());
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="space-y-2">
        <div className="text-lg font-semibold text-slate-900">
          {currentDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {hours.map(hour => {
            const hourEvents = dayEvents.filter(event => event.start.getHours() === hour);
            return (
              <div key={hour} className="flex gap-2">
                <div className="w-12 text-sm font-semibold text-slate-600 text-right">
                  {String(hour).padStart(2, '0')}:00
                </div>
                <div className="flex-1 space-y-1">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={`p-2 rounded border cursor-pointer ${getEventColor(event.status)}`}
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors font-semibold"
          >
            Hoje
          </button>
          <button
            onClick={goToNext}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Próximo →
          </button>
        </div>

        <div className="text-lg font-semibold text-slate-900">
          {currentDate.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewType('month')}
            className={`px-3 py-2 rounded-lg transition-colors font-semibold ${
              viewType === 'month'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setViewType('week')}
            className={`px-3 py-2 rounded-lg transition-colors font-semibold ${
              viewType === 'week'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewType('day')}
            className={`px-3 py-2 rounded-lg transition-colors font-semibold ${
              viewType === 'day'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            Dia
          </button>
        </div>
      </div>

      {/* Calendário */}
      <div className="bg-white rounded-lg shadow p-4">
        {viewType === 'month' && renderMonthView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
      </div>
    </div>
  );
};
