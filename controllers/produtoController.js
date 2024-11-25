const CategoriaModel = require("../models/categoriaModel")
const MarcaModel = require("../models/marcaModel")
const ProdutoModel = require("../models/produtoModel")
const fs = require("fs")

class ProdutoController {
  async buscarProduto(req, res) {
    let produto = new ProdutoModel()
    produto = await produto.buscarProduto(req.params.produto)
    res.send({ ok: true, produto: produto })
  }

  async listarView(req, res) {
    let prod = new ProdutoModel()
    let lista = await prod.listarProdutos()
    res.render("produto/listar", { lista: lista })
  }

  async excluirProduto(req, res) {
    var ok = true
    if (req.body.codigo != "") {
      let produto = new ProdutoModel()
      ok = await produto.excluir(req.body.codigo)
    } else {
      ok = false
    }

    res.send({ ok: ok })
  }
  async cadastrarProduto(req, res) {
    var ok = true
    if (
      req.body.codigo != "" &&
      req.body.nome != "" &&
      req.body.quantidade != "" &&
      req.body.quantidade != "0" &&
      req.body.marca != "0" &&
      req.body.categoria != "0" &&
      req.body.valor != "" &&
      req.file != null
    ) {
      let produto = new ProdutoModel(
        0,
        req.body.codigo,
        req.body.nome,
        req.body.quantidade,
        req.body.categoria,
        req.body.marca,
        "",
        "",
        req.body.valor,
        req.file.filename
      )

      ok = await produto.gravar()
    } else {
      ok = false
    }

    res.send({ ok: ok })
  }

  async alterarView(req, res) {
    let produto = new ProdutoModel()
    let marca = new MarcaModel()

    let categoria = new CategoriaModel()
    if (req.params.id != undefined && req.params.id != "") {
      produto = await produto.buscarProduto(req.params.id)
    }

    let listaMarca = await marca.listarMarcas()
    let listaCategoria = await categoria.listarCategorias()
    res.render("produto/alterar", {
      produtoAlter: produto,
      listaMarcas: listaMarca,
      listaCategorias: listaCategoria,
    })
  }

  async alterarProduto(req, res) {
    var ok = true
    if (
      req.body.codigo != "" &&
      req.body.nome != "" &&
      req.body.quantidade != "" &&
      req.body.quantidade != "0" &&
      req.body.marca != "0" &&
      req.body.categoria != "0" &&
      req.body.valor != "0"
    ) {
      let produtoOld = new ProdutoModel()
      produtoOld = await produtoOld.buscarProduto(req.body.id)
      let imagem = produtoOld ? produtoOld.produtoImagem.split("/").pop() : null
      if (req.file != null) {
        //faz a exclusão da imagem antiga no diretório
        imagem = req.file.filename
        if (produtoOld) {
          let caminho = global.CAMINHO_IMG_REAL + produtoOld.produtoImagem
          if (fs.existsSync(caminho)) fs.unlinkSync(caminho)
        }
      }

      let produto = new ProdutoModel(
        req.body.id,
        req.body.codigo,
        req.body.nome,
        req.body.quantidade,
        req.body.categoria,
        req.body.marca,
        "",
        "",
        req.body.valor,
        imagem
      )
      ok = await produto.gravar()
    } else {
      ok = false
    }

    res.send({ ok: ok })
  }

  async cadastroView(req, res) {
    let listaMarcas = []
    let listaCategorias = []

    let marca = new MarcaModel()
    listaMarcas = await marca.listarMarcas()

    let categoria = new CategoriaModel()
    listaCategorias = await categoria.listarCategorias()

    res.render("produto/cadastro", {
      listaMarcas: listaMarcas,
      listaCategorias: listaCategorias,
    })
  }
}

module.exports = ProdutoController
