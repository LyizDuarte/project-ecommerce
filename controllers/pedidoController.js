const PedidoModel = require("../models/pedidoModel")
const PedidoItemModel = require("../models/pedidoItemModel")

class PedidoController {
  async gravar(req, res) {
    let ok = false
    let msg = ""
    if (req.body.length > 0) {
      //gerar pedido
      let pedido = new PedidoModel()
      let pedidoId = await pedido.gravar()
      //iniciar a geracao dos itens
      for (let i = 0; i < req.body.length; i++) {
        let item = new PedidoItemModel()
        //vinculo do pedido
        item.pedidoId = pedidoId
        item.produtoId = req.body[i].produtoId
        item.pedidoItemQuantidade = req.body[i].quantidade
        item.pedidoItemValor = req.body[i].produtoValor
        item.pedidoItemValorTotal =
          req.body[i].produtoValor * req.body[i].quantidade

        await item.gravar()
      }
      ok = true
      msg = "Pedido gravado com sucesso"
    } else {
      msg = "Nenhum produto para gravar"
    }
    res.send({ ok: ok, msg: msg })
  }

  async listar(req, res) {
    let pedidoItemModel = new PedidoItemModel()
    let lista = await pedidoItemModel.listar()
    res.render("Pedido/listagem", {lista})
  }
}

module.exports = PedidoController
