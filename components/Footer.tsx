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
    <footer className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900 text-white w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-5xl font-bold mb-6 gradient-text">M&N Terapeutas</h3>
            <p className="text-slate-300 text-2xl leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <p className="text-accent-300 font-semibold text-2xl italic">
              {t('footer.care')}
            </p>
          </div>

          {/* TRG Logo */}
          <div className="text-center flex justify-center items-center">
            <img
              src="/TRG-logo.png"
              alt="TRG Logo"
              className="h-32 w-auto object-contain hover:opacity-80 transition-opacity duration-300"
            />
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <p className="font-bold text-accent-300 mb-6 text-3xl">{t('footer.connect')}</p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-slate-300 hover:text-accent-300 transition-all duration-300 group"
            >
              <InstagramIcon className="w-10 h-10 group-hover:scale-125 transition-transform" />
              <span className="font-semibold text-2xl group-hover:underline">Instagram</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-700 pt-12">
          <p className="text-center text-slate-400 text-xl">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
