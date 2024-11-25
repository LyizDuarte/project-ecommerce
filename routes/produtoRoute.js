const express = require("express")
const multer = require("multer")
const ProdutoController = require("../controllers/produtoController")

const produtoRouter = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //faz a chamada para salvar no diretório específicado
    cb(null, "public/img/produtos")
  },
  filename(req, file, cb) {
    //última posição do array (extensão);
    let ext = file.originalname.split(".").pop()
    //novo nome do nosso arquivo
    let novoNome = Date.now().toString() + "." + ext
    cb(null, novoNome)
  },
})

let upload = multer({ storage })

let ctrl = new ProdutoController()
produtoRouter.get("/", ctrl.listarView)
produtoRouter.get("/cadastro", ctrl.cadastroView)
produtoRouter.post("/cadastro", upload.single("imagem"), ctrl.cadastrarProduto)
produtoRouter.post("/excluir", ctrl.excluirProduto)
produtoRouter.get("/alterar/:id", ctrl.alterarView)
produtoRouter.post("/alterar", upload.single("imagem"), ctrl.alterarProduto)
produtoRouter.get("/buscar/:produto", ctrl.buscarProduto)

module.exports = produtoRouter
