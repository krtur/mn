import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../auth/AuthContext';
import { useAuth } from '../auth/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, userRole }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      window.location.href = '/login';
    }
  };

  const patientMenuItems = [
    { label: 'Dashboard', path: '/dashboard/patient', icon: '📊' },
    { label: 'Agendamentos', path: '/dashboard/patient/appointments', icon: '📅' },
    { label: 'Mensagens', path: '/dashboard/patient/messages', icon: '💬' },
    { label: 'Loja de Testes', path: '/dashboard/patient/test-shop', icon: '🛍️' },
    { label: 'Triagem TDAH', path: '/dashboard/patient/tdah-screening', icon: '🧠' },
  ];

  const therapistMenuItems = [
    { label: 'Dashboard', path: '/dashboard/therapist', icon: '📊' },
    { label: 'Gerenciar Agenda', path: '/dashboard/therapist/schedule', icon: '📅' },
    { label: 'Pacientes', path: '/dashboard/therapist/patients', icon: '👥' },
    { label: 'Mensagens', path: '/dashboard/therapist/messages', icon: '💬' },
    { label: 'Documentos', path: '/dashboard/therapist/documents', icon: '📄' },
    { label: 'Triagens TDAH', path: '/dashboard/therapist/tdah-results', icon: '🧠' },
  ];

  const menuItems = userRole === 'patient' ? patientMenuItems : therapistMenuItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-slate-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
    >
      <div className="p-4 border-b border-slate-700 flex items-center justify-center">
        <img 
          src="/logo.png" 
          alt="M&N Logo" 
          className={`${isOpen ? 'h-12' : 'h-10'} transition-all duration-300`}
        />
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

      <div className="border-t border-slate-700 p-4 space-y-2">
        <Link
          to={userRole === 'patient' ? '/dashboard/patient/profile' : '/dashboard/therapist/profile'}
          className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title={!isOpen ? 'Perfil' : undefined}
        >
          <span className="w-6 h-6 flex items-center justify-center">👤</span>
          {isOpen && <span className="ml-3">Perfil</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-red-600 rounded transition-colors"
          title={!isOpen ? 'Sair' : undefined}
        >
          <span className="w-6 h-6 flex items-center justify-center">🚪</span>
          {isOpen && <span className="ml-3">Sair</span>}
        </button>
      </div>
    </aside>
  );
};
