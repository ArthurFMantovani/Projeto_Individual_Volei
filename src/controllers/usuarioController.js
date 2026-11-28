
var usuarioModel = require("../models/usuarioModel");


// ==========================================
// AUTENTICAR USUÁRIO
// ==========================================

function autenticar(req, res) {

    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email || !senha) {

        return res.status(400).json({
            mensagem: "Informe seu e-mail e sua senha."
        });

    }

    email = String(email).trim();

    usuarioModel.autenticar(email, senha)

        .then(function (resultado) {

            if (resultado.length !== 1) {

                return res.status(401).json({
                    mensagem: "E-mail ou senha inválidos."
                });

            }

            var usuario = resultado[0];

            return res.status(200).json({

                id: usuario.idUsuario,

                nome: usuario.nome,

                email: usuario.email,

                posicao: usuario.posicao

            });

        })

        .catch(function (erro) {

            console.error("Erro ao autenticar usuário:", erro);

            return res.status(500).json({
                mensagem: "Erro interno ao realizar login."
            });

        });

}


// ==========================================
// CADASTRAR USUÁRIO
// ==========================================

function cadastrar(req, res) {

    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var posicao = req.body.posicaoServer;


    // VALIDAR NOME

    if (!nome || !String(nome).trim()) {

        return res.status(400).json({
            mensagem: "Digite seu nome."
        });

    }


    // VALIDAR E-MAIL

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        return res.status(400).json({
            mensagem: "Informe um e-mail válido."
        });

    }


    // VALIDAR POSIÇÃO

    var posicoesPermitidas = [
        "levantador",
        "ponteiro",
        "central",
        "oposto",
        "libero",
        "torcedor"
    ];

    if (!posicao || !posicoesPermitidas.includes(posicao)) {

        return res.status(400).json({
            mensagem: "Selecione uma posição válida."
        });

    }


    // VALIDAR SENHA

    if (!senha || senha.length < 8) {

        return res.status(400).json({
            mensagem: "A senha deve possuir pelo menos 8 caracteres."
        });

    }


    nome = String(nome).trim();

    email = String(email).trim().toLowerCase();


    // ENVIAR PARA O MODEL

    usuarioModel.cadastrar(nome, email, senha, posicao)

        .then(function (resultado) {

            return res.status(201).json({

                mensagem: "Usuário cadastrado com sucesso!",

                id: resultado.insertId,

                nome: nome,

                email: email,

                posicao: posicao

            });

        })

        .catch(function (erro) {

            console.error("Erro ao cadastrar usuário:", erro);

            if (erro.code === "ER_DUP_ENTRY") {

                return res.status(409).json({
                    mensagem: "Este e-mail já está cadastrado."
                });

            }

            return res.status(500).json({
                mensagem: "Erro ao salvar o usuário no banco de dados."
            });

        });

}


module.exports = {
    autenticar,
    cadastrar
};
