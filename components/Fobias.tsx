import React, { useState } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface Phobia {
  term: string;
  definition: string;
}

interface PhobiasByLetter {
  [key: string]: Phobia[];
}

const phobiasByLetter: PhobiasByLetter = {
  A: [
    { term: 'Abissofobia', definition: 'medo de abismos, precipícios' },
    { term: 'Ablepsifobia', definition: 'medo de ficar cego' },
    { term: 'Ablutofobia', definition: 'medo de tomar banho' },
    { term: 'Acarofobia', definition: 'medo de ter a pele infestada por pequenos organismos (ácaros)' },
    { term: 'Acerofobia', definition: 'medo a produtos ácidos' },
    { term: 'Acluofobia', definition: 'medo ou horror exagerado à escuridão' },
    { term: 'Acrofobia', definition: 'medo de altura' },
    { term: 'Acusticofobia', definition: 'medo relacionado aos ruídos de alta intensidade' },
    { term: 'Aeroacrofobia', definition: 'medo de lugar aberto e alto' },
    { term: 'Aerodromofobia', definition: 'medo de viagens aéreas' },
    { term: 'Aerofobia', definition: 'medo de ventos, engolir ar ou aspirar substâncias tóxicas' },
    { term: 'Aeronausifobia', definition: 'medo de vomitar (quando viaja de avião)' },
    { term: 'Afefobia', definition: 'medo de ser tocado' },
    { term: 'Afobia', definition: 'medo da falta de fobias' },
    { term: 'Agirofobia', definition: 'medo de ruas ou cruzamento de ruas' },
    { term: 'Agliofobia', definition: 'medo de sentir dor, sinônimo de algofobia' },
    { term: 'Agorafobia', definition: 'medo de lugares abertos, de estar na multidão, lugares públicos ou deixar lugar seguro' },
    { term: 'Agrafobia', definition: 'medo de abuso sexual' },
    { term: 'Agrizoofobia', definition: 'medo de animais selvagens' },
    { term: 'Aicmofobia', definition: 'medo de agulhas de injeção ou objetos pontudos' },
    { term: 'Ailurofobia', definition: 'medo de gatos. Idem galeofobia ou gatofobia' },
    { term: 'Aletrorofobia', definition: 'medo de galinhas (ornitofobia)' },
    { term: 'Algofobia', definition: 'medo de dor. Idem agliofobia' },
    { term: 'Amatofobia', definition: 'medo de poeiras' },
    { term: 'Amaxofobia', definition: 'medo mórbido de se encontrar ou viajar dentro de qualquer veículo de transporte' },
    { term: 'Ambulofobia', definition: 'medo de andar' },
    { term: 'Amnesifobia', definition: 'medo de perder a memória' },
    { term: 'Anatidaefobia', definition: 'medo de ser observado por patos' },
    { term: 'Ancraofobia ou Anemofobia', definition: 'medo de correntes de ar' },
    { term: 'Androfobia', definition: 'medo de homens' },
    { term: 'Anginofobia', definition: 'medo de engasgar' },
    { term: 'Antlofobia', definition: 'medo exagerado de enchentes ou de inundações' },
    { term: 'Antofobia', definition: 'medo de flores' },
    { term: 'Antropofobia', definition: 'medo de pessoas ou da sociedade' },
    { term: 'Anuptafobia', definition: 'medo de ficar solteiro(a)' },
    { term: 'Apifobia', definition: 'medo de abelhas' },
    { term: 'Aquafobia', definition: 'medo de água' },
    { term: 'Aracnefobia ou Aracnofobia', definition: 'medo de aranhas' },
    { term: 'Astenofobia', definition: 'medo de desmaiar ou ter fraqueza' },
    { term: 'Astrofobia ou astrapofobia', definition: 'medo de trovões e relâmpagos' },
    { term: 'Ataxofobia', definition: 'medo de desordem' },
    { term: 'Atelofobia', definition: 'medo de ser imperfeito' },
    { term: 'Autofobia', definition: 'medo de si mesmo ou de ficar sozinho (Monofobia, Isolofobia)' },
    { term: 'Automatonofobia', definition: 'medo de bonecos de ventríloquo, criaturas animatrônicas, estátuas de cera' },
    { term: 'Azinofobia', definition: 'medo de ser agredido pelos pais' },
  ],
  B: [
    { term: 'Bacilofobia ou Bacteriofobia', definition: 'medo de bactérias (Microbiofobia)' },
    { term: 'Balistofobia', definition: 'medo de mísseis' },
    { term: 'Basofobia ou basifobia', definition: 'medo de andar ou cair (inabilidade de ficar em pé)' },
    { term: 'Batofobia', definition: 'medo de profundidade' },
    { term: 'Batracofobia', definition: 'medo de anfíbios (como sapos, salamandras, rãs etc.)' },
    { term: 'Belonofobia', definition: 'medo de objetos pontiagudos, afiados' },
    { term: 'Blennofobia', definition: 'medo de muco ou coisas viscosas' },
    { term: 'Brontofobia', definition: 'medo de trovões e relâmpagos' },
    { term: 'Biofobia', definition: 'medo da vida' },
    { term: 'Botanofobia', definition: 'medo de plantas' },
  ],
  C: [
    { term: 'Cacomorfobia', definition: 'medo de pessoas gordas. Não confundir com ódio ou preconceito' },
    { term: 'Cacorrafiofobia', definition: 'medo de fracasso ou falhar' },
    { term: 'Caetofobia', definition: 'medo de pêlos' },
    { term: 'Cainofobia ou cainotofobia', definition: 'medo de novidades' },
    { term: 'Calipsefobia', definition: 'medo do apocalipse' },
    { term: 'Cardiofobia', definition: 'medo do infartos' },
    { term: 'Catagelofobia', definition: 'aversão à críticas' },
    { term: 'Catapedafobia', definition: 'medo de saltar de lugares baixos ou altos' },
    { term: 'Catisofobia', definition: 'medo de sentar-se' },
    { term: 'Catoptrofobia', definition: 'medo de espelhos' },
    { term: 'Catsaridafobia ou katsaridafobia', definition: 'medo de baratas' },
    { term: 'Cenofobia ou centofobia', definition: 'medo de grandes espaços abertos' },
    { term: 'Cenosilicafobia', definition: 'medo de ver copos vazios' },
    { term: 'Cimofobia', definition: 'medo de ondas ou de movimentos parecidos com ondas' },
    { term: 'Cinetofobia ou cinesofobia', definition: 'medo de movimento' },
    { term: 'Cinofobia', definition: 'medo de cães' },
    { term: 'Cipridofobia, ciprifobia, ciprianofobia, ou ciprinofobia', definition: 'medo de prostitutas ou doenças venéreas' },
    { term: 'Ceraunofobia', definition: 'medo de trovão' },
    { term: 'Coreofobia', definition: 'medo de dançar' },
    { term: 'Coitofobia', definition: 'medo ou aversão a sexo' },
    { term: 'Coniofobia', definition: 'medo de poeira (amatofobia)' },
    { term: 'Cosmicofobia', definition: 'medo de fenômenos cósmicos' },
    { term: 'Claustrofobia', definition: 'medo de espaços confinados ou lugares fechados' },
    { term: 'Cleitrofobia ou cleisiofobia', definition: 'medo de ficar trancado em lugares fechados' },
    { term: 'Cleptofobia', definition: 'medo de ser roubado' },
    { term: 'Climacofobia', definition: 'medo de degraus (subir ou cair de degraus)' },
    { term: 'Clinofobia', definition: 'medo de ir para a cama' },
    { term: 'Clitrofobia ou cleitrofobia', definition: 'medo de ficar fechado' },
    { term: 'Cnidofobia', definition: 'medo de cordas' },
    { term: 'Cometofobia', definition: 'medo de cometas' },
    { term: 'Coulrofobia', definition: 'medo de palhaços' },
    { term: 'Colpofobia', definition: 'medo de órgãos genitais femininos' },
    { term: 'Coimetrofobia', definition: 'medo de cemitérios' },
    { term: 'Contreltofobia', definition: 'medo de abuso sexual' },
    { term: 'Coprofobia', definition: 'medo de fezes' },
    { term: 'Cremnofobia', definition: 'medo de precipícios' },
    { term: 'Criofobia', definition: 'medo de frio intenso, gelo ou congelamento' },
    { term: 'Cristãofobia, cristofobia ou cristianofobia', definition: 'medo ou preconceito dos cristãos' },
    { term: 'Cromofobia ou cromatofobia', definition: 'medo de cores' },
    { term: 'Cronofobia', definition: 'medo da passagem do tempo' },
    { term: 'Cronomentrofobia', definition: 'medo de relógios' },
  ],
  D: [
    { term: 'Darwinofobia', definition: 'aversão ou repulsa ao darwinismo e a Charles Darwin' },
    { term: 'Decidofobia', definition: 'aversão de tomar decisões' },
    { term: 'Deipnofobia', definition: 'medo de jantar e conversas do jantar' },
    { term: 'Demonofobia', definition: 'medo de demônios' },
    { term: 'Demofobia ou enoclofobia', definition: 'medo de multidão (agorafobia)' },
    { term: 'Dendrofobia', definition: 'medo de árvores' },
    { term: 'Dermatosiofobia, dermatofobia ou dermatopatofobia', definition: 'medo de doenças de pele' },
    { term: 'Dextrofobia', definition: 'medo de objetos do lado direito do corpo' },
    { term: 'Diabetofobia', definition: 'medo de diabetes' },
    { term: 'Dinofobia', definition: 'medo de vertigens ou redemoinho' },
    { term: 'Diplofobia', definition: 'medo de visão dupla' },
    { term: 'Dipsofobia', definition: 'medo de beber (bebidas alcoólicas)' },
    { term: 'Disabiliofobia', definition: 'medo de se vestir na frente de alguém' },
    { term: 'Dismorfofobia', definition: 'medo de deformidade' },
    { term: 'Distiquifobia', definition: 'medo de acidentes' },
    { term: 'Domatofobia ou oiquofobia', definition: 'Medo de casas ou estar em casa' },
    { term: 'Dorafobia', definition: 'medo de pele de animais' },
    { term: 'Dromofobia', definition: 'medo de cruzar ruas' },
  ],
  E: [
    { term: 'Eisoptrofobia', definition: 'medo de espelhos ou de se ver no espelho' },
    { term: 'Electrofobia', definition: 'medo de eletricidade' },
    { term: 'Eleuterofobia', definition: 'medo da liberdade' },
    { term: 'Elurofobia', definition: 'medo de gatos (ailurofobia)' },
    { term: 'Emetofobia', definition: 'medo de vomitar' },
    { term: 'Enosiofobia ou enissofobia', definition: 'medo de ter cometido um pecado ou crítica imperdoável' },
    { term: 'Entomofobia', definition: 'medo de insetos' },
    { term: 'Epistaxiofobia', definition: 'medo de sangrar do nariz' },
    { term: 'Epistemofobia', definition: 'medo do conhecimento' },
    { term: 'Equinofobia', definition: 'medo de cavalos' },
    { term: 'Eremofobia', definition: 'medo de ficar só' },
    { term: 'Ereutrofobia', definition: 'medo de ficar vermelho' },
    { term: 'Ergasiofobia', definition: 'medo de trabalhar ou de operar (cirurgião)' },
    { term: 'Ergofobia', definition: 'medo do trabalho' },
    { term: 'Eritrofobia, eritofobia ou ereutofobia', definition: 'medo de luz vermelha ou do vermelho' },
    { term: 'Eretofobia', definition: 'medo mórbido de sentir dor durante relações sexuais' },
    { term: 'Erotofobia', definition: 'medo de discutir ou falar sobre assuntos sexuais' },
    { term: 'Esciofobia ou esciafobia', definition: 'medo de sombras' },
    { term: 'Escolecifobia', definition: 'medo de vermes' },
    { term: 'Escopofobia ou escoptofobia', definition: 'medo de estar sendo olhado' },
    { term: 'Escotofobia', definition: 'medo de escuro' },
    { term: 'Escotomafobia', definition: 'medo de cegueira' },
    { term: 'Esfecsofobia', definition: 'medo de marimbondos' },
    { term: 'Espectrofobia', definition: 'medo de fantasmas ou espectros' },
    { term: 'Estasibasifobia ou estasifobia', definition: 'medo de ficar de pé ou andar (ambulofobia)' },
    { term: 'Estaurofobia', definition: 'medo de cruz ou crucifixo' },
    { term: 'Estenofobia', definition: 'medo de lugares ou coisas estreitas' },
    { term: 'Estigiofobia', definition: 'medo do inferno' },
    { term: 'Estruminofobia', definition: 'medo de morrer defecando' },
    { term: 'Estupefaçofobia', definition: 'medo de estupefacientes ou de os consumir' },
    { term: 'Estupofobia', definition: 'medo de pessoas estúpidas' },
  ],
  F: [
    { term: 'Fagofobia', definition: 'medo de engolir ou de comer' },
    { term: 'Falacrofobia', definition: 'medo de tornar-se careca' },
    { term: 'Farmacofobia', definition: 'medo de tomar remédios' },
    { term: 'Febrifobia, fibrifobia ou fibriofobia', definition: 'medo de febre' },
    { term: 'Fengofobia', definition: 'medo da luz do dia ou nascer do sol' },
    { term: 'Felinofobia', definition: 'medo de gatos (ailurofobia, elurofobia, galeofobia, gatofobia)' },
    { term: 'Filemafobia ou filematofobia', definition: 'medo de beijar' },
    { term: 'Filofobia', definition: 'medo de apaixonar-se' },
    { term: 'Filosofobia', definition: 'medo de filosofia' },
    { term: 'Fobia social', definition: 'medo de estar sendo avaliado negativamente (socialmente)' },
    { term: 'Fobofobia', definition: 'medo de fobias' },
    { term: 'Fotoaugliafobia', definition: 'medo de luzes muito brilhantes' },
    { term: 'Fronemofobia', definition: 'medo de pensar' },
    { term: 'Ftisiofobia', definition: 'medo de tuberculose' },
    { term: 'Flatusfobia', definition: 'medo de liberar flatos' },
  ],
  G: [
    { term: 'Galeofobia ou gatofobia', definition: 'medo de gatos, mesmo que Ailurofobia' },
    { term: 'Gamofobia', definition: 'medo de casar' },
    { term: 'Gatesfobia', definition: 'medo de ficar rico' },
    { term: 'Gefirofobia, gefidrofobia ou gefisrofobia', definition: 'medo de cruzar pontes' },
    { term: 'Geliofobia', definition: 'medo de rir' },
    { term: 'Gelotofobia', definition: 'medo de ser motivo de piada' },
    { term: 'Geniofobia', definition: 'medo de manter a cabeça erguida' },
    { term: 'Gerascofobia', definition: 'medo de envelhecer' },
    { term: 'Gerontofobia', definition: 'medo de pessoas idosas' },
    { term: 'Geumafobia ou geumofobia', definition: 'medo de sabores' },
    { term: 'Ghostfobia', definition: 'Medo de fantasmas' },
    { term: 'Gimnofobia', definition: 'medo de nudez' },
    { term: 'Ginofobia, ginefobia ou ginecofobia', definition: 'medo de mulheres' },
    { term: 'Glossofobia', definition: 'medo de falar em público' },
    { term: 'Gnosiofobia', definition: 'medo do conhecimento' },
    { term: 'Gordofobia', definition: 'aversão a pessoas gordas' },
  ],
  H: [
    { term: 'Hadefobia', definition: 'medo do inferno' },
    { term: 'Hagiofobia', definition: 'medo de santos ou coisas santas' },
    { term: 'Hamartofobia', definition: 'medo de pecar' },
    { term: 'Hafefobia ou haptefobia', definition: 'medo de ser tocado ou de tocar em alguém ou em alguma coisa' },
    { term: 'Harpaxofobia', definition: 'medo de ser roubado' },
    { term: 'Hedonofobia', definition: 'medo de sentir prazer' },
    { term: 'Heliofobia', definition: 'medo do sol' },
    { term: 'Hemofobia, hemafobia ou hematofobia', definition: 'medo de sangue' },
    { term: 'Heresifobia ou hereiofobia', definition: 'medo de desafiar a doutrina oficial (governo)' },
    { term: 'Herpetofobia', definition: 'medo de répteis' },
    { term: 'Hexacosioihexecontahexafobia', definition: 'medo do número 666' },
    { term: 'Hidrargiofobia', definition: 'medo de medicamentos à base de mercúrio' },
    { term: 'Hidrofobofobia', definition: 'medo de raiva' },
    { term: 'Hielofobia ou hialofobia', definition: 'medo de vidro' },
    { term: 'Hierofobia', definition: 'medo de padres ou coisas sacras' },
    { term: 'Higrofobia', definition: 'medo de líquidos ou umidade' },
    { term: 'Hilefobia', definition: 'medo de materialismo ou de epilepsia' },
    { term: 'Hilofobia', definition: 'medo de florestas' },
    { term: 'Hipengiofobia ou hipegiafobia', definition: 'medo de responsabilidade' },
    { term: 'Hipnofobia', definition: 'medo de dormir ou ser hipnotizado' },
    { term: 'Hipofobia', definition: 'medo de casas' },
    { term: 'Hipsifobia', definition: 'medo de altura' },
    { term: 'Hodofobia', definition: 'medo de atravessar estradas' },
    { term: 'Hormefobia', definition: 'medo de ficar abalado ou chocado' },
    { term: 'Homiclofobia', definition: 'medo de neblina' },
    { term: 'Hominofobia', definition: 'medo de homens, mesmo que androfobia' },
    { term: 'Homofobia', definition: 'medo ou aversão a pessoas homossexuais' },
    { term: 'Hoplofobia', definition: 'medo de armas de fogo' },
    { term: 'Hipopotomonstrosesquipedaliofobia', definition: 'medo de palavras grandes' },
    { term: 'Humilhofobia', definition: 'medo de ser humilhado' },
  ],
  I: [
    { term: 'Iatrofobia', definition: 'medo de ir ao médico' },
    { term: 'Ictiofobia', definition: 'medo de peixe' },
    { term: 'Ideofobia', definition: 'medo de ideias' },
    { term: 'Ilingofobia', definition: 'medo de vertigem ou sentir vertigem quando olha para baixo' },
    { term: 'Iofobia', definition: 'medo de veneno' },
    { term: 'Insectofobia', definition: 'medo de insectos' },
    { term: 'Isolofobia', definition: 'medo da solidão, de estar sozinho, o medo de ficar isolado' },
    { term: 'Isopterofobia', definition: 'medo de cupins' },
  ],
  L: [
    { term: 'Lachanophobia ou lachanofobia', definition: 'medo de vegetais' },
    { term: 'Lactofobia', definition: 'medo de leite' },
    { term: 'Laicofobia', definition: 'medo de não pertencer a uma religião' },
    { term: 'Laliofobia ou lalofobia', definition: 'medo de falar' },
    { term: 'Lesbofobia', definition: 'aversão ou preconceito a mulheres lésbicas' },
    { term: 'Leprofobia ou leprafobia', definition: 'medo de lepra' },
    { term: 'Ligirofobia', definition: 'medo de barulhos' },
    { term: 'Ligofobia', definition: 'medo de escuridão' },
    { term: 'Lilapsofobia', definition: 'medo de furacões' },
    { term: 'Limnofobia', definition: 'medo de lagos' },
    { term: 'Linonofobia', definition: 'medo de cordas' },
    { term: 'Lipofobia', definition: 'medo de gordura' },
    { term: 'Lissofobia', definition: 'medo de ficar louco' },
    { term: 'Literofobia', definition: 'medo de letras' },
    { term: 'Liticafobia', definition: 'medo de processos (civil)' },
    { term: 'Locquiofobia', definition: 'medo de nascimento (criança)' },
    { term: 'Logizomecanofobia', definition: 'medo de computadores' },
    { term: 'Logofobia', definition: 'medo de palavras' },
    { term: 'Luefobia', definition: 'medo de sífilis' },
  ],
  M: [
    { term: 'Mageirocofobia', definition: 'medo de cozinhar' },
    { term: 'Maieusiofobia', definition: 'medo da infância' },
    { term: 'Malaxofobia', definition: 'medo de amar (sarmassofobia)' },
    { term: 'Maniafobia', definition: 'medo de insanidade' },
    { term: 'Mastigofobia', definition: 'medo de punição' },
    { term: 'Mecanofobia', definition: 'medo de máquinas' },
    { term: 'Megalofobia', definition: 'medo de coisas grandes' },
    { term: 'Melanofobia', definition: 'medo de cor preta' },
    { term: 'Melissofobia', definition: 'medo de abelhas' },
    { term: 'Melofobia', definition: 'medo ou ódio de música' },
    { term: 'Meningitofobia', definition: 'medo de doença nervosa' },
    { term: 'Merintofobia', definition: 'medo de ficar amarrado' },
    { term: 'Metalofobia', definition: 'medo de metal' },
    { term: 'Metatesiofobia', definition: 'medo de mudar' },
    { term: 'Meteorofobia', definition: 'medo de meteoros' },
    { term: 'Metifobia', definition: 'medo de álcool' },
    { term: 'Metrofobia', definition: 'medo ou ódio de poesia' },
    { term: 'Micofobia', definition: 'medo ou aversão por cogumelos' },
    { term: 'Microbiofobia', definition: 'medo de micróbios (bacilofobia)' },
    { term: 'Microfobia', definition: 'medo de coisas pequenas' },
    { term: 'Mictofobia', definition: 'medo de escuridão' },
    { term: 'Mirmecofobia', definition: 'medo de formigas' },
    { term: 'Misofobia', definition: 'medo de germes, contaminação ou sujeira' },
    { term: 'Mitofobia', definition: 'medo de mitos, histórias ou declarações falsas' },
    { term: 'Mixofobia', definition: 'medo de qualquer sustância viscosa (blenofobia)' },
    { term: 'Mnemofobia', definition: 'medo das memórias e lembranças passadas' },
    { term: 'Molismofobia ou molisomofobia', definition: 'medo de sujeira ou contaminação' },
    { term: 'Monofobia', definition: 'medo de solidão ou ficar só (Autofobia, Isolofobia)' },
    { term: 'Monopatofobia', definition: 'medo de doença incurável' },
    { term: 'Motefobia', definition: 'medo de borboletas ou mariposas' },
    { term: 'Motorfobia', definition: 'medo de automóveis' },
    { term: 'Musofobia ou murofobia', definition: 'medo de ratos' },
  ],
  N: [
    { term: 'Narigofobia', definition: 'medo de narizes' },
    { term: 'Nebulafobia', definition: 'medo de neblina (homiclofobia)' },
    { term: 'Necrofobia', definition: 'medo de morte ou coisas mortas' },
    { term: 'Nelofobia', definition: 'medo de vidro' },
    { term: 'Neofarmafobia', definition: 'medo de medicamentos novos' },
    { term: 'Neofobia', definition: 'medo de qualquer coisa nova' },
    { term: 'Nefofobia', definition: 'medo de nevoeiros' },
    { term: 'Nictofobia', definition: 'medo da escuridão ou da noite' },
    { term: 'Noctifobia', definition: 'medo da noite' },
    { term: 'Ninfofobia', definition: 'medo do sexo' },
    { term: 'Nomofobia', definition: 'medo de ficar sem acesso a computadores ou celulares' },
    { term: 'Nipofobia', definition: 'medo ou aversão a japoneses e/ou sua cultura' },
    { term: 'Nosocomefobia', definition: 'medo de hospital' },
    { term: 'Nosofobia ou nosemafobia', definition: 'medo de ficar doente' },
    { term: 'Nostofobia', definition: 'medo de voltar para casa' },
    { term: 'Novercafobia', definition: 'medo da madrasta' },
    { term: 'Nucleomitufobia', definition: 'medo de armas nucleares' },
    { term: 'Nudofobia', definition: 'medo de ficar nu ou da nudez de outros' },
  ],
  O: [
    { term: 'Obesofobia', definition: 'medo de ganhar peso (pocrescofobia)' },
    { term: 'Oclofobia', definition: 'medo de multidão' },
    { term: 'Ocofobia', definition: 'medo de veículos' },
    { term: 'Odinofobia ou odinefobia', definition: 'medo da dor (algofobia)' },
    { term: 'Odontofobia', definition: 'medo de dentista ou cirurgia odontológica' },
    { term: 'Oenofobia', definition: 'medo de vinhos' },
    { term: 'Ofidiofobia', definition: 'medo de cobras' },
    { term: 'Oftalmofobia', definition: 'medo de estar sendo vigiado' },
    { term: 'Olfactofobia', definition: 'medo de cheiros' },
    { term: 'Ombrofobia', definition: 'medo de chuva ou de estar chovendo' },
    { term: 'Ometafobia ou omatofobia', definition: 'medo de olhos' },
    { term: 'Oneirofobia', definition: 'medo de sonhos' },
    { term: 'Onomatofobia', definition: 'medo de ouvir certas palavras ou nomes' },
    { term: 'Ornitofobia', definition: 'medo de aves' },
    { term: 'Ostraconofobia', definition: 'medo de ostras' },
    { term: 'Orientalofobia', definition: 'medo de orientais' },
    { term: 'Octofobia', definition: 'medo do número 8' },
  ],
  P: [
    { term: 'Parcopresis', definition: 'aversão de defecar na frente de pessoas reais ou imaginárias' },
    { term: 'Pantofobia', definition: 'medo de tudo ou de todas as fobias' },
    { term: 'Pedofobia', definition: 'medo de crianças' },
    { term: 'Penterofobia', definition: 'medo da sogra' },
    { term: 'Pluviofobia', definition: 'medo irracional da chuva' },
    { term: 'Pirofobia', definition: 'medo do fogo' },
    { term: 'Parasquavedequatriafobia', definition: 'medo de sexta-feira 13' },
    { term: 'Pogonofobia', definition: 'medo irracional de barba' },
    { term: 'Ptesiofobia', definition: 'medo de viajar de avião' },
  ],
  Q: [
    { term: 'Quemofobia', definition: 'medo de substâncias químicas ou de trabalhar com elas' },
    { term: 'Queraunofobia', definition: 'de trovões ou raios' },
    { term: 'Quenofobia', definition: 'medo de espaços vazios' },
    { term: 'Quifofobia', definition: 'medo de parar' },
    { term: 'Quimofobia', definition: 'medo de ondas' },
    { term: 'Quionofobia', definition: 'medo de neve' },
    { term: 'Quinofobia', definition: 'medo de raiva (doença)' },
    { term: 'Quiraptofobia', definition: 'medo de ser tocada(o)' },
    { term: 'Quilofobia', definition: 'medo de roedores' },
  ],
  R: [
    { term: 'Rabdofobia', definition: 'medo de ser severamente punido' },
    { term: 'Radiofobia', definition: 'medo de radiação, Raio—X' },
    { term: 'Ripofobia', definition: 'medo de defecar' },
    { term: 'Ritifobia', definition: 'medo de ficar enrugado' },
    { term: 'Rupofobia', definition: 'medo de sujeira' },
  ],
  S: [
    { term: 'Sarmassofobia', definition: 'medo de seduzir e de participar de jogos de sedução' },
    { term: 'Satanofobia', definition: 'medo de satã (demônio)' },
    { term: 'Selafobia', definition: 'medo de flashes (luzes)' },
    { term: 'Selachofobia', definition: 'medo de tubarões' },
    { term: 'Selenofobia', definition: 'medo da lua' },
    { term: 'Seplofobia', definition: 'medo de material radiativo' },
    { term: 'Sesquipedalofobia (Hipopotomonstrosesquipedaliofobia)', definition: 'medo de palavras grandes' },
    { term: 'Sexoafobia', definition: 'medo de fazer sexo' },
    { term: 'Sexofobia', definition: 'medo do sexo oposto (heterofobia)' },
    { term: 'Sidafobia', definition: 'medo, aversão ou discriminação contra pessoas soropositivas' },
    { term: 'Siderodromofobia', definition: 'medo de trem ou viagem de trem' },
    { term: 'Siderofobia', definition: 'medo de estrelas' },
    { term: 'Sinistrofobia', definition: 'medo de coisas do lado esquerdo, mão esquerda' },
    { term: 'Sitofobia ou Sitiofobia', definition: 'medo de comida ou comer (cibofobia)' },
    { term: 'Socerafobia', definition: 'medo de padrasto ou madrasta' },
    { term: 'Sociofobia', definition: 'medo da sociedade ou de pessoas em geral' },
    { term: 'Somnifobia', definition: 'medo de dormir' },
    { term: 'Singenesofobia', definition: 'medo de parentes' },
    { term: 'Sifilofobia', definition: 'medo de sífilis' },
    { term: 'Sofofobia', definition: 'medo de aprender' },
    { term: 'Soteriofobia', definition: 'medo de dependência dos outros' },
    { term: 'Surifobia', definition: 'medo de camundongo (rato)' },
    { term: 'Simbolofobia', definition: 'medo de símbolos' },
  ],
  T: [
    { term: 'Tacofobia ou Tachofobia', definition: 'medo de velocidade' },
    { term: 'Taeniofobia ou Teniofobia', definition: 'medo de solitária (tênia)' },
    { term: 'Tafofobia ou tafefobia', definition: 'medo de ser enterrado vivo' },
    { term: 'Talassofobia', definition: 'medo do mar' },
    { term: 'Tanatofobia ou tantofobia', definition: 'medo da morte ou de morrer' },
    { term: 'Tapinofobia', definition: 'medo de palavras longas' },
    { term: 'Taurofobia', definition: 'medo de touro' },
    { term: 'Teatrofobia', definition: 'medo de teatro' },
    { term: 'Tecnofobia', definition: 'medo de tecnologia' },
    { term: 'Telefonofobia', definition: 'medo de telefone' },
    { term: 'Teleofobia', definition: 'medo de definir planos ou de cerimônias religiosas' },
    { term: 'Teofobia', definition: 'medo de Deus ou de religião' },
    { term: 'Teologicofobia', definition: 'medo de teologia' },
    { term: 'Teratofobia', definition: 'medo de deformidades, pessoas com deformações' },
    { term: 'Termofobia', definition: 'medo de calor' },
    { term: 'Testofobia', definition: 'medo de fazer provas (escolares)' },
    { term: 'Tetanofobia', definition: 'medo de tétano' },
    { term: 'Tetrafobia', definition: 'medo do número 4' },
    { term: 'Tiranofobia', definition: 'medo de tiranos ou ditadores' },
    { term: 'Tocofobia', definition: 'medo de gravidez' },
    { term: 'Tomofobia', definition: 'medo de cirurgia' },
    { term: 'Tonitrofobia', definition: 'medo de trovão' },
    { term: 'Topofobia', definition: 'medo de certos lugares ou situações, que dão medo ou pavor' },
    { term: 'Toxifobia, toxofobia ou toxicofobia', definition: 'medo de se envenenar' },
    { term: 'Traumatofobia', definition: 'medo de traumas (físicos)' },
    { term: 'Tripanofobia', definition: 'medo de injeções' },
    { term: 'Tripofobia', definition: 'nome dado a aversão por padrões de furos organizados' },
    { term: 'Triscaidecafobia', definition: 'medo do número 13' },
    { term: 'Tropofobia', definition: 'medo de mudar ou fazer mudanças' },
  ],
  U: [
    { term: 'Unatractifobia', definition: 'medo de pessoas feias' },
    { term: 'Uranusfobia', definition: 'medo do planeta Urano' },
    { term: 'Uranofobia', definition: 'medo do céu' },
    { term: 'Urifobia', definition: 'aversão ou medo irracional a fenômenos paranormais' },
    { term: 'Urofobia', definition: 'medo de urina ou do ato de urinar' },
    { term: 'Uiofobia', definition: 'medo dos próprios filhos; medo da prole' },
  ],
  V: [
    { term: 'Vacinofobia', definition: 'medo de vacinação' },
    { term: 'Verbofobia', definition: 'medo de palavras' },
    { term: 'Verminofobia', definition: 'medo de vermes' },
    { term: 'Vitricofobia', definition: 'medo do padrasto' },
  ],
  X: [
    { term: 'Xantofobia', definition: 'medo da cor amarela / medo de objetos de cor amarela' },
    { term: 'Xerofobia', definition: 'medo de secura, aridez' },
    { term: 'Sinofobia', definition: 'aversão à China, aos chineses ou à cultura chinesa' },
    { term: 'Xilofobia', definition: 'medo de objetos de madeira ou de floresta' },
  ],
  Z: [
    { term: 'Zelofobia', definition: 'medo irracional do ciúme' },
    { term: 'Zoofobia', definition: 'medo de animais' },
  ],
};

interface LetterCardProps {
  letter: string;
  phobias: Phobia[];
}

const LetterCard: React.FC<LetterCardProps> = ({ letter, phobias }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-primary-50 to-cyan-50 hover:from-primary-100 hover:to-cyan-100 transition-colors duration-200"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-primary-700 w-12 text-center">{letter}</span>
          <span className="text-sm text-slate-600 font-medium">{phobias.length} fobia{phobias.length !== 1 ? 's' : ''}</span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-primary-600 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="space-y-3">
            {phobias.map((phobia, index) => (
              <div key={index} className="pb-3 last:pb-0 border-b border-slate-200 last:border-b-0">
                <p className="text-sm font-semibold text-slate-800">{phobia.term}</p>
                <p className="text-sm text-slate-600 mt-1">{phobia.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Fobias: React.FC = () => {
  const letters = Object.keys(phobiasByLetter).sort();

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-primary mb-4">
            Glossário de <span className="gradient-text">Fobias</span>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600">
            Um guia informativo e completo sobre medos específicos. Clique em cada letra para explorar as fobias e suas definições. Este glossário é um recurso para entender melhor as diversas fobias que podem ser tratadas com a terapia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {letters.map((letter) => (
            <LetterCard
              key={letter}
              letter={letter}
              phobias={phobiasByLetter[letter]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fobias;