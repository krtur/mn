import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import ChevronDownIcon from './icons/ChevronDownIcon';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';
import {
  Home,
  User,
  Briefcase,
  BookOpen,
  FileText,
  ChevronRight,
  Shield,
  MessageSquare,
  Award,
  Users,
  GraduationCap,
  Brain,
  HelpCircle,
  FileSearch,
  Quote,
  Heart
} from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

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

    'o-que-e-trg': '/o-que-e-trg',
    'faq': '/faq',

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

        { nameKey: 'nav.phobias', pageKey: 'fobias' },
        { nameKey: 'nav.phrases', pageKey: 'frases' },
      ],
    },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  // Travar scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
                      className={`block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 hover:pl-5 cursor-pointer transition-all duration-200 ${index !== link.dropdown!.length - 1 ? 'border-b border-slate-100' : ''
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
      <div className="lg:hidden flex items-center pl-2 pr-0 sm:px-2 order-last">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-white hover:text-accent-300 transition-colors p-2"
          aria-label="Abrir menu"
        >
          <MenuIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile Navigation Sidebar */}
      {mobileMenuOpen && createPortal(
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl z-[60] overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Menu */}
            <div className="p-6 flex justify-between items-center border-b border-slate-100 bg-white/50 sticky top-0 z-10">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all"
                aria-label="Fechar menu"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-grow p-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.nameKey === 'nav.home' ? Home :
                  link.nameKey === 'nav.about' ? User :
                    link.nameKey === 'nav.services' ? Briefcase :
                      link.nameKey === 'nav.methodology' ? Brain :
                        link.nameKey === 'nav.resources' ? FileText : Home;

                return (
                  <div key={link.nameKey} className="rounded-xl overflow-hidden">
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.nameKey ? null : link.nameKey)}
                          className={`w-full flex items-center justify-between p-4 text-left transition-colors ${openMobileSubmenu === link.nameKey
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          aria-expanded={openMobileSubmenu === link.nameKey}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${openMobileSubmenu === link.nameKey ? 'text-primary-600' : 'text-slate-400'}`} />
                            <span className="font-semibold">{t(link.nameKey)}</span>
                          </div>
                          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${openMobileSubmenu === link.nameKey ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Submenu */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMobileSubmenu === link.nameKey ? 'max-h-[400px] opacity-100 pb-2' : 'max-h-0 opacity-0'
                          }`}>
                          <div className="mx-4 mt-1 border-l-2 border-primary-100 pl-4 space-y-1">
                            {link.dropdown.map((item) => {
                              const SubIcon = item.nameKey === 'nav.myServices' ? Heart :
                                item.nameKey === 'nav.testimonials' ? MessageSquare :
                                  item.nameKey === 'nav.credentials' ? Award :
                                    item.nameKey === 'nav.corporateTherapy' ? Users :
                                      item.nameKey === 'nav.schoolProject' ? GraduationCap :
                                        item.nameKey === 'nav.whatIsTrg' ? Shield :
                                          item.nameKey === 'nav.faq' ? HelpCircle :
                                            item.nameKey === 'nav.phobias' ? FileSearch :
                                              item.nameKey === 'nav.phrases' ? Quote : ChevronRight;

                              return (
                                <a
                                  key={item.nameKey}
                                  href="#"
                                  onClick={(e) => handleLinkClick(e, item.pageKey)}
                                  className="flex items-center gap-3 py-3 px-3 text-slate-600 hover:text-primary-700 hover:bg-primary-50/50 rounded-lg transition-all text-sm font-medium"
                                >
                                  <SubIcon className="w-4 h-4 text-primary-400" />
                                  {t(item.nameKey)}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <a
                        href="#"
                        onClick={(e) => handleLinkClick(e, link.pageKey)}
                        className="flex items-center gap-3 p-4 text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-all font-semibold rounded-xl"
                      >
                        <Icon className="w-5 h-5 text-slate-400" />
                        {t(link.nameKey)}
                      </a>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer do Menu */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-center text-slate-400 font-medium uppercase tracking-wider">
                M&N Terapeutas © 2026
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Navbar;