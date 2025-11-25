import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import ChevronDownIcon from './icons/ChevronDownIcon';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';

interface NavbarProps {
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  // Mapa de pageKey para rotas
  const pageKeyToRoute: { [key: string]: string } = {
    'home': '/',
    'meu-atendimento': '/meu-atendimento',
    'depoimentos': '/depoimentos',
    'credenciais': '/credenciais',
    'terapia-corporativa': '/terapia-corporativa',
    'projeto-escola': '/projeto-escola',
    'mentoria': '/mentoria',
    'terapia-baixo-custo': '/terapia-baixo-custo',
    'o-que-e-trg': '/o-que-e-trg',
    'faq': '/faq',
    'ebooks': '/ebooks',
    'fobias': '/fobias',
    'frases': '/frases',
  };

  const navLinks = [
    { nameKey: 'nav.home', pageKey: 'home' },
    {
      nameKey: 'nav.about',
      dropdown: [
        { nameKey: 'nav.myServices', pageKey: 'meu-atendimento' },
        { nameKey: 'nav.testimonials', pageKey: 'depoimentos' },
        { nameKey: 'nav.credentials', pageKey: 'credenciais' },
      ],
    },
    {
      nameKey: 'nav.services',
      dropdown: [
        { nameKey: 'nav.corporateTherapy', pageKey: 'terapia-corporativa' },
        { nameKey: 'nav.schoolProject', pageKey: 'projeto-escola' },
        { nameKey: 'nav.mentoring', pageKey: 'mentoria' },
        { nameKey: 'nav.lowCostTherapy', pageKey: 'terapia-baixo-custo' },
      ],
    },
    {
      nameKey: 'nav.methodology',
      dropdown: [
        { nameKey: 'nav.whatIsTrg', pageKey: 'o-que-e-trg' },
        { nameKey: 'nav.faq', pageKey: 'faq' },
      ],
    },
    {
      nameKey: 'nav.resources',
      dropdown: [
        { nameKey: 'nav.ebooks', pageKey: 'ebooks' },
        { nameKey: 'nav.phobias', pageKey: 'fobias' },
        { nameKey: 'nav.phrases', pageKey: 'frases' },
      ],
    },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const handleLinkClick = (e: React.MouseEvent, pageKey?: string) => {
    e.preventDefault();
    if (pageKey) {
      setCurrentPage(pageKey);
      const route = pageKeyToRoute[pageKey] || '/';
      navigate(route);
    }
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        {navLinks.map((link) => (
          <div
            key={link.nameKey}
            className="relative"
            onMouseEnter={() => link.dropdown && setOpenDropdown(link.nameKey)}
            onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
          >
            <a
              href="#"
              onClick={(e) => handleLinkClick(e, link.pageKey)}
              className="flex items-center text-white hover:text-accent-300 transition-colors duration-300 font-medium cursor-pointer"
            >
              {t(link.nameKey)}
              {link.dropdown && <ChevronDownIcon className="w-4 h-4 ml-1" />}
            </a>
            {link.dropdown && openDropdown === link.nameKey && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-white rounded-xl shadow-2xl ring-1 ring-primary-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {link.dropdown.map((item, index) => (
                    <a
                      key={item.nameKey}
                      href="#"
                      onClick={(e) => handleLinkClick(e, item.pageKey)}
                      className={`block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 hover:pl-5 cursor-pointer transition-all duration-200 ${
                        index !== link.dropdown!.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                      role="menuitem"
                    >
                      {t(item.nameKey)}
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
          className="text-white hover:text-accent-300 transition-colors"
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
              <h2 className="text-2xl font-bold text-primary-700">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-600 hover:text-primary-700"
                aria-label="Fechar menu"
              >
                <XIcon className="w-8 h-8" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <div key={link.nameKey}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.nameKey ? null : link.nameKey)}
                        className="w-full flex justify-between items-center text-left text-lg font-semibold text-slate-700 hover:text-primary-700"
                        aria-expanded={openMobileSubmenu === link.nameKey}
                      >
                        <span>{t(link.nameKey)}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${openMobileSubmenu === link.nameKey ? 'rotate-180' : ''}`} />
                      </button>
                      {openMobileSubmenu === link.nameKey && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-primary-200">
                          {link.dropdown.map((item) => (
                            <a
                              key={item.nameKey}
                              href="#"
                              onClick={(e) => handleLinkClick(e, item.pageKey)}
                              className="block py-2 text-md text-slate-600 hover:text-primary-700"
                            >
                              {t(item.nameKey)}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a href="#" onClick={(e) => handleLinkClick(e, link.pageKey)} className="text-lg font-semibold text-slate-700 hover:text-primary-700">
                      {t(link.nameKey)}
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