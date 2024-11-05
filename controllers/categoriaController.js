const CategoriaModel = require("../models/categoriaModel");

class CategoriaController {

    async listarView(req, res) {
        let cat = new CategoriaModel
        let lista = await cat.listarCategorias();
        res.render('categoria/listar', {lista: lista});
    }
}

module.exports = CategoriaController;