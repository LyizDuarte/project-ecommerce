document.addEventListener("DOMContentLoaded", function () {
  let carrinho = localStorage.getItem("carrinho") || "[]" // Inicializar como array vazio se não existir
  atualizaContador()
  const btnAdd = document.querySelectorAll(".btnAddCarrinho")

  document.addEventListener("show.bs.modal", montarCarrinho)

  for (const btn of btnAdd) {
    btn.addEventListener("click", adicionarAoCarrinho)
  }

  function alterarQuantidadeProduto(produtoId, novaQuantidade) {
    const lista = JSON.parse(carrinho)
    //define limites de quantidade
    if (novaQuantidade < 0) novaQuantidade = 0
    else if (novaQuantidade > 999) novaQuantidade = 999

    document.querySelector(`input[data-produto='${produtoId}']`).value =
      novaQuantidade
    let valorTotal = 0
    for (let i = 0; i < lista.length; i++) {
      if (lista[i].produtoId == produtoId) {
        lista[i].quantidade = novaQuantidade
      }
      //calcular o valor total
      valorTotal += lista[i].produtoValor * lista[i].quantidade
    }
    //atualizar interface com novo valor total
    document.getElementById("valorTotal").innerText =
      "Valor Total: R$ " + valorTotal

    //persistir o carrinho no localStorage
    localStorage.setItem("carrinho", JSON.stringify(lista))
  }

  function aumentarQuantidade() {
    let produto = this.dataset.produto
    carrinho = localStorage.getItem("carrinho")
    const lista = JSON.parse(carrinho)
    const produtoEncontrado = lista.find((x) => x.produtoId == produto)
    alterarQuantidadeProduto(
      produtoEncontrado.produtoId,
      ++produtoEncontrado.quantidade
    )
  }
  function diminuirQuantidade() {
    let produto = this.dataset.produto
    carrinho = localStorage.getItem("carrinho")
    const lista = JSON.parse(carrinho)
    const produtoEncontrado = lista.find((x) => x.produtoId == produto)
    alterarQuantidadeProduto(
      produtoEncontrado.produtoId,
      --produtoEncontrado.quantidade
    )
  }

  function atualizaContador() {
    carrinho = localStorage.getItem("carrinho")
    const lista = JSON.parse(carrinho)
    if (lista && lista.length > 0)
      document.getElementById("contador").innerText = lista.length
    else document.getElementById("contador").innerText = 0
  }

  function montarCarrinho() {
    carrinho = localStorage.getItem("carrinho")
    let lista = JSON.parse(carrinho)
    if (lista && lista.length > 0) {
      //se tiver itens mostra a interface
      let html = `<table class="table table-hover"> 
                    <thead>
                      <tr>
                        <th> Imagem </th>
                        <th> Nome do produto </th>
                        <th> Marca </th>
                        <th> Categoria </th>
                        <th>  Valor </th>
                        <th> Quantidade </th>
                        <th> Ações </th>
                      </tr>
                    </thead>
                    <tbody>
                  `
      //construção do corpo da tabela
      let valorTotal = 0
      for (let i = 0; i < lista.length; i++) {
        valorTotal += lista[i].produtoValor * lista[i].quantidade
        html += `<tr>
                      <td><img src="${lista[i].produtoImagem}" width="80"/> </td>
                      <td>${lista[i].produtoNome} </td>
                      <td>${lista[i].marcaNome} </td>
                      <td>${lista[i].categoriaNome} </td>
                      <td>${lista[i].produtoValor} </td>
                      <td>
                        <div style="display: flex;">
                          <button data-produto="${lista[i].produtoId}" class="btnAdd btn btn-default"> + </button>
                          <input data-produto="${lista[i].produtoId}" value='${lista[i].quantidade}' type='number' class='form-control inputQtd' style='width: 75px;' />
                          <button data-produto="${lista[i].produtoId}" class="btnDiminuir btn btn-default"> - </button>
                        </div>
                      </td>
                      
                      <td>
                        <button class='btnExcluirCarrinho btn btn-danger' data-produto="${lista[i].produtoId}"><i class='fas fa-trash'></i></button>
                      </td>
                  </tr>`
      }
      html += `</tbdoy>
                </table>`

      html += `<div> 
                 <h4 id="valorTotal" style="text-align: end;">Valor Total: R$ ${valorTotal}</h4>          
               </div>`
      document.getElementById("corpoCarrinho").innerHTML = html
      //inicializa os eventos do botao ao inicializar o html
      inicializarEventos()
    } else {
      //se nao exibe a mensagem de carrinho vazio
    }
  }

  function inicializarEventos() {
    const btnExcluir = document.querySelectorAll(".btnExcluirCarrinho")
    for (const btn of btnExcluir) {
      btn.addEventListener("click", excluirProduto)
    }

    const btnAdicionar = document.querySelectorAll(".btnAdd")
    for (const btn of btnAdicionar) {
      btn.addEventListener("click", aumentarQuantidade)
    }

    const btnDiminuir = document.querySelectorAll(".btnDiminuir")
    for (const btn of btnDiminuir) {
      btn.addEventListener("click", diminuirQuantidade)
    }

    const inputQtd = document.querySelectorAll(".inputQtd")
    for (const btn of inputQtd) {
      btn.addEventListener("change", function () {
        let produto = this.dataset.produto
        let valor = this.value
        alterarQuantidadeProduto(produto, valor)
      })
    }
  }

  function excluirProduto() {
    const id = this.dataset.produto
    carrinho = localStorage.getItem("carrinho")
    let lista = JSON.parse(carrinho)
    if (lista && lista.length > 0) {
      lista = lista.filter((x) => x.produtoId != id)

      if (lista.length == 0) {
        localStorage.removeItem("carrinho")
        atualizaContador()
      } else {
        localStorage.setItem("carrinho", JSON.stringify(lista))
        montarCarrinho()
      }
    } else {
      document.getElementById("corpoCarrinho").innerHTML =
        "<h3>Carrinho vazio!</h3>"
    }
  }

  function adicionarAoCarrinho() {
    // Recuperar o id do produto
    let produtoId = this.dataset.produto
    const that = this
    fetch("/admin/produto/buscar/" + produtoId)
      .then((r) => {
        return r.json()
      })
      .then((r) => {
        if (r.ok) {
          let lista = JSON.parse(carrinho) || [] // Parse e inicialização do carrinho como array

          let flagAchou = false
          for (let i = 0; i < lista.length; i++) {
            if (r.produto.produtoId == lista[i].produtoId) {
              lista[i].quantidade += 1
              flagAchou = true
              break
            }
          }

          if (!flagAchou) {
            r.produto.quantidade = 1
            lista.push(r.produto)
          }

          localStorage.setItem("carrinho", JSON.stringify(lista))

          that.innerHTML = '<i class="fas fa-check"></i> Produto adicionado!'
          setTimeout(() => {
            that.innerHTML =
              "<i class='bi-cart-fill me-1'></i> Adicionar ao carrinho"
          }, 3000)

          atualizaContador()
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
})
