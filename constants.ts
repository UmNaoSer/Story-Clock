
import { LuminarLetter, CatalogTopic, StructuredContent, ComicPageContent, ShotTypeContent, VideoArticleContent } from './types';

// Fix: Added the missing LUMINAR_ALPHABET constant.
export const LUMINAR_ALPHABET: LuminarLetter[] = [
  // Vowels - Define core concepts and color
  { name: 'A', meaning: 'Origem, Essência, Ser', category: 'Essência', color: '#f87171', path: 'M0,0 C25,-20 75,20 100,0' },
  { name: 'E', meaning: 'Energia, Movimento, Ação', category: 'Dinâmica', color: '#fb923c', path: 'M0,0 C25,20 75,-20 100,0' },
  { name: 'I', meaning: 'Consciência, Mente, Foco', category: 'Consciência', color: '#facc15', path: 'M0,0 L50,-20 L100,0' },
  { name: 'O', meaning: 'Forma, Estrutura, Ciclo', category: 'Forma', color: '#4ade80', path: 'M0,0 C50,-25 50,25 100,0' },
  { name: 'U', meaning: 'Vazio, Potencial, Espaço', category: 'Potencial', color: '#60a5fa', path: 'M0,0 C50,25 50,-25 100,0' },
  
  // Consonants - Modify or direct the vowels
  { name: 'T', meaning: 'Lei, Ordem, Estrutura Rígida', category: 'Ordem', color: '#c084fc', path: 'M0,0 L25,0 L25,-20 L75,-20 L75,0 L100,0' },
  { name: 'S', meaning: 'Comunicação, Som, Vibração', category: 'Expressão', color: '#f472b6', path: 'M0,0 C25,-15 40,15 50,0 S75,-15 100,0' },
  { name: 'L', meaning: 'Luz, Revelação, Manifestação', category: 'Revelação', color: '#ffffff', path: 'M0,0 L100,0 M50,-20 L50,20' },
  { name: 'M', meaning: 'Matéria, Corpo, Ancoragem', category: 'Matéria', color: '#9ca3af', path: 'M0,0 L25,20 L50,0 L75,20 L100,0' },
  { name: 'R', meaning: 'Fluxo, Mudança, Transição', category: 'Fluxo', color: '#2dd4bf', path: 'M0,0 C20,15 40,15 50,0 C60,-15 80,-15 100,0' },
  { name: 'N', meaning: 'Negação, Limite, Fim', category: 'Limite', color: '#78716c', path: 'M0,0 L50,0 L50,20 M50,-20 L50,0 L100,0' },
  { name: 'K', meaning: 'Força, Impacto, Ruptura', category: 'Força', color: '#fde047', path: 'M0,0 L40,-20 L60,20 L100,0' },
];

const LENS_ICON_PATH = 'M50 10 C 27.9 10, 10 27.9, 10 50 C 10 72.1, 27.9 90, 50 90 C 72.1 90, 90 72.1, 90 50 C 90 27.9, 72.1 10, 50 10 Z M50 25 C 63.8 25, 75 36.2, 75 50 C 75 63.8, 63.8 75, 50 75 C 36.2 75, 25 63.8, 25 50 C 25 36.2, 36.2 25, 50 25 Z';

const focalLensContent: StructuredContent = {
  introduction: `
    <p class="text-2xl italic text-stellar-gold/90 mb-4">"Uma coisa sobre a escolha de lentes é que é algo psicológico. Como você quer que o público se sinta? Qual é a perspectiva deles sobre a imagem que você está mostrando?"</p>
    <p class="text-right font-orbitron">- Roger Deakins</p>
    <br/>
    A escolha da lente é mais do que técnica - é emocional. Uma 50mm pode parecer real e honesta, enquanto uma 14mm distorce o mundo dos personagens. Em termos práticos, a distância focal determina a amplitude do campo de visão, a proximidade aparente dos objetos e como o espaço e a profundidade são renderizados.`,
  sections: [
    {
      focalLength: '50mm',
      title: 'O Olho Humano',
      description: 'Muitas vezes considerada a lente que mais se aproxima da percepção espacial do olho humano (em um sensor full-frame). Não distorce o espaço como as grande-angulares, nem o comprime como as teleobjetivas, oferecendo uma perspectiva naturalista.',
      iconPath: LENS_ICON_PATH,
      points: [
        { title: 'Cineastas Notáveis', content: 'Yasujirō Ozu usou uma 50mm quase exclusivamente. Alfred Hitchcock também a utilizou extensivamente em Psicose. Para Roger Deakins, a 50mm é sua escolha padrão para um close-up tradicional.' },
        { title: 'Características Técnicas', content: 'Design óptico simples, são menores, mais leves e frequentemente possuem aberturas muito rápidas, permitindo um belo bokeh e filmagens em pouca luz.' },
        { title: 'Exemplo Marcante', content: 'Em Barry Lyndon, Stanley Kubrick usou uma Carl Zeiss 50mm com abertura f/0.7 para filmar cenas à luz de velas, criando uma estética pictórica única.' },
      ],
    },
    {
      focalLength: '40mm',
      title: 'O Meio-Termo Sutil',
      description: 'Uma lente um pouco mais larga que a 50mm, a 40mm oferece um equilíbrio interessante, proporcionando mais compressão e linhas retas sem distorção em planos mais abertos.',
      iconPath: LENS_ICON_PATH,
      points: [
        { title: 'A Lente de Deakins', content: 'Roger Deakins usou uma 40mm na Alexa Mini LF (grande formato) para quase todo o filme <strong>1917</strong>. A escolha foi deliberada para não usar uma grande-angular e "ver o mundo inteiro", mantendo o foco nos personagens e criando uma sensação de profundidade de campo ligeiramente menor.' },
        { title: 'Estilo Documental', content: 'Trabalhando com os Irmãos Coen em <strong>Fargo</strong>, Deakins usou lentes um pouco mais longas (como 35mm e 40mm) para criar a sensação de uma "reconstituição documental", contrastando com o visual estilizado e grande-angular de filmes anteriores como The Hudsucker Proxy.' },
        { title: 'Outros Cineastas', content: 'Gordon Willis em O Poderoso Chefão; Wes Anderson em Rushmore (versão anamórfica).' },
      ],
    },
     {
      focalLength: '35mm',
      title: 'A Versatilidade Narrativa',
      description: 'Um pilar em quase todos os sets de lentes prime, a 35mm captura mais do mundo ao redor dos personagens do que uma 50mm, mas ainda é utilizável para closes sem grande distorção. É o limite onde os closes ainda se sentem confortáveis.',
      iconPath: LENS_ICON_PATH,
      points: [
        { title: 'Paleta Padrão', content: 'Para Roger Deakins, a 32mm ou 35mm é a escolha ideal para um plano "over-the-shoulder" (sobre o ombro), enquanto a 35mm ou 40mm funciona perfeitamente para um plano médio.' },
        { title: 'Cineasta Notável', content: 'Foi a única lente usada pelo DP Sayombhu Mukdeeprom em <strong>Me Chame Pelo Seu Nome</strong> para fotografar os personagens "em relação um ao outro e em perspectiva com o ambiente ao redor".' },
        { title: 'Ponto de Equilíbrio', content: 'Oferece o equilíbrio perfeito entre capturar o ambiente e manter a intimidade com o personagem, tornando-a uma das lentes mais populares e versáteis do cinema.' },
      ],
    },
    {
      focalLength: '27mm',
      title: 'A Distorção Íntima',
      description: 'Situada entre as padrões 35mm e 25mm, a 27mm (ou suas variantes 28mm/29mm) começa a distorcer sutilmente os rostos de forma mais caricata quando próxima aos atores, exagerando o espaço.',
      iconPath: LENS_ICON_PATH,
      points: [
        { title: 'Cineastas Notáveis', content: 'Usada por Wes Anderson para um tom cômico em <strong>Bottle Rocket</strong>; pelos Irmãos Coen em cenas de comédia sombria; e por David Cronenberg para criar proximidade e intimidade.' },
        { title: 'Efeito Espacial', content: 'Faz com que figuras em primeiro plano pareçam maiores e as de fundo, menores, criando uma visão exagerada e estilizada da realidade.' },
        { title: 'Proximidade Física', content: 'Lentes mais largas exigem que a câmera esteja fisicamente mais perto dos atores. Essa proximidade cria uma sensação diferente, trazendo o público para mais perto da cena de uma maneira envolvente.' },
      ],
    },
    {
      focalLength: '18mm',
      title: 'O Mundo Visceral',
      description: 'No reino das grande-angulares extremas, a 18mm expande drasticamente o campo de visão. Tradicionalmente usada para planos abertos, cineastas subverteram essa convenção, usando-a para closes perturbadores e imersivos.',
      iconPath: LENS_ICON_PATH,
      points: [
        { title: 'Cineastas Notáveis', content: 'Orson Welles a usou para distorcer rostos e criar deep focus. O DP Emmanuel "Chivo" Lubezki é famoso por levar seu uso ao extremo com diretores como Terrence Malick (<strong>A Árvore da Vida</strong>) e Alejandro G. Iñárritu (<strong>O Regresso</strong>).' },
        { title: 'Efeito Imersivo', content: 'Usar a 18mm para closes coloca o público "na pele" dos personagens, tornando a experiência visceral e íntima. A profundidade de campo maior torna o mundo ao redor mais presente.' },
        { title: 'Subversão da Convenção', content: 'O uso para retratos rompe com a tradição, criando uma linguagem visual que é intencionalmente distorcida, poderosa e contextualizadora.' },
      ],
    },
  ],
  conclusion: {
    title: "A Filosofia de um Mestre: Roger Deakins",
    content: `
      <p class="mb-4">Para além de distâncias focais específicas, a abordagem de Roger Deakins revela uma filosofia cinematográfica profunda. Ele prefere <strong>lentes prime</strong> (fixas) porque elas forçam uma decisão deliberada sobre onde colocar a câmera, evitando a "preguiça" que uma lente zoom pode incentivar. Para ele, a lente também define a <strong>perspectiva</strong>: filmar o personagem principal com uma lente mais larga e os outros com lentes mais longas pode sutilmente colocar o público no ponto de vista do protagonista.</p>
      <p>Tecnicamente, Deakins busca a pureza da imagem. Ele abomina "artefatos" como <strong>flares</strong>, <strong>vinhetas</strong> indesejadas e, especialmente, a <strong>"respiração" da lente</strong> (a ligeira mudança de enquadramento ao mudar o foco). É por isso que ele frequentemente utiliza lentes como as ARRI Master Primes, conhecidas por sua perfeição ótica e ausência de respiração, garantindo que nada distraia da emoção e da história contida no quadro.</p>
    `
  }
};

const comicPageContent: ComicPageContent = {
  introduction: `<p>Após décadas desenhando mais de mil páginas de quadrinhos para editoras como Marvel e Scholastic, um conjunto de lições se transformou em 12 princípios essenciais. Estes não são apenas dicas; são os mandamentos para navegar no caos criativo, evitar os erros mais comuns e, o mais importante, terminar o que você começou.</p>`,
  commandments: [
    { number: 1, title: 'Termine a HQ', description: 'A maioria dos quadrinhos nunca é finalizada. Terminar não é apenas sobre lançar um produto, é sobre sua reputação. As pessoas lembram de quem entrega. Ao finalizar, você se separa de 99% dos criadores.' },
    { number: 2, title: 'Balões de Fala são Reis', description: 'Por terem o maior contraste na página, os balões de fala atraem o olho instintivamente. Use-os para guiar o fluxo de leitura da página. Não subestime seu poder composicional.' },
    { number: 3, title: 'Respeite o Z', description: 'A leitura ocidental segue um padrão de Z: da esquerda para a direita, de cima para baixo. Não lute contra esse instinto. Use-o para guiar suas composições e evitar confusão no leitor.' },
    { number: 4, title: 'Clareza Acima de Estilo', description: 'Não sacrifique a clareza da narrativa por um design ou layout "legal". Se confunde o leitor ou atrasa a história, não vale a pena. A história vem em primeiro lugar.' },
    { number: 5, title: 'Use a Ferramenta que Funciona', description: 'Digital, tradicional, 3D, pintura - não importa. Se a ferramenta ajuda você a terminar a HQ (Mandamento 1), ela é a ferramenta certa. Abandone o purismo que impede seu progresso.' },
    { number: 6, title: 'Saiba o Final Antes de Começar', description: 'Conhecer o final da história facilita todas as outras partes do processo, desde plantar pistas no início até ajustar um meio de história enfraquecido. Isso se aplica até mesmo se você estiver desenhando um roteiro de outra pessoa.' },
    { number: 7, title: 'Painéis Controlam o Ritmo', description: 'Painéis são a unidade de medida do tempo nos quadrinhos. Varie seu tamanho, forma e frequência para acelerar ou desacelerar a narrativa. Não se prenda a uma grade monótona.' },
    { number: 8, title: 'Onomatopeias são Narrativa', description: 'Não trate os efeitos sonoros como um detalhe posterior. A arte e o estilo de boas onomatopeias podem enriquecer a história, aprofundar o mundo e se tornar mais uma ferramenta em seu arsenal criativo.' },
    { number: 9, title: 'Toda Cena Precisa de um Plano de Estabelecimento', description: 'Negligenciar o plano que estabelece o local priva sua cena de contexto e prepara o leitor para a confusão. Sempre se pergunte: eu mostrei onde esses personagens estão?' },
    { number: 10, title: 'Quadrinhos Não São Filmes', description: 'Quadrinhos são uma forma de arte única. Explore o que só pode ser feito em uma página. Não pense neles apenas como storyboards. Crie páginas bonitas e explore o design de painéis.' },
    { number: 11, title: 'Pense como um Palco de Teatro, Não um Set de Filmagem', description: 'Adicione detalhes suficientes para passar a ideia. Você não precisa detalhar cada centímetro do cenário. A imaginação do leitor preencherá as lacunas, especialmente se você já fez um bom plano de estabelecimento.' },
    { number: 12, title: 'A Cor Controla o Humor', description: 'A cor não é decoração, é narrativa. Use-a como uma pista visual para o humor da cena, para o desenvolvimento de personagens ou para criar atmosfera. Um pouco de teoria da cor vai longe.' },
  ],
  conclusion: {
    title: "O Mandamento Sagrado",
    content: `<p>Essas regras podem ser quebradas quando a história exige, exceto a primeira. O Mandamento Nº 1 é sagrado. Cada projeto inacabado destrói sua confiança e reescreve sua identidade como alguém que "quase consegue". Mas no momento em que você termina, a história muda. Você se torna o tipo de pessoa que realiza, que conclui, que efetivamente <strong>faz</strong> quadrinhos. E essa mudança é o jogo inteiro.</p>`,
  }
};

const shotTypeContent: ShotTypeContent = {
  introduction: `<h3>Os 9 Planos Simples Para Contar Qualquer História</h3><p>Estes são os blocos de construção essenciais da narrativa visual. Dominá-los não é sobre regras rígidas, mas sobre entender como cada plano evoca um sentimento específico, guiando a experiência do espectador. Use-os como seu alfabeto cinematográfico para compor cenas que ressoam com clareza e emoção.</p>`,
  shots: [
    { 
      number: 1, 
      title: 'O Plano Aberto', 
      subtitle: 'Wide Shot', 
      description: `
        <h4>O que é:</h4>
        <p>Mostra todo o ambiente ao redor do seu assunto. Pode incluir pessoas, paisagens, edifícios - qualquer coisa que defina o cenário.</p>
        <h4>Por que importa:</h4>
        <p>Ajuda o espectador a entender a cena antes de mergulhar em closes ou ação. Também pode criar sentimentos: amplitude = liberdade, solidão, perda, pequenez.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>No início de uma cena.</li>
          <li>Ao introduzir um novo local.</li>
          <li>Para mostrar escala, distância ou isolamento.</li>
          <li>Como um respiro entre planos mais fechados.</li>
        </ul>
        <h4>Dica Pro:</h4>
        <p>Tente mover a câmera lentamente para dentro da cena (um push-in) para adicionar energia ou curiosidade. Um pequeno movimento pode transformar um plano passivo em um emocional.</p>
      ` 
    },
    { 
      number: 2, 
      title: 'O Plano Médio', 
      subtitle: 'Medium Shot', 
      description: `
        <h4>O que é:</h4>
        <p>Geralmente mostra uma pessoa da cintura para cima. É amplo o suficiente para ver parte do ambiente, mas perto o suficiente para ver o que alguém está fazendo ou sentindo.</p>
        <h4>Por que importa:</h4>
        <p>Conecta o espectador tanto ao personagem quanto ao espaço ao redor dele. Você ainda vê o rosto (emoção) e o corpo, mas também o que eles estão fazendo e onde estão. É um bom equilíbrio e parece natural.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>Para ações cotidianas, como trabalhar ou se mover.</li>
          <li>Após um plano aberto, quando você quer se aproximar.</li>
          <li>Quando você quer mostrar tanto a pessoa quanto o que está ao seu redor.</li>
        </ul>
        <h4>Dica Pro:</h4>
        <p>Use um plano médio para seguir um plano aberto. Esse pequeno passo mais perto ajuda o espectador a se sentir mais conectado, sem pular diretamente para um close-up.</p>
      ` 
    },
    { 
      number: 3, 
      title: 'O Close-up', 
      subtitle: 'Close Shot', 
      description: `
        <h4>O que é:</h4>
        <p>Foca em uma coisa: um rosto, uma mão, um objeto ou um pequeno detalhe. Seja emoção ou detalhes, ele diz ao espectador: preste atenção nisso.</p>
        <h4>Por que importa:</h4>
        <p>É aqui que a emoção vive. Ele aproxima o espectador e torna as coisas mais pessoais ou intensas. Também pode destacar ações ou pistas que movem a história para frente.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>Para mostrar como alguém se sente.</li>
          <li>Quando algo pequeno é importante.</li>
          <li>Para guiar a atenção do espectador para um detalhe específico.</li>
        </ul>
        <h4>Dica Pro:</h4>
        <p>Use um close-up logo após um plano mais aberto para mudar o foco do espectador; cria uma sensação de que algo "acabou de ficar sério".</p>
      ` 
    },
    { 
      number: 4, 
      title: 'Plano Sobre o Ombro', 
      subtitle: 'Over-the-Shoulder', 
      description: `
        <h4>O que é:</h4>
        <p>Este plano é enquadrado por trás do ombro de um personagem, então você vê um pouco do personagem e aquilo em que ele está focado.</p>
        <h4>Por que importa:</h4>
        <p>Dá ao espectador a sensação de estar lá, como se estivesse logo atrás do personagem. Você não está apenas mostrando um objeto, está mostrando-o através da presença de alguém.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>Em conversas ou interações com outros.</li>
          <li>Quando alguém está focado em um objeto ou tarefa.</li>
          <li>Quando você quer mostrar o que eles veem, mas ainda incluí-los no plano.</li>
        </ul>
        <h4>Erro Comum:</h4>
        <p>Enquadrar muito pouco ou muito da pessoa. Ou o ombro desaparece, ou domina o plano. Encontre o meio-termo onde você sente a presença, mas ainda vê a cena.</p>
      ` 
    },
    { 
      number: 5, 
      title: 'Ponto de Vista', 
      subtitle: 'Point of View (POV)', 
      description: `
        <h4>O que é:</h4>
        <p>Um plano POV é filmado da perspectiva exata do personagem. A câmera mostra o que eles estão vendo para que o espectador sinta que está dentro da cabeça do personagem.</p>
        <h4>Por que importa:</h4>
        <p>Coloca o espectador diretamente dentro da cena. Em vez de assistir de fora, eles estão vendo o que o personagem vê. É simples, mas super eficaz quando você quer que algo pareça pessoal, tenso ou real.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>Para criar imersão ou intensidade.</li>
          <li>Quando você quer que o espectador se sinta como o personagem.</li>
          <li>Para mostrar uma ação ou reação de dentro.</li>
        </ul>
        <h4>Erro Comum:</h4>
        <p>Segurar a câmera muito baixo ou muito alto, fazendo com que não pareça o ponto de vista real do personagem. Mantenha-a entre a boca e o nível dos olhos para ser crível.</p>
      ` 
    },
    { 
      number: 6, 
      title: 'Plano de Acompanhamento', 
      subtitle: 'Tracking Shot', 
      description: `
        <h4>O que é:</h4>
        <p>Um plano de acompanhamento segue o personagem enquanto ele se move por um espaço. A câmera se move com ele, andando, correndo, virando, etc., em vez de ficar parada.</p>
        <h4>Por que importa:</h4>
        <p>Dá energia e uma sensação de momentum. Em vez de assistir à distância, o espectador se move com o personagem, como se fizesse parte do momento. Pode parecer dinâmico, calmo, tenso, tudo depende da história.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>Quando um personagem está andando, correndo ou indo a algum lugar.</li>
          <li>Para criar movimento e direção em sua história.</li>
          <li>Durante cenas em que algo está mudando ou prestes a acontecer.</li>
        </ul>
        <h4>Dica Pro:</h4>
        <p>Se seu personagem está correndo, em pânico ou em um momento caótico, tente usar a câmera na mão e deixá-la se mover mais livremente. Essa trepidação pode realmente tornar o momento mais intenso e real.</p>
      ` 
    },
    { 
      number: 7, 
      title: 'Movimento no Quadro', 
      subtitle: 'Movement in Frame', 
      description: `
        <h4>O que é:</h4>
        <p>Este plano permanece completamente parado enquanto o personagem se move através do quadro, entrando, saindo ou passando por ele.</p>
        <h4>Por que importa:</h4>
        <p>É uma maneira simples de mostrar mudança ou progressão sem mover a câmera. Pode parecer quieto, calmo ou até um pouco distante, como se estivéssemos apenas observando o momento.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>Quando um personagem está se movendo, entrando ou saindo de um espaço.</li>
          <li>Para mostrar alguém à deriva, vagando ou em transição para o próximo lugar (ou cena).</li>
          <li>Quando você quer que um momento pareça parado, natural ou reflexivo.</li>
        </ul>
        <h4>Erro Comum:</h4>
        <p>Posicionar a câmera em qualquer lugar sem pensar no que está no fundo. Como a câmera não se move, o fundo se torna parte da história, então tenha isso em mente ao filmar.</p>
      ` 
    },
    { 
      number: 8, 
      title: 'Push-in / Pull-out', 
      subtitle: '', 
      description: `
        <h4>O que é:</h4>
        <p>Este plano se move lentamente para mais perto (push-in) ou mais longe (pull-out) do personagem ou da cena. É uma maneira de mudar a energia emocional sem precisar de uma grande ação ou atuação.</p>
        <h4>Por que importa:</h4>
        <p>Um push-in cria tensão ou foco, como se algo importante estivesse prestes a acontecer. Um pull-out faz o oposto: cria espaço, alívio ou distância. Mesmo um pequeno movimento pode fortalecer um momento.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>Para construir uma decisão, realização ou emoção.</li>
          <li>Para criar uma sensação de alívio ou fechamento.</li>
          <li>Para tornar um momento mais forte sem adicionar ação.</li>
        </ul>
        <h4>Dica Pro:</h4>
        <p>Se você quer o resultado mais suave, peça a um amigo com um gimbal (ou mãos firmes) para ajudar com o movimento da câmera. É uma maneira simples de destacar seu vídeo, especialmente quando se encaixa no momento.</p>
      ` 
    },
    { 
      number: 9, 
      title: 'O Plano de Afastamento', 
      subtitle: 'Walk-Away Shot', 
      description: `
        <h4>O que é:</h4>
        <p>Este plano mostra o personagem se afastando da câmera, geralmente para fora do quadro ou para a distância. Muitas vezes marca o fim de uma cena ou capítulo.</p>
        <h4>Por que importa:</h4>
        <p>Dá uma sensação de fechamento. Quando um personagem se afasta, parece que está seguindo em frente de um lugar, um momento ou uma decisão. Também cria espaço para o espectador refletir.</p>
        <h4>Quando usar:</h4>
        <ul>
          <li>No final de uma cena ou capítulo de sua história.</li>
          <li>Para mostrar um personagem deixando algo para trás.</li>
          <li>Para dar ao espectador um momento para respirar.</li>
        </ul>
        <h4>Dica Pro:</h4>
        <p>Enquadre o plano de modo que o espaço ao redor do personagem nos diga algo. Um deserto vasto e vazio parece diferente de um corredor apertado em direção a uma porta. O fundo ajuda a moldar como nos sentimos sobre a partida deles.</p>
      ` 
    },
  ],
  bonus: {
    title: 'Bônus: Planos Criativos',
    content: 'Além dos nove fundamentos, aqui estão algumas técnicas criativas para experimentar.',
    topics: [
      { 
        title: 'Ângulos Altos e Baixos',
        subtitle: 'High & Low Angles',
        content: '<p>A posição da câmera em relação ao sujeito pode mudar drasticamente a sensação da cena. Um <strong>ângulo alto</strong>, olhando de cima para baixo, pode fazer o personagem parecer menor, mais vulnerável ou inseguro. Por outro lado, um <strong>ângulo baixo</strong>, olhando de baixo para cima, pode fazer o personagem parecer mais poderoso, confiante ou até um pouco intimidador. Brincar com esses ângulos é uma das maneiras mais simples de influenciar como o espectador se sente em relação ao personagem.</p>' 
      },
      { 
        title: 'Snorricam',
        subtitle: 'Intensidade emocional e desorientação',
        content: `
          <h4>O que é:</h4>
          <p>Este plano é filmado com a câmera acoplada ao personagem, geralmente de frente para ele, de modo que seu rosto permanece centralizado enquanto o fundo se move descontroladamente ao seu redor.</p>
          <h4>Por que importa:</h4>
          <p>Cria imersão total. Você não está apenas assistindo ao personagem; você está dentro do que ele está passando. Funciona especialmente bem quando as emoções estão altas, ou quando a cena parece caótica ou avassaladora.</p>
          <h4>Quando usar:</h4>
          <ul>
            <li>Durante emoções intensas como pânico, confusão ou excitação.</li>
            <li>Quando o personagem está se movendo fisicamente e você quer mostrar seu estado interior.</li>
            <li>Para quebrar o fluxo e fazer o espectador se sentir desequilibrado.</li>
          </ul>
          <h4>Dica Pro:</h4>
          <p>Tente filmar uma versão onde você exagera o movimento e outra onde o mantém sutil. Às vezes, uma pequena mudança pode ser mais perturbadora do que o caos total.</p>
        ` 
      }
    ]
  }
};

const realismArticle: VideoArticleContent = {
  videoId: 'tvwPKBXEOKE',
  title: 'Análise Aprofundada sobre a Perda do Realismo no Cinema Moderno',
  introduction: `
    <h3 class="text-xl text-white font-orbitron mt-8 mb-4">Sumário Executivo</h3>
    <p class="text-light-nebula/90 mb-4">A análise do conteúdo de origem revela uma tese central: muitos filmes modernos carecem de uma sensação de "realismo" e imersão, não apenas devido a falhas técnicas como CGI ou colorização, mas por uma desconexão com princípios psicológicos e filosóficos mais profundos que regem a percepção do espectador.</p>
    <p class="text-light-nebula/90">Os conceitos fundamentais para entender essa questão são o <strong>Realismo Perceptivo</strong> e a <strong>Visualidade Háptica</strong>. A conclusão é que a imersão cinematográfica eficaz depende da intencionalidade do cineasta em criar uma experiência sensorial que envolva o espectador fisicamente.</p>
  `,
  sections: [
    {
      title: '1. O Problema da "Irrealidade": Além dos Aspectos Técnicos',
      content: `
        <p class="text-light-nebula/90 mb-4">A discussão começa com uma comparação visual direta entre <em>Jurassic World</em> e <em>O Mundo Perdido</em> (1997). A diferença notada não se resume à qualidade do CGI, mas a um "sentimento mais profundo de realismo e vividez" que parece ausente nas produções contemporâneas.</p>
        <p class="text-light-nebula/90">Enquanto filmes como <em>O Senhor dos Anéis</em> inspiram um desejo de visitar suas locações reais, contrapartes mais recentes como <em>O Hobbit</em> não conseguem evocar a mesma sensação de lugar tangível. Fatores técnicos como má iluminação são elementos superficiais; existem mecanismos filosóficos e psicológicos mais profundos em jogo.</p>
      `
    },
    {
      title: '2. Realismo Perceptivo: Construindo Mundos Críveis',
      content: `
        <p class="text-light-nebula/90 mb-4">O conceito de <strong>Realismo Perceptivo</strong>, definido por Steven Prince, postula que um filme parece real quando seus estímulos audiovisuais correspondem à experiência tridimensional do espectador no mundo real.</p>
        <ul class="list-disc ml-6 mt-2 space-y-2 text-light-nebula/90">
            <li><strong>Técnicas de Imersão:</strong> Composições com foco profundo (deep focus) e planos gerais convidam o público a "escanear" o quadro, criando uma sensação de tridimensionalidade.</li>
            <li><strong>O Contraste Moderno:</strong> Muitos filmes atuais adotam uma profundidade de campo rasa e planos médios-fechados (ex: Zack Snyder). Isso isola o sujeito, achata a imagem e remove a sensação de ambiente, prejudicando o realismo perceptivo.</li>
        </ul>
      `
    },
    {
      title: '3. A Forma Sobre o Conteúdo: Mundos Reais vs. Digitais',
      content: `
        <p class="text-light-nebula/90 mb-4">A análise argumenta que a <em>forma</em> como uma imagem é apresentada é mais crucial para a imersão do que seu <em>conteúdo</em> (se é real ou CGI).</p>
        <ul class="list-disc ml-6 mt-2 space-y-2 text-light-nebula/90">
            <li><strong>Estudo de Caso Positivo (Avatar: O Caminho da Água):</strong> Utiliza planos ricos em informação, onde sujeitos estão integrados ao ambiente, recompensando o olhar do espectador.</li>
            <li><strong>Estudo de Caso Negativo (Homem-Formiga e a Vespa: Quantumania):</strong> Descrito como falso devido a fundos desfocados e planos fechados que não integram personagens ao ambiente.</li>
            <li><strong>O Problema da Pós-Produção:</strong> Filmar de maneira "plana" para manter opções na pós-produção afeta o realismo. Exemplo: <em>Assassin's Creed</em> (2016), onde um salto real de dublê pareceu falso devido à "lama de CGI" e fumaça adicionadas.</li>
        </ul>
      `
    },
    {
      title: '4. Indexicalidade e a "Sensação" de Fisicalidade',
      content: `
        <p class="text-light-nebula/90 mb-4">Originalmente, a película era um índice físico da realidade (luz tocando o filme). No digital, isso se perde. No entanto, o estudioso David Davies argumenta que o que realmente importa é a <strong>sensação de fisicalidade</strong>.</p>
        <p class="text-light-nebula/90">Um filme digital como <em>O Regresso</em> pode transmitir uma sensação de realidade inalterada, enquanto um filme em película como <em>Jurassic World Dominion</em> pode parecer falso devido à manipulação excessiva.</p>
      `
    },
    {
      title: '5. Visualidade Háptica: O Cinema como Experiência Corporal',
      content: `
        <p class="text-light-nebula/90 mb-4">Conceito de Laura U. Marks: o cinema é uma experiência corporal onde a visão funciona como um órgão do tato (olhar háptico), discernindo texturas em vez de apenas formas.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="bg-cosmic-purple/40 p-4 rounded-lg border border-indigo-500/20">
                <h4 class="text-stellar-gold font-bold mb-2">Representações de Toque</h4>
                <p class="text-sm text-light-nebula/80">A exibição literal do toque na tela. Cenas que focam em mãos tocando objetos ou outras pessoas.</p>
            </div>
            <div class="bg-cosmic-purple/40 p-4 rounded-lg border border-indigo-500/20">
                <h4 class="text-stellar-gold font-bold mb-2">Close-ups Extremos</h4>
                <p class="text-sm text-light-nebula/80">Focar na minúcia de rostos ou ambientes, convidando a um estudo tátil (ex: Tarkovsky, Paul Thomas Anderson).</p>
            </div>
            <div class="bg-cosmic-purple/40 p-4 rounded-lg border border-indigo-500/20">
                <h4 class="text-stellar-gold font-bold mb-2">Profundidade de Campo Rasa (Intencional)</h4>
                <p class="text-sm text-light-nebula/80">Usada para destacar texturas específicas, como a umidade da chuva em <em>Taxi Driver</em>.</p>
            </div>
            <div class="bg-cosmic-purple/40 p-4 rounded-lg border border-indigo-500/20">
                <h4 class="text-stellar-gold font-bold mb-2">Invocação dos Elementos</h4>
                <p class="text-sm text-light-nebula/80">Uso potente de fogo, água, vento para criar resposta visceral (ex: <em>Silêncio</em>, Béla Tarr).</p>
            </div>
        </div>
        <p class="text-light-nebula/90 mt-4">Essa abordagem cria um "feedback de via dupla": o espectador "toca" a imagem com os olhos e o objeto "resiste", imprimindo uma sensação física de volta.</p>
      `
    }
  ],
  conclusion: {
    title: '6. Conclusão',
    content: `
      <p class="text-light-nebula/90">A criação de uma experiência imersiva vai além de técnicas isoladas. É um esforço intencional para alcançar o <strong>Realismo Subjetivo</strong> (qualia) - fazer o público sentir que acabou de vivenciar algo real, independentemente de ser uma fantasia.</p>
    `
  }
};

const screenwritingContent: StructuredContent = {
  introduction: `
    <h2 class="text-3xl font-cinzel text-stellar-gold text-center mb-6">As Regras da Escritura do Roteiro</h2>
    <p class="text-xl italic text-light-nebula/80 text-center mb-8">Baseado nos princípios de Jorge Furtado</p>
    <p class="text-light-nebula/90 text-lg leading-relaxed">
      Escrever roteiro não é literatura; é a arquitetura de um filme. O roteiro é um documento técnico e artístico que deve comunicar estritamente o que será captado pela câmera e pelo microfone. Furtado sintetiza essa disciplina em duas regras de ouro que separam amadores de profissionais.
    </p>
  `,
  sections: [
    {
      focalLength: 'Regra #1', // Using this field for the "Rule Number"
      title: 'Tudo Deve Ser Visível ou Audível',
      description: 'A regra mais inflexível. O roteirista deve traduzir emoções, pensamentos e contextos em ações concretas, luz e som.',
      iconPath: 'M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C70 85 85 70 85 50 C85 30 70 15 50 15 Z M50 40 C55 40 59 44 59 49 C59 54 55 58 50 58 C45 58 41 54 41 49 C41 44 45 40 50 40 Z', // Eye icon
      points: [
        {
          title: 'Honestidade Cinematográfica',
          content: 'Abstenha-se de escrever o que não pode ser filmado. Descrições como "reina uma atmosfera amorosa" são inúteis para a equipe técnica. Se a atmosfera é amorosa, descreva o toque suave, a luz quente, o sussurro.'
        },
        {
          title: 'O Problema dos Estados Internos',
          content: 'Rubricas como "João, livre de seus traumas..." são literatura, não cinema. O público não lê o roteiro; ele vê o filme. Mostre a liberdade de João através de suas ações, não de notas de rodapé.'
        }
      ]
    },
    {
      focalLength: 'Perigo', // Using this field for category
      title: 'Palavras "Invisíveis" (A Evitar)',
      description: 'Uma lista de termos que enganam o roteirista, criando a ilusão de que algo foi escrito quando, na verdade, nada visual foi criado.',
      iconPath: 'M20 20 L80 80 M80 20 L20 80', // X icon
      points: [
        {
          title: 'Negação e Não-Existência',
          content: '<em>"Não há ninguém", "Sem perceber"</em>. A câmera não filma o "não". Não escreva "ninguém olha para ela"; descreva o que as pessoas estão fazendo em vez disso.'
        },
        {
          title: 'Verbos de Pensamento',
          content: '<em>"Pensa", "Entende", "Lembra", "Imagina"</em>. Tudo isso acontece dentro do crânio do ator, onde a câmera não entra. Transforme "ele lembra" em "ele pega a foto antiga".'
        },
        {
          title: 'Relações Invisíveis',
          content: '<em>"Seu marido", "O bairro de sua infância"</em>. O público não sabe quem é marido de quem apenas olhando. A relação deve ser estabelecida por diálogo ou ação.'
        },
         {
          title: 'Adjetivos Subjetivos',
          content: '<em>"Longe", "Muito", "Tarde"</em>. O que é "longe" em um filme? Seja específico visualmente. Descreva a vastidão do deserto, não apenas diga que a casa é "isolada".'
        },
         {
          title: 'Redundâncias ("Vemos")',
          content: 'Evite escrever <em>"Vemos"</em> ou <em>"A câmera mostra"</em>. Tudo no roteiro é o que vemos. É redundante e gasta espaço.'
        }
      ]
    },
    {
      focalLength: 'Regra #2',
      title: 'Divisão Rigorosa em Cenas',
      description: 'A cena é a unidade fundamental de produção. Ela é definida pela continuidade de TEMPO, ESPAÇO e AÇÃO.',
      iconPath: 'M20 20 H80 V80 H20 Z M20 35 H80', // Clapperboard-ish
      points: [
        {
          title: 'A Santíssima Trindade da Cena',
          content: 'Se mudou o tempo (horas depois), é outra cena. Se mudou o lugar (da sala para a cozinha), é outra cena. Essa divisão é vital para o plano de filmagem.'
        },
        {
          title: 'Cabeçalho Padrão',
          content: 'CENA 1 - INT/EXT - LOCAÇÃO - DIA/NOITE. O cabeçalho é o mapa para a equipe de produção saber onde e quando filmar.'
        },
        {
            title: 'Numeração',
            content: 'Só numere as cenas quando o roteiro estiver bloqueado para produção (Shooting Script). Uma vez numerado, não mude os números; use A, B (Cena 8A) para inserções.'
        }
      ]
    }
  ],
  conclusion: {
    title: 'A História na Mínima Imagem',
    content: `
      <p>Furtado conclui citando Haroldo de Campos: <em>"há uma história na mínima unha de história"</em>. O objetivo final não é apenas seguir regras técnicas, mas alcançar uma densidade visual onde cada imagem carregue narrativa.</p>
      <p>Seja uma capa de <em>Pulp Fiction</em> ou uma foto jornalística, uma única imagem bem construída pode contar uma história inteira sem uma única linha de diálogo explicativo. É essa potência que o roteirista deve buscar ao traduzir palavras em visão.</p>
    `
  }
};


export const CATALOG_TOPICS: CatalogTopic[] = [
  {
    name: 'Realismo & Imersão',
    meaning: 'Por que filmes modernos parecem falsos? Uma análise sobre textura, luz e percepção.',
    category: 'Teoria Cinematográfica',
    fullDescription: realismArticle,
    path: 'M5 50 C5 50 25 10 50 10 C75 10 95 50 95 50 C95 50 75 90 50 90 C25 90 5 50 5 50 Z M50 25 C63.8 25 75 36.2 75 50 C75 63.8 63.8 75 50 75 C36.2 75 25 63.8 25 50 C25 36.2 36.2 25 50 25 Z M50 40 C55.5 40 60 44.5 60 50 C60 55.5 55.5 60 50 60 C44.5 60 40 55.5 40 50 C40 44.5 44.5 40 50 40 Z', // Eye icon
    color: '#38bdf8', // sky-400
  },
  {
    name: 'Distância Focal',
    meaning: 'Como a lente afeta a emoção e a narrativa visual.',
    category: 'Cinematografia',
    fullDescription: focalLensContent,
    path: 'M50 20 a 30 30 0 1 0 0.001 0 Z M50 35 a 15 15 0 1 0 0.001 0 Z', // Stylized Camera Lens
    color: '#fcd34d', // stellar-gold
  },
  {
    name: 'Roteiro & Escrita',
    meaning: 'Regras essenciais para transformar ideias em imagens filmáveis.',
    category: 'Pré-Produção',
    fullDescription: screenwritingContent,
    path: 'M30 20 L70 20 L80 30 L80 90 L20 90 L20 30 Z M30 20 L30 30 L20 30 M30 40 H70 M30 50 H70 M30 60 H70 M30 70 H50', // Document/Script icon
    color: '#e2e8f0', // slate-200
  },
  {
    name: 'Tipos de Plano',
    meaning: 'Os 9 planos essenciais para contar quase qualquer história.',
    category: 'Cinematografia',
    fullDescription: shotTypeContent,
    path: 'M 20 20 H 80 V 80 H 20 Z M 50 40 a 10 10 0 1 0 0.001 0 Z M 40 55 h 20 v 20 h -20 z',
    color: '#34d399',
  },
  {
    name: 'Criação de Quadrinhos',
    meaning: 'Os 12 mandamentos para criar e finalizar suas HQs.',
    category: 'Narrativa Visual',
    fullDescription: comicPageContent,
    path: 'M 10 10 H 90 V 70 H 60 L 50 85 L 40 70 H 10 Z', // Speech Bubble
    color: '#67e8f9', // cyan-300
  },
  {
    name: 'Regra dos Terços',
    meaning: 'O guia para uma composição visual harmônica.',
    category: 'Composição',
    fullDescription: '<h3>Em Breve</h3><p>Este tópico sobre a Regra dos Terços está sendo preparado e estará disponível em breve.</p>',
    path: 'M20 20 H 80 V 80 H 20 Z M 40 20 V 80 M 60 20 V 80 M 20 40 H 80 M 20 60 H 80', // Rule of Thirds Grid
    color: '#818cf8', // indigo-400
  },
  {
    name: 'Iluminação de 3 Pontos',
    meaning: 'Técnica clássica para modelar personagens com luz.',
    category: 'Iluminação',
    fullDescription: '<h3>Em Breve</h3><p>Este tópico sobre Iluminação de 3 Pontos está sendo preparado e estará disponível em breve.</p>',
    path: 'M50,85 L20,35 L35,20 L85,70 L70,85 Z M25,25 L45,45 M55,30 L75,50 M30,55 L50,75', // Stylized spotlight
    color: '#c084fc', // purple-400
  },
  {
    name: 'Temperatura de Cor',
    meaning: 'Evocando emoções através do uso de cores quentes e frias.',
    category: 'Cor',
    fullDescription: '<h3>Em Breve</h3><p>Este tópico sobre Temperatura de Cor está sendo preparado e estará disponível em breve.</p>',
    path: 'M50 15 a 35 35 0 1 0 0.001 0 Z M50 15 V 85 M19.5 32.7 L 80.5 67.3 M19.5 67.3 L 80.5 32.7', // Color wheel
    color: '#f87171', // red-400
  },
  {
    name: 'Edição e Cortes',
    meaning: 'Construindo tensão e ritmo através da montagem.',
    category: 'Pós-Produção',
    fullDescription: '<h3>Em Breve</h3><p>Este tópico sobre Edição e Cortes está sendo preparado e estará disponível em breve.</p>',
    path: 'M20 15 H 80 V 85 H 20 Z M20 40 H 80 M20 60 H 80 M35 15 V 85 M65 15 V 85', // Film strip
    color: '#e5e7eb', // gray-200
  },
];
