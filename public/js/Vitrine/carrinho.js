document.addEventListener("DOMContentLoaded", function() {

    let carrinho = localStorage.getItem("carrinho");
    atualizaContador();
    const btnAdd = document.querySelectorAll(".btnAddCarrinho");

    for(const btn of btnAdd) {
        btn.addEventListener("click", adicionarAoCarrinho);
    }

    function atualizaContador() {

        carrinho = localStorage.getItem("carrinho");
        const lista = JSON.parse(carrinho);
        document.getElementById("contador").innerText = lista.length;
    }

    function adicionarAoCarrinho() {
        //recuperar o id do produto
        let produtoId = this.dataset.produto;
        const that = this;
        fetch("/produto/buscar/" + produtoId)
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            if(r.ok) {
                //é diferente de indefinido/nulo
                if(carrinho) { //carrinho com produtos
                    let lista = JSON.parse(carrinho);
                    //varrer lista para encontrar o produto
                    let flagAchou = false;
                    for(let i = 0; i<lista.length; i++) {
                        if(r.produto.produtoId == lista[i].produtoId) {
                            // se encontrei, aumentar a quantidade na lista;
                            lista[i].quantidade += 1;
                            flagAchou = true;
                        }
                    }
                    if(flagAchou == false)
                    {
                        //não achou, adiciona a nova posição com quantidade 1
                        r.produto.quantidade = 1;
                        lista.push(r.produto);
                    }
                    localStorage.setItem("carrinho", JSON.stringify(lista));
                }
                else {//carrinho vazio
                   let lista = [];
                   //iniciar produto com 1 quantidade;
                   r.produto.quantidade = 1;
                   lista.push(r.produto);
                   localStorage.setItem("carrinho", JSON.stringify(lista)) 
                }

                that.innerHTML = '<i class="fas fa-check"></i> Produto adicionado!';

                setTimeout(function() {
                    that.innerHTML = "<i class='bi-cart-fill me-1'></i> Adicionar ao carrinho"
                }, 3000);

                carrinho = localStorage.getItem("carrinho");
                atualizaContador();
            }
        })
        .catch(e => {
            console.error(e);
        })
    }
})