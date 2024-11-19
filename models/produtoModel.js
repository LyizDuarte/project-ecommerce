const Database = require("../db/database")
const fs = require("fs")

const conexao = new Database()
class ProdutoModel {
  #produtoId
  #produtoCodigo
  #produtoNome
  #produtoQuantidade
  #categoriaId
  #categoriaNome
  #marcaId
  #marcaNome
  #produtoValorUnitario
  #produtoImagem

  get produtoId() {
    return this.#produtoId
  }
  set produtoId(produtoId) {
    this.#produtoId = produtoId
  }
  get produtoCodigo() {
    return this.#produtoCodigo
  }
  set produtoCodigo(produtoCodigo) {
    this.#produtoCodigo = produtoCodigo
  }
  get produtoNome() {
    return this.#produtoNome
  }
  set produtoNome(produtoNome) {
    this.#produtoNome = produtoNome
  }
  get produtoQuantidade() {
    return this.#produtoQuantidade
  }
  set produtoQuantidade(produtoQuantidade) {
    this.#produtoQuantidade = produtoQuantidade
  }
  get categoriaId() {
    return this.#categoriaId
  }
  set categoriaId(categoriaId) {
    this.#categoriaId = categoriaId
  }
  get categoriaNome() {
    return this.#categoriaNome
  }
  set categoriaNome(categoriaNome) {
    this.#categoriaNome = categoriaNome
  }
  get marcaId() {
    return this.#marcaId
  }
  set marcaId(marcaId) {
    this.#marcaId = marcaId
  }
  get marcaNome() {
    return this.#marcaNome
  }
  set marcaNome(marcaNome) {
    this.#marcaNome = marcaNome
  }
  get produtoValorUnitario() {
    return this.#produtoValorUnitario
  }
  set produtoValorUnitario(produtoValorUnitario) {
    this.#produtoValorUnitario = produtoValorUnitario
  }
  get produtoImagem() {
    return this.#produtoImagem
  }
  set produtoImagem(produtoImagem) {
    this.#produtoImagem = produtoImagem
  }

  constructor(
    produtoId,
    produtoCodigo,
    produtoNome,
    produtoQuantidade,
    categoriaId,
    marcaId,
    categoriaNome,
    marcaNome,
    produtoValorUnitario,
    produtoImagem
  ) {
    this.#produtoId = produtoId
    this.#produtoCodigo = produtoCodigo
    this.#produtoNome = produtoNome
    this.#produtoQuantidade = produtoQuantidade
    this.#categoriaId = categoriaId
    this.#categoriaNome = categoriaNome
    this.#marcaId = marcaId
    this.#marcaNome = marcaNome
    this.#produtoValorUnitario = produtoValorUnitario
    this.#produtoImagem = produtoImagem
  }

  async validarEstoque(produtoId, quantidade) {
    let sql =
      "select * from tb_produto where prd_id = ? and prd_quantidade >= ?"
    let valores = [produtoId, quantidade]

    let rows = await conexao.ExecutaComando(sql, valores)

    return rows.length > 0
  }

  async excluir(codigo) {
    let sql = "delete from tb_produto where prd_id = ?"
    let valores = [codigo]

    var result = await conexao.ExecutaComandoNonQuery(sql, valores)

    return result
  }

  async gravar() {
    if (this.#produtoId == 0) {
      let sql =
        "insert into tb_produto (prd_cod, prd_nome, prd_quantidade, cat_id, mar_id, prd_valorunitario, prd_imagem) values (?, ?, ?, ?, ?, ?, ?)"

      let valores = [
        this.#produtoCodigo,
        this.#produtoNome,
        this.#produtoQuantidade,
        this.#categoriaId,
        this.#marcaId,
        this.#produtoValorUnitario,
        this.#produtoImagem,
      ]

      return await conexao.ExecutaComandoNonQuery(sql, valores)
    } else {
      //alterar
      let sql =
        "update tb_produto set prd_cod = ?, prd_nome =?, prd_quantidade= ?, cat_id = ?, mar_id = ?, prd_valorunitario = ?, prd_imagem = ? where prd_id = ?"

      let valores = [
        this.#produtoCodigo,
        this.#produtoNome,
        this.#produtoQuantidade,
        this.#categoriaId,
        this.#marcaId,
        this.#produtoValorUnitario,
        this.#produtoImagem,
        this.#produtoId,
      ]

      return (await conexao.ExecutaComandoNonQuery(sql, valores)) > 0
    }
  }

  async buscarProduto(id) {
    let sql = `select * from tb_produto p
                        inner join tb_marca m on p.mar_id = m.mar_id
                        inner join tb_categoria c on p.cat_id = c.cat_id
                    where prd_id = ? 
                    order by prd_id`
    let valores = [id]
    var rows = await conexao.ExecutaComando(sql, valores)

    let produto = null

    if (rows.length > 0) {
      var row = rows[0]

      let imagem = "/img/produto-sem-foto.png"
      if (
        row["prd_imagem"] != null &&
        fs.existsSync(
          global.CAMINHO_IMG_REAL + global.CAMINHO_IMG_NAV + row["prd_imagem"]
        )
      ) {
        imagem = global.CAMINHO_IMG_NAV + row["prd_imagem"]
      }

      produto = new ProdutoModel(
        row["prd_id"],
        row["prd_cod"],
        row["prd_nome"],
        row["prd_quantidade"],
        row["cat_id"],
        row["mar_id"],
        row["cat_nome"],
        row["mar_nome"],
        row["prd_valorunitario"],
        imagem
      )
    }

    return produto
  }

  async listarProdutos() {
    let sql =
      "select * from tb_produto p inner join tb_categoria c on p.cat_id = c.cat_id inner join tb_marca m on p.mar_id = m.mar_id order by prd_id"

    var rows = await conexao.ExecutaComando(sql)

    let listaRetorno = []

    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        var row = rows[i]

        let imagem = "/img/produto-sem-foto.png"
        if (
          row["prd_imagem"] != null &&
          fs.existsSync(
            global.CAMINHO_IMG_REAL + global.CAMINHO_IMG_NAV + row["prd_imagem"]
          )
        ) {
          imagem = global.CAMINHO_IMG_NAV + row["prd_imagem"]
        }

        listaRetorno.push(
          new ProdutoModel(
            row["prd_id"],
            row["prd_cod"],
            row["prd_nome"],
            row["prd_quantidade"],
            row["cat_id"],
            row["mar_id"],
            row["cat_nome"],
            row["mar_nome"],
            row["prd_valorunitario"],
            imagem
          )
        )
      }
    }

    return listaRetorno
  }

  toJSON() {
    return {
      produtoId: this.#produtoId,
      produtoCodigo: this.#produtoCodigo,
      produtoNome: this.#produtoNome,
      produtoValor: this.#produtoValorUnitario,
      marcaNome: this.#marcaNome,
      categoriaNome: this.#categoriaNome,
      produtoImagem: this.#produtoImagem,
    }
  }
}

module.exports = ProdutoModel
