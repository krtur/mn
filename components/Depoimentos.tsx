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
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full aspect-video">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
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
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="heading-primary mb-4">
          {t('Histórias de')} <span className="gradient-text">{t('Transformação')}</span>
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Veja os depoimentos em vídeo de nossos clientes sobre a jornada deles com a M&N Terapeutas e a metodologia TRG.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <div key={index} className="flex flex-col group">
            <YouTubeEmbed videoId={video.videoId} name={video.name} />
            <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200">
              <p className="font-bold text-slate-800 text-center">
                {video.name}
              </p>
            </div>
          </div>
        ))}
      </div>




    </section>
  );
};

export default Depoimentos;
