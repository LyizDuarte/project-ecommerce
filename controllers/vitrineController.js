const ProdutoModel = require("../models/produtoModel");



class VitrineController {


    async indexView(req, res) {
        const prd = new ProdutoModel();
        const lista = await prd.listarProdutos();
        res.render("vitrine/index.ejs", {produtos: lista, layout: false});
    }

}

module.exports = VitrineController;