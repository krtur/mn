import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';
import InstagramIcon from './icons/InstagramIcon';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  // Instagram profile URL
  const instagramUrl = 'https://www.instagram.com/mnterapeutas/';

  return (
    <footer className="py-14 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-purple-900/20 text-white w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary-400">M&N Terapeutas</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-4">
              {t('footer.tagline')}
            </p>
            <p className="text-purple-400 font-semibold text-lg italic">
              {t('footer.care')}
            </p>
          </div>

          {/* TRG Logo */}
          <div className="text-center flex justify-center items-center">
            <img
              src="/TRG-logo.png"
              alt="TRG Logo"
              className="h-24 w-auto object-contain hover:opacity-80 transition-opacity duration-300"
            />
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <p className="font-bold text-purple-400 mb-4 text-2xl">{t('footer.connect')}</p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-slate-300 hover:text-accent-300 transition-all duration-300 group"
            >
              <InstagramIcon className="w-8 h-8 group-hover:scale-125 transition-transform text-purple-400 group-hover:text-purple-300" />
              <span className="font-semibold text-lg group-hover:underline text-slate-300 group-hover:text-white">Instagram</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col items-center gap-2">
          <p className="text-center text-slate-400 text-base">
            {t('footer.copyright')}
          </p>
          <p className="text-center text-slate-500 text-sm opacity-80">
            Site desenvolvido por <a href="https://mm2.chat/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors duration-300">https://mm2.chat/</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
