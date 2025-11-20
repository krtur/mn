import React from 'react';
import Navbar from './Navbar';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  return (
    <header className="header-gradient shadow-lg sticky top-0 z-30 w-full transition-all duration-300 backdrop-blur-md bg-opacity-98">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
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
                className="h-14 w-auto object-contain group-hover:opacity-80 transition-opacity duration-300"
              />
            </a>
          </div>
          <Navbar setCurrentPage={setCurrentPage} />
          <div className="flex-shrink-0 ml-6">
            <img 
              src="/TRG-logo.png" 
              alt="TRG Logo" 
              className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;