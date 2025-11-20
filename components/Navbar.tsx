import React, { useState } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';

const navLinks = [
  { name: 'Início', pageKey: 'home' },
  {
    name: 'Sobre M&N',
    dropdown: [
      { name: 'Meu Atendimento', pageKey: 'meu-atendimento' },
      { name: 'Depoimentos', pageKey: 'depoimentos' },
      { name: 'Credenciais (CITRG)', pageKey: 'credenciais' },
    ],
  },
  {
    name: 'Serviços',
    dropdown: [
      { name: 'Terapia Corporativa', pageKey: 'terapia-corporativa' },
      { name: 'Projeto Escola', pageKey: 'projeto-escola' },
      { name: 'Mentoria', pageKey: 'mentoria' },
      { name: 'Terapia Baixo Custo', pageKey: 'terapia-baixo-custo' },
    ],
  },
  {
    name: 'A Metodologia (TRG)',
    dropdown: [
      { name: 'O que é TRG?', pageKey: 'o-que-e-trg' },
      { name: 'Perguntas Frequentes', pageKey: 'faq' },
    ],
  },
  {
    name: 'Recursos',
    dropdown: [
      { name: 'eBooks', pageKey: 'ebooks' },
      { name: 'Fobias (Glossário)', pageKey: 'fobias' },
      { name: 'Frases', pageKey: 'frases' },
    ],
  },
];

interface NavbarProps {
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const handleLinkClick = (e: React.MouseEvent, pageKey?: string) => {
    e.preventDefault();
    if (pageKey) {
      setCurrentPage(pageKey);
    }
    setMobileMenuOpen(false);
    setOpenDropdown(null); // Close dropdown on link click
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        {navLinks.map((link) => (
          <div
            key={link.name}
            className="relative"
            onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
            onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
          >
            <a
              href="#"
              onClick={(e) => handleLinkClick(e, link.pageKey)}
              className="flex items-center text-white hover:text-teal-100 transition-colors duration-300 font-medium cursor-pointer"
            >
              {link.name}
              {link.dropdown && <ChevronDownIcon className="w-4 h-4 ml-1" />}
            </a>
            {link.dropdown && openDropdown === link.name && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-white rounded-lg shadow-2xl ring-1 ring-teal-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {link.dropdown.map((item, index) => (
                    <a
                      key={item.name}
                      href="#"
                      onClick={(e) => handleLinkClick(e, item.pageKey)}
                      className={`block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800 hover:pl-5 cursor-pointer transition-all duration-200 ${
                        index !== link.dropdown!.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                      role="menuitem"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-slate-600 hover:text-teal-700"
          aria-label="Abrir menu"
        >
          <MenuIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} aria-hidden="true">
          <div className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-teal-700">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-600 hover:text-teal-700"
                aria-label="Fechar menu"
              >
                <XIcon className="w-8 h-8" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.name ? null : link.name)}
                        className="w-full flex justify-between items-center text-left text-lg font-semibold text-slate-700 hover:text-teal-800"
                        aria-expanded={openMobileSubmenu === link.name}
                      >
                        <span>{link.name}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${openMobileSubmenu === link.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openMobileSubmenu === link.name && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-teal-200">
                          {link.dropdown.map((item) => (
                            <a
                              key={item.name}
                              href="#"
                              onClick={(e) => handleLinkClick(e, item.pageKey)}
                              className="block py-2 text-md text-slate-600 hover:text-teal-700"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a href="#" onClick={(e) => handleLinkClick(e, link.pageKey)} className="text-lg font-semibold text-slate-700 hover:text-teal-800">
                      {link.name}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;