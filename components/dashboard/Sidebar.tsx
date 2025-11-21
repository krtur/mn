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
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Agendamentos', path: '/dashboard/appointments' },
    { label: 'Mensagens', path: '/dashboard/messages' },
    { label: 'Relatórios', path: '/dashboard/reports' },
    { label: 'Loja de Testes', path: '/dashboard/test-shop' },
    { label: 'Histórico', path: '/dashboard/attendance' },
    { label: 'Perfil', path: '/dashboard/profile' },
  ];

  const therapistMenuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Agenda', path: '/dashboard/schedule' },
    { label: 'Pacientes', path: '/dashboard/patients' },
    { label: 'Mensagens', path: '/dashboard/messages' },
    { label: 'Documentos', path: '/dashboard/documents' },
    { label: 'Perfil', path: '/dashboard/profile' },
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
        {menuItems.map((item) => (
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
            <span className="w-6 h-6 flex items-center justify-center">📄</span>
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
