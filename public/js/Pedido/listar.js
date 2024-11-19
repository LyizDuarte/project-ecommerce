document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnBuscar").addEventListener("click", buscar)
  document
    .getElementById("btnExportarExcel")
    .addEventListener("click", exportarExcel)

  function exportarExcel() {
    var wb = XLSX.utils.table_to_book(document.getElementById("tabelaPedidos"))
    XLSX.writeFile(wb, "pedidos-ecommerce.xlsx")
  }

  function buscar() {
    console.log("Fui chaado")
    let objetoBusca = {}
    let termo = document.getElementById("inputBusca").value
    let tipoBusca = ""
    if (document.querySelector("input[name='tipoBusca']:checked")) {
      tipoBusca = document.querySelector(
        "input[name='tipoBusca']:checked"
      ).value
    }

    if (termo != "" && (tipoBusca == "numero" || tipoBusca == "produto")) {
      objetoBusca.termo = termo
      objetoBusca.tipoBusca = tipoBusca
    } else if (termo == "") {
      objetoBusca.termo = termo
    } else {
      alert("Escolha o tipo da busca!")
      return
    }

    fetch("/pedido/listar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objetoBusca),
    })
      .then((r) => {
        return r.json()
      })
      .then((r) => {
        console.log(r)
        if (r.listaFiltrada.length > 0) {
          let html = ""
          for (let pedido of r.listaFiltrada) {
            html += `<tr>
                        <td>${pedido.pedidoId}</td>
                        <td>${new Date(pedido.dataPedido).toLocaleString()}</td>
                        <td>${pedido.produto}</td>
                        <td>${pedido.valorUnitario}</td>
                        <td>${pedido.quantidade}</td>
                        <td>${pedido.valorTotal}</td>
                    </tr>`
          }
          document.querySelector("#tabelaPedidos > tbody").innerHTML = html
        } else {
          alert("Nenhum item encontrado")
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
})
