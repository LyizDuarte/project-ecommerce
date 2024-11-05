const MarcaModel = require("../models/marcaModel");

class MarcaController {

    async listarView(req, res) {
        let marca = new MarcaModel();
        let lista = await marca.listarMarcas();
        res.render('marca/listar', {lista: lista});
    }
}

module.exports = MarcaController;