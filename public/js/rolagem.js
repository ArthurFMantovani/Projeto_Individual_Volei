/*Script para index de referenciação dentro da propria pagina*/

const linksInternos = document.querySelectorAll('a[href^="#"]');

function esperarFimDaRolagem(aoTerminar) {
  let ultimaPosicao = window.scrollY;
  let quadrosParados = 0;

  function verificar() {
    quadrosParados = window.scrollY === ultimaPosicao ? quadrosParados + 1 : 0;
    ultimaPosicao = window.scrollY;

    if (quadrosParados >= 8) {
      aoTerminar();
    } else {
      requestAnimationFrame(verificar);
    }
  }

  requestAnimationFrame(verificar);
}

function piscar(elemento) {
  elemento.classList.remove("piscando");
  elemento.offsetWidth;
  elemento.classList.add("piscando");
  elemento.addEventListener(
    "animationend",
    (evento) => {
      if (evento.target === elemento) elemento.classList.remove("piscando");
    },
    { once: true }
  );
}

linksInternos.forEach((link) => {
  link.addEventListener("click", (evento) => {
    const destino = document.querySelector(link.getAttribute("href"));
    if (!destino) return;

    evento.preventDefault();
    destino.scrollIntoView({ behavior: "smooth", block: "center" });
    esperarFimDaRolagem(() => piscar(destino));
  });
});