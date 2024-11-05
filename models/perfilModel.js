const Database = require('../db/database');

const banco = new Database();

class PerfilModel {

    #perfilId;
    #perfilDescricao;

    get perfilId() {
        return this.#perfilId
    }

    set perfilId(perfilId) {
        this.#perfilId = perfilId
    }

    get perfilDescricao() {
        return this.#perfilDescricao
    }

    set perfilDescricao(perfilDescricao) {
        this.#perfilDescricao = perfilDescricao
    }

    constructor(perfilId, perfilDescricao) {
        this.#perfilId = perfilId;
        this.#perfilDescricao = perfilDescricao;
    }

    async listar() {

        let sql = "select * from tb_perfil";

        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for(let i = 0; i<rows.length; i++) {
            let perfil = new PerfilModel()

            perfil.perfilId = rows[i]["per_id"];
            perfil.perfilDescricao = rows[i]["per_nome"]

            lista.push(perfil);
        }

        return lista;
    }

}

module.exports = PerfilModel;