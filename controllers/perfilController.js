const PerfilModel = require("../models/perfilModel");

class PerfilController {

    async listagemView(req, res) {
        let perfilModel = new PerfilModel();
        let lista = await perfilModel.listar();

        res.render('perfil/listagem', { listaPerfil: lista })
    }

}

module.exports = PerfilController;