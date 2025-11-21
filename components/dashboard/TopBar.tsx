import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
  userName: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, userName }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      navigate('/login');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="text-slate-600 hover:text-slate-900 text-2xl"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{userName}</p>
          <p className="text-xs text-slate-600">Usuário</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
};
