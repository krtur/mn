import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../auth/AuthContext';
import { useAuth } from '../auth/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
}

interface MenuItem {
  label: string;
  path?: string;
  icon: string;
  children?: MenuItem[];
}

interface CategoryProps {
  title: string;
  icon: string;
  isOpen: boolean;
  expanded: boolean;
  toggleExpand: () => void;
  children: React.ReactNode;
}

// Definir os itens do menu fora do componente para evitar dependências circulares
const patientMenuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard/patient', icon: '📊' },
    { 
      label: 'Agendamentos', 
      icon: '📅',
      children: [
        { label: 'Meus Agendamentos', path: '/dashboard/patient/appointments', icon: '📆' },
        // Solicitação de horário está dentro do componente Appointments
        { label: 'Solicitar Horário', path: '/dashboard/patient/appointments', icon: '➕' }
      ] 
    },
    { label: 'Mensagens', path: '/dashboard/patient/messages', icon: '💬' },
    { label: 'Loja de Testes', path: '/dashboard/patient/test-shop', icon: '🛍️' },
    { 
      label: 'Avaliações', 
      icon: '🧠',
      children: [
        { label: 'Triagem TDAH', path: '/dashboard/patient/tdah-screening', icon: '🧠' },
        // Resultados são mostrados no final da triagem
        { label: 'Meus Resultados', path: '/dashboard/patient/tdah-screening', icon: '📊' }
      ] 
    },
  ];

const therapistMenuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard/therapist', icon: '📊' },
    { 
      label: 'Agenda', 
      icon: '📅',
      children: [
        { label: 'Gerenciar Agenda', path: '/dashboard/therapist/schedule', icon: '📆' },
        // Novo agendamento está dentro do componente ScheduleManager
        { label: 'Novo Agendamento', path: '/dashboard/therapist/schedule?action=new', icon: '➕' },
        // Solicitações estão dentro do componente ScheduleManager
        { label: 'Solicitações', path: '/dashboard/therapist/schedule?tab=requests', icon: '🔔' }
      ] 
    },
    { 
      label: 'Pacientes', 
      icon: '👥',
      children: [
        { label: 'Meus Pacientes', path: '/dashboard/therapist/patients', icon: '👥' },
        { label: 'Adicionar Paciente', path: '/dashboard/therapist/patient-registration', icon: '➕' }
      ] 
    },
    { label: 'Mensagens', path: '/dashboard/therapist/messages', icon: '💬' },
    { 
      label: 'Documentos', 
      icon: '📄',
      children: [
        { label: 'Todos Documentos', path: '/dashboard/therapist/documents', icon: '📄' },
        // Criar documento está dentro do componente DocumentGeneration
        { label: 'Criar Documento', path: '/dashboard/therapist/documents', icon: '✏️' }
      ] 
    },
    { 
      label: 'Triagens', 
      icon: '🧠',
      children: [
        { label: 'Resultados TDAH', path: '/dashboard/therapist/tdah-results', icon: '📊' },
        // Análise está dentro do componente TdahResults
        { label: 'Análise de Dados', path: '/dashboard/therapist/tdah-results', icon: '📈' }
      ] 
    },
  ];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, userRole }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  // Verifica se uma rota está ativa, incluindo subrotas e query params
  const isActive = (path?: string) => {
    if (!path) return false;
    
    // Separar o caminho base e os parâmetros de query
    const [basePath, queryString] = path.split('?');
    
    // Verificar se o caminho base corresponde
    const pathMatches = location.pathname === basePath ||
                       (basePath.endsWith('/') && location.pathname.startsWith(basePath)) ||
                       location.pathname.startsWith(basePath + '/');
    
    // Se não há query string no link, basta verificar o caminho
    if (!queryString) return pathMatches;
    
    // Se há query string, verificar se os parâmetros correspondem
    if (pathMatches) {
      const linkParams = new URLSearchParams(queryString);
      const currentParams = new URLSearchParams(location.search);
      
      // Verificar se todos os parâmetros do link estão presentes na URL atual
      for (const [key, value] of linkParams.entries()) {
        if (currentParams.get(key) !== value) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      window.location.href = '/login';
    }
  };

  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    agenda: false,
    pacientes: false,
    documentos: false,
    triagens: false,
    avaliacoes: false,
    agendamentos: false
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const menuItems = userRole === 'patient' ? patientMenuItems : therapistMenuItems;
  
  // Função para verificar se uma categoria deve ser expandida
  useEffect(() => {
    const currentMenuItems = userRole === 'patient' ? patientMenuItems : therapistMenuItems;
    
    // Verificar cada item do menu
    currentMenuItems.forEach(item => {
      if (item.children) {
        const categoryKey = item.label.toLowerCase();
        const shouldExpand = item.children.some(child => isActive(child.path));
        
        if (shouldExpand && !expandedCategories[categoryKey]) {
          setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: true
          }));
        }
      }
    });
  }, [location.pathname, userRole]);

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

      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuItems.map((item, index) => {
          // If item has children, render as category
          if (item.children) {
            const categoryKey = item.label.toLowerCase();
            const isExpanded = expandedCategories[categoryKey];
            
            return (
              <div key={index} className="mb-0.5">
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-colors rounded-sm
                    ${item.children?.some(child => isActive(child.path)) 
                      ? 'bg-slate-700 text-white font-medium' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  title={!isOpen ? item.label : undefined}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
                    {isOpen && <span className="ml-3">{item.label}</span>}
                  </div>
                  {isOpen && (
                    <span className="text-xs">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  )}
                </button>
                
                {/* Submenu items */}
                {isOpen && (
                  <div 
                    className={`pl-4 bg-slate-800 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 py-1 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                  >
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.path || '#'}
                        className={`flex items-center px-4 py-2 transition-colors rounded-sm ${
                          isActive(child.path)
                            ? 'bg-teal-600 text-white border-l-4 border-teal-400 font-medium'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center text-sm">{child.icon}</span>
                        <span className="ml-3 text-sm">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          
          // Regular menu item without children
          return (
            <Link
              key={index}
              to={item.path || '#'}
              className={`flex items-center px-4 py-3 transition-colors rounded-sm ${
                isActive(item.path)
                  ? 'bg-teal-600 text-white border-l-4 border-teal-400 font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
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
