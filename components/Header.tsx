import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { supabase, supabaseAuth } from '../services/supabase';
import Navbar from './Navbar';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Log para debug
  useEffect(() => {
    console.log('Header - Estado de autenticação:', { user: user?.email || 'null', isAuthenticated });
  }, [user, isAuthenticated]);

  // Obter iniciais do usuário
  const getUserInitials = () => {
    if (!user) return 'U';
    return getInitials(user.name);
  };

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Obter iniciais do nome do usuário
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header-gradient shadow-lg sticky top-0 z-30 w-full transition-all duration-300 backdrop-blur-md bg-opacity-98">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== '/') {
                  navigate('/');
                }
                setCurrentPage('home');
              }}
              aria-label="Página inicial de M&N Terapeutas"
              className="cursor-pointer group px-2"
            >
              <img
                src="/logo.png"
                alt="Logo M&N Terapeutas"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain group-hover:opacity-80 transition-opacity duration-300"
              />
            </a>
          </div>
          <Navbar setCurrentPage={setCurrentPage} />
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-auto lg:ml-0">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    // Navegar diretamente para o dashboard ao clicar no círculo
                    window.location.href = '/dashboard';
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-400 hover:bg-accent-500 text-white font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
                  aria-label="Menu do usuário"
                  title={user?.name || 'Usuário'}
                >
                  {getUserInitials()}
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-3 sm:px-6 py-2 bg-accent-400 hover:bg-accent-500 text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
                aria-label="Fazer login"
              >
                Login
              </button>
            )}

            <img
              src="/TRG-logo.png"
              alt="TRG Logo"
              className="h-8 sm:h-10 lg:h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-300 hidden xs:block"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;