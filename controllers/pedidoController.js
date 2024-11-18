const PedidoModel = require("../models/pedidoModel")
const PedidoItemModel = require("../models/pedidoItemModel")
class PedidoController {
  async gravar(req, res) {
    let ok = false
    let msg = ""
    let listaValidacao = []
    if (req.body.length > 0) {
      let listaProdutos = []
      //validação de estoque

      for (let i = 0; i < req.body.length; i++) {
        let produtoId = req.body[i].produtoId
        let quantidade = req.body[i].quantidade
        let produto = new ProdutoModel()
        if ((await produto.validarEstoque(produtoId, quantidade)) == false) {
          listaValidacao.push(produtoId)
        }
      }

      if (listaValidacao.length == 0) {
        //gerar pedido
        let pedido = new PedidoModel()
        let pedidoId = await pedido.gravar()
        //inicar a geração dos itens
        for (let i = 0; i < req.body.length; i++) {
          let item = new PedidoItemModel()
          //vinculo do pedido;
          item.pedidoId = pedidoId
          item.produtoId = req.body[i].produtoId
          item.pedidoItemQuantidade = req.body[i].quantidade
          item.pedidoItemValor = req.body[i].produtoValor
          item.pedidoItemValorTotal =
            req.body[i].produtoValor * req.body[i].quantidade

          await item.gravar()

          //atualizar estoque
          let produto = new ProdutoModel()
          produto = await produto.buscarProduto(req.body[i].produtoId)

          produto.produtoQuantidade =
            produto.produtoQuantidade - req.body[i].quantidade

          await produto.gravar()
        }

        ok = true
        msg = "Pedido gravado com sucesso!"
      } else {
        msg = "Erro durante a validação de estoque"
      }
    } else {
      msg = "Nenhum produto para gravar!"
    }

    res.send({ ok: ok, msg: msg, listaValidacao: listaValidacao })
  }

  async listar(req, res) {
    let pedidoItemModel = new PedidoItemModel()
    let listaPedidos = await pedidoItemModel.listarPedidos()
    res.render("Pedido/listagem", { listaPedidos })
  }
}

module.exports = PedidoController
