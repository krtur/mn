import React from 'react';
import Navbar from './Navbar';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  return (
    <header className="bg-gradient-to-r from-teal-700 to-teal-600 shadow-lg sticky top-0 z-30 w-full transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} 
              aria-label="Página inicial de M&N Terapeutas"
              className="cursor-pointer group"
            >
              <img 
                src="/logo.png" 
                alt="Logo M&N Terapeutas" 
                className="h-12 w-auto object-contain group-hover:opacity-90 transition-opacity duration-300"
              />
            </a>
          </div>
          <Navbar setCurrentPage={setCurrentPage} />
        </div>
      </div>
    </header>
  );
};

export default Header;