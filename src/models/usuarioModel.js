
var database = require("../database/config");


// ==========================================
// AUTENTICAR USUÁRIO
// ==========================================

function autenticar(email, senha) {

    var instrucaoSql = `

        SELECT
            id AS idUsuario,
            nome,
            email,
            posicao

        FROM usuario

        WHERE email = ?
        AND senha = ?;

    `;

    console.log("Executando consulta de autenticação.");

    return database.executar(instrucaoSql, [email, senha]);

}


// ==========================================
// CADASTRAR USUÁRIO
// ==========================================

function cadastrar(nome, email, senha, posicao) {

    var instrucaoSql = `

        INSERT INTO usuario (
            nome,
            email,
            senha,
            posicao
        )

        VALUES (?, ?, ?, ?);

    `;

    console.log("Executando cadastro de usuário.");

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        posicao
    ]);

}


module.exports = {
    autenticar,
    cadastrar
};
