const Database = require("../db/database")

const banco = new Database()

class PedidoItemModel {
  #pedidodoItemId
  #pedidoId
  #produtoId
  #pedidoItemQuantidade
  #pedidoItemValor
  #pedidoItemValorTotal

  get pedidoItemId() {
    return this.#pedidodoItemId
  }
  set pedidoItemId(pedidoItemId) {
    this.#pedidodoItemId = pedidoItemId
  }

  get pedidoId() {
    return this.#pedidoId
  }
  set pedidoId(pedidoId) {
    this.#pedidoId = pedidoId
  }

  get produtoId() {
    return this.#produtoId
  }
  set produtoId(produtoId) {
    this.#produtoId = produtoId
  }

  get pedidoItemQuantidade() {
    return this.#pedidoItemQuantidade
  }
  set pedidoItemQuantidade(pedidoItemQuantidade) {
    this.#pedidoItemQuantidade = pedidoItemQuantidade
  }

  get pedidoItemValor() {
    return this.#pedidoItemValor
  }
  set pedidoItemValor(pedidoItemValor) {
    this.#pedidoItemValor = pedidoItemValor
  }

  get pedidoItemValorTotal() {
    return this.#pedidoItemValorTotal
  }
  set pedidoItemValorTotal(pedidoItemValorTotal) {
    this.#pedidoItemValorTotal = pedidoItemValorTotal
  }

  constructor(
    pedidodoItemId,
    pedidoId,
    produtoId,
    pedidoItemQuantidade,
    pedidoItemValor,
    pedidoItemValorTotal
  ) {
    this.#pedidodoItemId = pedidodoItemId
    this.#pedidoId = pedidoId
    this.#produtoId = produtoId
    this.#pedidoItemQuantidade = pedidoItemQuantidade
    this.#pedidoItemValor = pedidoItemValor
    this.#pedidoItemValorTotal = pedidoItemValorTotal
  }

  async listarPedidos() {
    let sql = `select * from tb_pedido p 
                    inner join tb_pedidoitens i on p.ped_id = i.ped_id
                    inner join tb_produto pr on i.prd_id = pr.prd_id order by p.ped_id`

    let rows = await banco.ExecutaComando(sql)

    let lista = []

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]

      lista.push(
        new PedidoItemModel(
          row["pit_id"],
          row["ped_id"],
          row["prd_id"],
          row["pit_quantidade"],
          row["pit_valorunidade"],
          row["pit_valortotal"],
          row["ped_data"],
          row["prd_nome"]
        )
      )
    }

    return lista
  }

  async listar() {
    let sql = "select * from tb_pedidoitens"

    let valores = []

    let rows = await banco.ExecutaComando(sql, valores)

    let listaItens = []

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      listaItens.push(
        new PedidoItemModel(
          row["pit_id"],
          row["ped_id"],
          row["prd_id"],
          row["pit_quantidade"],
          row["pit_valorunitario"],
          row["pit_valortotal"]
        )
      )
    }

    return listaItens
  }

  async gravar() {
    let sql =
      "insert into tb_pedidoitens (ped_id, prd_id, pit_quantidade, pit_valorunidade, pit_valortotal) values (?, ?, ?, ?, ?)"

    let valores = [
      this.#pedidoId,
      this.#produtoId,
      this.#pedidoItemQuantidade,
      this.#pedidoItemValor,
      this.#pedidoItemValorTotal,
    ]

    let result = await banco.ExecutaComandoNonQuery(sql, valores)

    return result
  }
}

module.exports = PedidoItemModel
