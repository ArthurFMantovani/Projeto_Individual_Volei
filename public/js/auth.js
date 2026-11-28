
// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const abas = document.querySelectorAll(".aba");
const painelAbas = document.querySelector(".abas");
const cartao = document.querySelector(".cartao");

const sucesso = document.getElementById("sucesso");
const tituloSucesso = document.getElementById("sucesso-titulo");
const textoSucesso = document.getElementById("sucesso-texto");

const formularios = {
    login: document.getElementById("form-login"),
    cadastro: document.getElementById("form-cadastro")
};


// ==========================================
// ENDEREÇOS DA API
// ==========================================

const API_CADASTRO = "/usuarios/cadastrar";
const API_LOGIN = "/usuarios/autenticar";


// ==========================================
// ALTERNAR ENTRE LOGIN E CADASTRO
// ==========================================

function mostrar(nome) {

    abas.forEach((aba) => {
        const ativa = aba.dataset.alvo === nome;

        aba.classList.toggle("ativa", ativa);
        aba.setAttribute("aria-selected", ativa);
    });

    Object.entries(formularios).forEach(([chave, form]) => {
        form.hidden = chave !== nome;
    });

    sucesso.hidden = true;

    cartao.classList.toggle("larga", nome === "cadastro");

    painelAbas.hidden = false;
}

abas.forEach((aba) => {
    aba.addEventListener("click", () => {
        mostrar(aba.dataset.alvo);
    });
});


// ==========================================
// MOSTRAR E OCULTAR SENHA
// ==========================================

document.querySelectorAll(".mostrar").forEach((botao) => {

    botao.addEventListener("click", () => {

        const campo = botao.previousElementSibling;

        const oculta = campo.type === "password";

        campo.type = oculta ? "text" : "password";

        botao.textContent = oculta ? "Ocultar" : "Mostrar";

    });

});


// ==========================================
// REGRAS DE SENHA
// ==========================================

const senhaCadastro = document.getElementById("cad-senha");

const itensRequisitos = document.querySelectorAll("#requisitos li");

const regrasSenha = {

    tamanho: (senha) => senha.length >= 8,

    maiuscula: (senha) => /\p{Lu}/u.test(senha),

    minuscula: (senha) => /\p{Ll}/u.test(senha),

    numero: (senha) => /\d/.test(senha),

    simbolo: (senha) => /[^\p{L}\p{N}\s]/u.test(senha)

};

const mensagensSenha = {

    tamanho: "A senha precisa ter pelo menos 8 caracteres.",

    maiuscula: "Inclua pelo menos uma letra maiúscula.",

    minuscula: "Inclua pelo menos uma letra minúscula.",

    numero: "Inclua pelo menos um número.",

    simbolo: "Inclua pelo menos um símbolo."

};

function atualizarRequisitos() {

    itensRequisitos.forEach((item) => {

        const regra = regrasSenha[item.dataset.regra];

        item.classList.toggle("ok", regra(senhaCadastro.value));

    });

}

senhaCadastro.addEventListener("input", atualizarRequisitos);


// ==========================================
// VALIDAÇÃO DE E-MAIL
// ==========================================

function emailValido(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


// ==========================================
// MENSAGENS DE ERRO
// ==========================================

function mostrarErro(form, mensagem, campo = null) {

    form.querySelectorAll(".campo").forEach((caixa) => {
        caixa.classList.remove("erro");
    });

    form.querySelector(".mensagem").textContent = mensagem;

    if (campo) {

        const caixa = campo.closest(".campo");

        if (caixa) {
            caixa.classList.add("erro");
        }

        campo.focus();
    }

}

function limparErro(form) {

    form.querySelectorAll(".campo").forEach((caixa) => {
        caixa.classList.remove("erro");
    });

    form.querySelector(".mensagem").textContent = "";

}


// ==========================================
// TELA DE SUCESSO
// ==========================================

function concluir(titulo, texto) {

    Object.values(formularios).forEach((form) => {

        form.hidden = true;

        form.reset();

        limparErro(form);

    });

    atualizarRequisitos();

    painelAbas.hidden = true;

    tituloSucesso.textContent = titulo;

    textoSucesso.textContent = texto;

    sucesso.hidden = false;

}


// ==========================================
// LEITURA DAS RESPOSTAS DA API
// ==========================================

async function lerResposta(resposta) {

    const texto = await resposta.text();

    if (!texto) {
        return {};
    }

    try {
        return JSON.parse(texto);
    } catch {
        return { mensagem: texto };
    }

}


// ==========================================
// LOGIN - API WEBDATAVIZ
// ==========================================

formularios.login.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const form = formularios.login;

    const email = document.getElementById("login-email");

    const senha = document.getElementById("login-senha");

    if (!emailValido(email.value.trim())) {

        return mostrarErro(form, "Confira seu e-mail.", email);

    }

    if (senha.value === "") {

        return mostrarErro(form, "Digite sua senha.", senha);

    }

    limparErro(form);

    const botao = form.querySelector('button[type="submit"]');

    botao.disabled = true;

    botao.textContent = "Entrando...";

    try {

        const resposta = await fetch(API_LOGIN, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                emailServer: email.value.trim(),

                senhaServer: senha.value

            })

        });

        const dados = await lerResposta(resposta);

        if (!resposta.ok) {

            throw new Error(
                dados.mensagem || "E-mail ou senha inválidos."
            );

        }

        // Guarda os dados básicos da sessão no navegador.
        sessionStorage.setItem("usuarioLogado", JSON.stringify(dados));

        concluir(
            "Boa jogada!",
            `Bem-vindo de volta, ${dados.nome}! Seu login foi realizado com sucesso.`
        );

    } catch (erro) {

        console.error("Erro no login:", erro);

        mostrarErro(
            form,
            erro.message || "Não foi possível conectar à API."
        );

    } finally {

        botao.disabled = false;

        botao.innerHTML = 'Entrar em quadra <span>↗</span>';

    }

});


// ==========================================
// CADASTRO - API WEBDATAVIZ
// ==========================================

formularios.cadastro.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const form = formularios.cadastro;

    const nome = document.getElementById("cad-nome");

    const email = document.getElementById("cad-email");

    const posicao = document.getElementById("cad-posicao");

    const senha = document.getElementById("cad-senha");

    const confirmar = document.getElementById("cad-confirmar");


    // VALIDAÇÃO DO NOME

    if (nome.value.trim() === "") {

        return mostrarErro(form, "Digite seu nome.", nome);

    }


    // VALIDAÇÃO DO E-MAIL

    if (!emailValido(email.value.trim())) {

        return mostrarErro(form, "Confira seu e-mail.", email);

    }


    // VALIDAÇÃO DA POSIÇÃO

    if (posicao.value === "") {

        return mostrarErro(form, "Escolha sua posição.", posicao);

    }


    // VALIDAÇÃO DA SENHA

    for (const [nomeRegra, regra] of Object.entries(regrasSenha)) {

        if (!regra(senha.value)) {

            return mostrarErro(
                form,
                mensagensSenha[nomeRegra],
                senha
            );

        }

    }


    // CONFIRMAÇÃO DA SENHA

    if (senha.value !== confirmar.value) {

        return mostrarErro(
            form,
            "As senhas não correspondem.",
            confirmar
        );

    }

    limparErro(form);

    const botao = form.querySelector('button[type="submit"]');

    botao.disabled = true;

    botao.textContent = "Cadastrando...";

    try {

        // ENVIO DOS DADOS PARA A API WEBDATAVIZ

        const resposta = await fetch(API_CADASTRO, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                nomeServer: nome.value.trim(),

                emailServer: email.value.trim(),

                posicaoServer: posicao.value,

                senhaServer: senha.value

            })

        });

        const dados = await lerResposta(resposta);

        if (!resposta.ok) {

            throw new Error(
                dados.mensagem || "Não foi possível realizar o cadastro."
            );

        }

        concluir(
            "Conta criada com sucesso!",
            "Seus dados foram enviados para o banco de dados. Agora você já pode entrar em quadra."
        );

    } catch (erro) {

        console.error("Erro no cadastro:", erro);

        mostrarErro(
            form,
            erro.message || "Não foi possível conectar à API."
        );

    } finally {

        botao.disabled = false;

        botao.innerHTML = 'Criar minha conta <span>↗</span>';

    }

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

mostrar(
    location.hash === "#cadastro" ? "cadastro" : "login"
);
