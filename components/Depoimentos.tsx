import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface Video {
  name: string;
  url: string;
  videoId: string;
}

const videos: Video[] = [
  { name: 'Carlos Bernardinelli', url: 'https://www.youtube.com/watch?v=eKgGh6hGgGs', videoId: 'eKgGh6hGgGs' },
  { name: 'Gisele C. de Souza', url: 'https://www.youtube.com/watch?v=nPAKOEfihkI', videoId: 'nPAKOEfihkI' },
  { name: 'Thiago Zonaro', url: 'https://www.youtube.com/watch?v=5JuXyoXzcfw', videoId: '5JuXyoXzcfw' },
  { name: 'Mariluce Ribas', url: 'https://www.youtube.com/watch?v=8D0k_X7PvIQ', videoId: '8D0k_X7PvIQ' },
  { name: 'Sônia Maria', url: 'https://www.youtube.com/watch?v=PO_d79Tq1yY', videoId: 'PO_d79Tq1yY' },
  { name: 'Rosana de Jesus', url: 'https://www.youtube.com/watch?v=MkT0NGOR9qw', videoId: 'MkT0NGOR9qw' },
  { name: 'Nangela Santos', url: 'https://www.youtube.com/watch?v=TnilCWA-v60', videoId: 'TnilCWA-v60' },
  { name: 'Cristina Santos', url: 'https://www.youtube.com/watch?v=b455sLkcy4U', videoId: 'b455sLkcy4U' },
  { name: 'Guiomar Bispo', url: 'https://www.youtube.com/watch?v=6wu_5DPIniw', videoId: '6wu_5DPIniw' },
  { name: 'Yan Hagassy', url: 'https://www.youtube.com/watch?v=cWVzDnh6vvI', videoId: 'cWVzDnh6vvI' },
  { name: 'Yan Hagassy (2)', url: 'https://www.youtube.com/watch?v=zCRP9UrLBS4', videoId: 'zCRP9UrLBS4' },
  { name: 'Leydiane Oliveira', url: 'https://www.youtube.com/watch?v=gk3o0PnqsL8', videoId: 'gk3o0PnqsL8' },
  { name: 'Clériston', url: 'https://www.youtube.com/shorts/crLsH7qvXh0', videoId: 'crLsH7qvXh0' },
  { name: 'Izabela Souza', url: 'https://www.youtube.com/watch?v=vL3xm7KP7cM', videoId: 'vL3xm7KP7cM' },
  { name: 'Izabela Souza (2)', url: 'https://www.youtube.com/watch?v=OwxPxw8CrP4', videoId: 'OwxPxw8CrP4' },
  { name: 'Gabriel Lucena', url: 'https://www.youtube.com/watch?v=gdRl0HbsY5U', videoId: 'gdRl0HbsY5U' },
  { name: 'Júlio de Assis', url: 'https://www.youtube.com/watch?v=N767wAUZO4g', videoId: 'N767wAUZO4g' },
  { name: 'Sandra', url: 'https://www.youtube.com/watch?v=5W9kBWnX6Qw', videoId: '5W9kBWnX6Qw' },
];

const YouTubeEmbed: React.FC<{ videoId: string; name: string }> = ({ videoId, name }) => {
  return (
    <div className="relative w-full bg-[#0a0a0f] overflow-hidden group-hover:opacity-95 transition-opacity duration-300">
      <div className="relative w-full aspect-video">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={`Depoimento de ${name}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

const Depoimentos: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  return (
    <section className="relative py-20 bg-transparent overflow-hidden animate-fade-in">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-200/40 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-accent-200/40 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30rem] h-[30rem] bg-primary-300/30 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-300 text-sm font-bold tracking-wider mb-4 uppercase shadow-sm">
            {t('Depoimentos')}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {t('Histórias Reais de')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary-400">{t('Transformação')}</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Descubra como a metodologia TRG tem transformado a vida de nossos clientes. Inspire-se com essas jornadas de superação e bem-estar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          {videos.map((video, index) => (
            <div key={index} className="group flex flex-col bg-[#0a0a0f] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-2 border border-white/5">
              <YouTubeEmbed videoId={video.videoId} name={video.name} />

              <div className="p-6 flex items-center justify-between bg-white/5 border-t border-white/5 flex-grow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-tr from-purple-600 to-primary-500 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-purple-900/50">
                    {video.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight mb-1">
                      {video.name}
                    </h3>
                    <p className="text-sm text-purple-400 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t('Cliente Transformado')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Depoimentos;
