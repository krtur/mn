import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../auth/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, userRole }) => {
  const location = useLocation();

  const patientMenuItems = [
    { label: 'Dashboard', path: '/dashboard/patient', icon: '📊' },
    { label: 'Agendamentos', path: '/dashboard/patient/appointments', icon: '📅' },
    { label: 'Mensagens', path: '/dashboard/patient/messages', icon: '💬' },
    { label: 'Relatórios', path: '/dashboard/patient/reports', icon: '📋' },
    { label: 'Loja de Testes', path: '/dashboard/patient/test-shop', icon: '🛍️' },
    { label: 'Triagem TDAH', path: '/dashboard/patient/tdah-screening', icon: '🧠' },
    { label: 'Histórico', path: '/dashboard/patient/attendance', icon: '📈' },
    { label: 'Perfil', path: '/dashboard/patient/profile', icon: '👤' },
  ];

  const therapistMenuItems = [
    { label: 'Dashboard', path: '/dashboard/therapist', icon: '📊' },
    { label: 'Gerenciar Agenda', path: '/dashboard/therapist/schedule', icon: '📅' },
    { label: 'Pacientes', path: '/dashboard/therapist/patients', icon: '👥' },
    { label: 'Mensagens', path: '/dashboard/therapist/messages', icon: '💬' },
    { label: 'Documentos', path: '/dashboard/therapist/documents', icon: '📄' },
    { label: 'Perfil', path: '/dashboard/therapist/profile', icon: '👤' },
  ];

  const menuItems = userRole === 'patient' ? patientMenuItems : therapistMenuItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-slate-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
    >
      <div className="p-4 border-b border-slate-700">
        <div className="text-xl font-bold truncate">{isOpen ? 'M&N' : 'MN'}</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item: any) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 transition-colors ${
              isActive(item.path)
                ? 'bg-teal-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title={!isOpen ? item.label : undefined}
          >
            <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors">
          {isOpen ? 'Sair' : '🚪'}
        </button>
      </div>
    </aside>
  );
};
