import React from 'react';

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
];

const YouTubeEmbed: React.FC<{ videoId: string; name: string }> = ({ videoId, name }) => {
  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
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
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
          Histórias de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">Transformação</span>
        </h2>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Veja os depoimentos em vídeo de nossos clientes sobre a jornada deles com a M&N Terapeutas e a metodologia TRG.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <div key={index} className="flex flex-col group">
            <YouTubeEmbed videoId={video.videoId} name={video.name} />
            <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
              <p className="font-bold text-slate-800 text-center">
                {video.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-200 shadow-lg p-12 text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Pronto para começar sua própria história de sucesso?
        </h3>
        <p className="text-lg text-slate-600 mb-8">
          Agende agora uma sessão gratuita de 30 minutos e descubra como a TRG pode transformar sua vida.
        </p>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); alert('Redirecionando para agendamento...'); }}
          className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
        >
          Agende Sua Sessão Gratuita
        </a>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border-2 border-red-300 shadow-lg p-12 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Quer ver mais depoimentos?
        </h3>
        <p className="text-lg text-slate-700 mb-8">
          Visite nosso canal no YouTube e conheça centenas de histórias de transformação e sucesso com a metodologia TRG.
        </p>
        <a
          href="https://www.youtube.com/@mnterapeutas"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span>Acesse Nosso Canal no YouTube</span>
        </a>
      </div>
    </section>
  );
};

export default Depoimentos;
