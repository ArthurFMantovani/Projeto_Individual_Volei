const perguntas = [
  {
    pergunta: 'Em que ano William G. Morgan criou o esporte, então chamado de "mintonette"?',
    correta: "1895",
    erradas: ["1915", "1947", "1964"],
    explicacao: "Morgan, diretor de educação física da ACM de Holyoke, nos Estados Unidos, criou o esporte em 1895."
  },
  {
    pergunta: 'O nome original do esporte, "mintonette", lembrava qual outro esporte?',
    correta: "Badminton",
    erradas: ["Tênis", "Basquete", "Handebol"],
    explicacao: "O nome lembra o badminton. O basquete entra na história por outro motivo: Morgan queria um esporte menos puxado que ele."
  },
  {
    pergunta: "Em quais Jogos Olímpicos o vôlei estreou, com disputa masculina e feminina?",
    correta: "Tóquio 1964",
    erradas: ["Barcelona 1992", "Pequim 2008", "Londres 2012"],
    explicacao: "O esporte estreou nas Olimpíadas em Tóquio, em 1964, já com disputa masculina e feminina."
  },
  {
    pergunta: "Em que ano o Brasil conquistou o primeiro ouro olímpico do vôlei?",
    correta: "1992",
    erradas: ["1964", "2008", "2016"],
    explicacao: "Em Barcelona, em 1992, a seleção masculina venceu a final. No feminino, o ouro veio em Pequim 2008 e se repetiu em Londres 2012."
  },
  {
    pergunta: "Qual destas descrições é a do líbero?",
    correta: "Especialista em defesa e recepção, usa uniforme de outra cor",
    erradas: [
      "Organiza o ataque e costuma dar o segundo toque",
      "Joga no meio da rede, bloqueia e ataca as bolas rápidas",
      "Ataca pelo lado oposto ao do levantador"
    ],
    explicacao: "O líbero foi criado pela FIVB em 1998. Ele usa uniforme de outra cor, não bloqueia e não ataca acima da altura da rede."
  },
  {
    pergunta: "Quantos toques, no máximo, cada time pode dar antes de mandar a bola para o outro lado?",
    correta: "3 toques",
    erradas: ["2 toques", "4 toques", "5 toques"],
    explicacao: "São no máximo 3 toques por time. O bloqueio não conta como toque."
  },
  {
    pergunta: "Quantos pontos são necessários para ganhar um set, com pelo menos 2 de vantagem?",
    correta: "25 pontos",
    erradas: ["15 pontos", "20 pontos", "30 pontos"],
    explicacao: "O set vai a 25 pontos, com pelo menos 2 de vantagem. O quinto set, se existir, vai até 15."
  },
  {
    pergunta: "Qual é a altura da rede no vôlei masculino?",
    correta: "2,43 m",
    erradas: ["2,24 m", "1,98 m", "2,10 m"],
    explicacao: "No masculino a rede fica a 2,43 m, e no feminino a 2,24 m. Nas primeiras regras, ela tinha só 1,98 m."
  },
  {
    pergunta: "Qual posição joga no meio da rede, bloqueia e ataca as bolas rápidas?",
    correta: "Central",
    erradas: ["Levantador", "Oposto", "Ponteiro"],
    explicacao: "O central joga no meio da rede, bloqueia e ataca as bolas rápidas."
  },
  {
    pergunta: "Quantas vezes um único jogador pode chegar a saltar em uma só partida?",
    correta: "300 vezes",
    erradas: ["30 vezes", "100 vezes", "1.000 vezes"],
    explicacao: "Um único jogador pode chegar a saltar 300 vezes em uma partida."
  }
];

const letras = ["A", "B", "C", "D"];

const cartao = document.getElementById("quiz");
const telaInicio = document.getElementById("quiz-inicio");
const telaJogo = document.getElementById("quiz-jogo");
const telaResultado = document.getElementById("quiz-resultado");

const textoNumero = document.getElementById("quiz-numero");
const textoTotal = document.getElementById("quiz-total");
const barra = document.getElementById("quiz-barra");
const textoPergunta = document.getElementById("quiz-pergunta");
const listaAlternativas = document.getElementById("quiz-alternativas");
const caixaExplicacao = document.getElementById("quiz-explicacao");
const tituloExplicacao = document.getElementById("quiz-explicacao-titulo");
const textoExplicacao = document.getElementById("quiz-explicacao-texto");
const botaoAcao = document.getElementById("quiz-acao");

const botaoComecar = document.getElementById("quiz-comecar");

let indiceAtual = 0;
let acertos = 0;
let respondida = false;
let escolhida = null;

function embaralhar(lista) {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

function mostrarTela(tela) {
  telaInicio.hidden = tela !== telaInicio;
  telaJogo.hidden = tela !== telaJogo;
  telaResultado.hidden = tela !== telaResultado;
}

function voltarAoCartao() {
  if (cartao.getBoundingClientRect().top < 90) {
    cartao.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function atualizarProgresso() {
  const concluidas = indiceAtual + (respondida ? 1 : 0);
  barra.style.width = `${(concluidas / perguntas.length) * 100}%`;
}

function mostrarPergunta() {
  const atual = perguntas[indiceAtual];

  respondida = false;
  escolhida = null;

  textoNumero.textContent = indiceAtual + 1;
  textoTotal.textContent = perguntas.length;
  textoPergunta.textContent = atual.pergunta;

  listaAlternativas.innerHTML = "";

  embaralhar([atual.correta, ...atual.erradas]).forEach((texto, posicao) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "quiz-alternativa";
    botao.dataset.valor = texto;

    const letra = document.createElement("span");
    letra.className = "quiz-letra";
    letra.textContent = letras[posicao];

    const conteudo = document.createElement("span");
    conteudo.textContent = texto;

    botao.append(letra, conteudo);
    botao.addEventListener("click", () => escolher(botao));
    listaAlternativas.appendChild(botao);
  });

  caixaExplicacao.hidden = true;
  botaoAcao.textContent = "Confirmar resposta";
  botaoAcao.disabled = true;

  atualizarProgresso();
}

function escolher(botao) {
  if (respondida) {
    return;
  }

  listaAlternativas.querySelectorAll(".quiz-alternativa").forEach((item) => {
    item.classList.remove("selecionada");
  });

  botao.classList.add("selecionada");
  escolhida = botao.dataset.valor;
  botaoAcao.disabled = false;
}

function confirmar() {
  const atual = perguntas[indiceAtual];
  const acertou = escolhida === atual.correta;

  respondida = true;

  listaAlternativas.querySelectorAll(".quiz-alternativa").forEach((item) => {
    item.disabled = true;
    item.classList.remove("selecionada");

    if (item.dataset.valor === atual.correta) {
      item.classList.add("certa");
    } else if (item.dataset.valor === escolhida) {
      item.classList.add("errada");
    }
  });

  if (acertou) {
    acertos++;
  }

  tituloExplicacao.textContent = acertou ? "Ponto!" : "Bola fora.";
  textoExplicacao.textContent = atual.explicacao;
  caixaExplicacao.classList.toggle("acertou", acertou);
  caixaExplicacao.classList.toggle("errou", !acertou);
  caixaExplicacao.hidden = false;

  const ultima = indiceAtual === perguntas.length - 1;
  botaoAcao.textContent = ultima ? "Finalizar quiz" : "Próxima pergunta";

  atualizarProgresso();
}

function mostrarResultado() {
  mostrarTela(telaResultado);
  voltarAoCartao();
}

function comecar() {
  indiceAtual = 0;
  acertos = 0;

  mostrarTela(telaJogo);
  mostrarPergunta();
  voltarAoCartao();
}

botaoAcao.addEventListener("click", () => {
  if (!respondida) {
    confirmar();
    return;
  }

  if (indiceAtual === perguntas.length - 1) {
    mostrarResultado();
    return;
  }

  indiceAtual++;
  mostrarPergunta();
  voltarAoCartao();
});

botaoComecar.addEventListener("click", comecar);