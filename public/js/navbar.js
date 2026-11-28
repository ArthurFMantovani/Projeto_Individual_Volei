const topo = document.querySelector(".topo-fixo");

function atualizarTopo() {
  topo.classList.toggle("rolou", window.scrollY > 10);
}

window.addEventListener("scroll", atualizarTopo, { passive: true });
atualizarTopo();