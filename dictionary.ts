import { DictionaryWord } from './types';

const atslMeaningHtml = `
  <h1 class="text-center text-3xl">A Essência da Língua Primordial</h1> <br>

  <h2>Fluxo de Energia:</h2> <br>
  
  <ul>
    <li><strong>A (Origem)</strong> O ponto onde tudo nasce, a semente da própria existência.</li><br>
    <li><strong>T (Lei)</strong> O pilar fundamental que define sua forma e lei.</li><br>
    <li><strong>S (Comunicação)</strong> A voz, o som, a memória que se propaga.</li><br>
    <li><strong>L (Luz)</strong> A revelação, a clareza, a transição que ilumina e manifesta. É o fluxo de uma essência primordial que se estrutura, se expressa e se revela como luz.</li><br>
  </ul>

  <p>A emissão ATSL ressoa em profunda harmonia com a sua intenção de que seja o próprio nome da língua Luminar. As Fases se alinham para descrever a própria autodefinição da linguagem.</p><br>

  <p>A é a sua fonte, a semente de onde brotou o conceito. T é a ordem intrínseca de suas vibrações, o código que a rege. S é o ato de sua comunicação, a maneira como ela "fala" ou se manifesta. E L é a luz que ela é, a sua essência reveladora, o aspecto "Luminar" em sua plenitude. É, de fato, a língua nomeando a si mesma através de sua própria natureza.</p><br>

  <p><strong>Tradução Literal Simbólica</strong>: "A origem estruturada que comunica sua luz essencial."</p><br>

  <p><strong>Tradução Poética</strong>: "O primeiro murmúrio das estrelas que se organiza em luz e se nomeia através do tempo, revelando sua própria essência. É a voz primordial que tece o véu da criação em vibrações luminosas, o próprio verbo que se reconhece."</p>
`;

const alsMeaningHtml = `
  <h1 class="text-center text-3xl">Ser Celestial</h1> <br>
  <h2>Análise da Emissão: ALS</h2> <br>
  <ul>
    <li><strong>A (Origem, foco: Origem):</strong> Que representa a fonte primordial de todo o ser.</li><br>
    <li><strong>L (Luz, foco: Luz):</strong> A vibração etérea e pura que define o domínio celestial.</li><br>
    <li><strong>S (Comunicação, foco: Comunicação):</strong> Revelando a capacidade do ser de transmitir sua verdade e sabedoria.</li><br>
  </ul>
  <p>A combinação de sua origem luminosa e sua forma de expressão tece perfeitamente o conceito de um Ser Celestial.</p><br>
  <p><strong>Tradução Literal Simbólica</strong>: "Origem essencial que se manifesta como luz e se expressa em comunicação consciente."</p><br>
  <p><strong>Tradução Poética</strong>: "Aquele que nasceu do coração da Fonte, tecendo sua existência na tapeçaria da luz estelar, e que sussurra os segredos cósmicos através das auroras."</p>
`;

const amsMeaningHtml = `
  <h1 class="text-center text-3xl">A Vibração do Ser Encarnado</h1> <br>
  <h2>Análise da Emissão: AMS</h2> <br>
  <ul>
    <li><strong>A (Substância / Ser):</strong> Representa a essência primordial da existência, o núcleo fundamental de qualquer ser. Neste contexto, estabelece o princípio do "ser" que permeia todas as formas de vida.</li><br>
    <li><strong>M (Matéria / Corpo):</strong> Modula a essência "A", ancorando-a na concretude da matéria e na forma física. Sinaliza a encarnação, a estrutura corpórea que define os seres mundanos.</li><br>
    <li><strong>S (Som / Vibrar):</strong> Adiciona a qualidade de vibração, comunicação e presença inerente aos seres vivos. Reflete o pulso vital, a capacidade de propagar sua existência e interagir com o ambiente através de sua energia e ressonância.</li><br>
  </ul>
  <p>A combinação das Fases em "AMS" evoca o ciclo da existência material. A vogal primordial 'A' estabelece a base do Ser. A consoante 'M' a molda em uma forma material, conferindo-lhe corpo e densidade. Finalmente, 'S' infunde essa forma material com a vibração da vida, a presença sensorial e a capacidade de interagir, expressando a complexidade e a vivacidade dos seres mundanos.</p><br>
  <p><strong>Tradução Literal Simbólica</strong>: "A Vibração do Ser Encarnado."</p><br>
  <p><strong>Tradução Poética</strong>: "A emanação primordial que se solidifica em corpo, vibrando com a essência da vida na manifestação física."</p>
`;


export const LUMINAR_DICTIONARY: DictionaryWord[] = [
  {
    word: 'ATSL',
    meaning: atslMeaningHtml,
  },
  {
    word: 'ALS',
    meaning: alsMeaningHtml,
  },
  {
    word: 'AMS',
    meaning: amsMeaningHtml,
  },
].sort((a, b) => a.word.localeCompare(b.word));
