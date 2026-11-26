//Carrossel de fotos

const carrossel = document.querySelector(".carrossel");
const trilho = document.querySelector(".carrossel-trilho");
const originais = Array.from(trilho.children);
const total = originais.length;

for (let copia = 0; copia < 3; copia++) {
  originais.forEach((foto) => trilho.appendChild(foto.cloneNode(true)));
}

const fotos = Array.from(trilho.children);

let posicao = total;
let emDestaque = false;
let xDestaque = 0;
let temporizadorAvanco;
let temporizadorDestaque;

function medidas() {
  const espaco = parseFloat(getComputedStyle(trilho).columnGap);
  const largura = fotos[0].offsetWidth;
  return { largura, passo: largura + espaco, janela: carrossel.clientWidth };
}

function atualizarApagadas(x) {
  const { largura, passo, janela } = medidas();
  fotos.forEach((foto, i) => {
    const esquerda = i * passo - x;
    const dentro = esquerda >= -1 && esquerda + largura <= janela + 1;
    foto.classList.toggle("apagada", !dentro);
  });
}

function mover(x) {
  trilho.style.transition = "transform 0.7s ease";
  trilho.style.transform = `translateX(${-x}px)`;
  atualizarApagadas(x);
}

function posicionarSemAnimar(x) {
  trilho.style.transition = "none";
  trilho.style.transform = `translateX(${-x}px)`;
  trilho.offsetWidth;
}

function agendar() {
  clearTimeout(temporizadorAvanco);
  temporizadorAvanco = setTimeout(avancar, 3500);
}

function avancar() {
  if (posicao >= total * 2) {
    posicao -= total;
    posicionarSemAnimar(posicao * medidas().passo);
  }

  posicao++;
  mover(posicao * medidas().passo);
  agendar();
}

function retomar() {
  const { passo } = medidas();
  const posicaoAtual = Math.round(xDestaque / passo);
  posicao = ((((posicaoAtual - total) % total) + total) % total) + total;
  const deslocamento = (posicaoAtual - posicao) * passo;

  posicionarSemAnimar(xDestaque - deslocamento);
  emDestaque = false;
  mover(posicao * passo);
  agendar();
}

trilho.addEventListener("click", (evento) => {
  const foto = evento.target.closest(".foto");
  if (!foto) return;

  const { largura, passo, janela } = medidas();
  xDestaque = fotos.indexOf(foto) * passo + largura / 2 - janela / 2;
  emDestaque = true;

  clearTimeout(temporizadorAvanco);
  clearTimeout(temporizadorDestaque);
  mover(xDestaque);
  temporizadorDestaque = setTimeout(retomar, 6000);
});


window.addEventListener("resize", () => {
  clearTimeout(temporizadorDestaque);
  emDestaque = false;
  posicionarSemAnimar(posicao * medidas().passo);
  atualizarApagadas(posicao * medidas().passo);
  agendar();
});

posicionarSemAnimar(posicao * medidas().passo);
atualizarApagadas(posicao * medidas().passo);
agendar();