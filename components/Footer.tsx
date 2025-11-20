import React from 'react';
import InstagramIcon from './icons/InstagramIcon';

const Footer: React.FC = () => {
  // NOTE: Replace this placeholder with the actual Instagram profile URL.
  const instagramUrl = 'https://www.instagram.com/example'; 

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white w-full">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8 mb-8">
          <div className="text-sm">
            <p className="font-semibold text-teal-300 mb-2">🌍 Idiomas de Atendimento</p>
            <p className="text-slate-300">Português • Inglês • Espanhol</p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors duration-300 group"
          >
            <InstagramIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-semibold group-hover:underline">Siga-nos no Instagram</span>
          </a>
        </div>
        <div className="border-t border-slate-700 pt-8">
          <p className="text-center text-slate-400 text-sm">
            © 2025 M&N Terapeutas. Todos os direitos reservados. | Desenvolvido com ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
