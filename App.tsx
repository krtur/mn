import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import TerapiaCorporativa from './components/TerapiaCorporativa';
import ProjetoEscola from './components/ProjetoEscola';
import TerapiaBaixoCusto from './components/TerapiaBaixoCusto';
import Mentoria from './components/Mentoria';
import MeuAtendimento from './components/MeuAtendimento';
import Credenciais from './components/Credenciais';
import Depoimentos from './components/Depoimentos';
import OQueETrg from './components/OQueETrg';
import Faq from './components/Faq';
import Frases from './components/Frases';
import Fobias from './components/Fobias';
import Ebooks from './components/Ebooks';
import Chatbot from './components/Chatbot';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'terapia-corporativa':
        return <TerapiaCorporativa />;
      case 'projeto-escola':
        return <ProjetoEscola />;
      case 'terapia-baixo-custo':
        return <TerapiaBaixoCusto />;
      case 'mentoria':
        return <Mentoria />;
      case 'meu-atendimento':
        return <MeuAtendimento />;
      case 'credenciais':
        return <Credenciais />;
      case 'depoimentos':
        return <Depoimentos />;
      case 'o-que-e-trg':
        return <OQueETrg />;
      case 'faq':
        return <Faq />;
      case 'frases':
        return <Frases />;
      case 'fobias':
        return <Fobias />;
      case 'ebooks':
        return <Ebooks />;
      case 'home':
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen flex flex-col text-slate-800 font-sans">
      <Header setCurrentPage={setCurrentPage} />
      <main className="flex-grow flex items-center justify-center p-4">
        {renderCurrentPage()}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;