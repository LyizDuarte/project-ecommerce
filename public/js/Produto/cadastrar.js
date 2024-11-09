document.addEventListener("DOMContentLoaded", function(){

    var btnGravar = document.getElementById("btnGravar");

    var inputImg = document.getElementById("inputImagem");

    inputImg.addEventListener("change", exibirPrevia);
    btnGravar.addEventListener("click", gravarProduto);
})

function exibirPrevia(e) {
    //carrega a imagem na div previaImagem!
    //ler a imagem;
    let imagem = document.getElementById("inputImagem").files[0];

    //validando extensão
    let ext = imagem.type.split("/").pop();
    if(ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
        let imgPrevia = document.getElementById("imgPrevia");
        let objImg = URL.createObjectURL(imagem);
        imgPrevia.setAttribute("src", objImg);
        document.getElementById("previaImagem").style.display = 'block';
    }
    else{
        alert("A extensão da imagem é inválida!");
        document.getElementById("inputImagem").value = "";
    }

}

function gravarProduto() {

    var inputCodigo = document.getElementById("inputCodigo");
    var inputNome = document.getElementById("inputNome");
    var inputQtde = document.getElementById("inputQtde");
    var selMarca = document.getElementById("selMarca");
    var selCategoria = document.getElementById("selCategoria");
    var inputValor = document.getElementById("inputValor");
    var inputFile = document.getElementById("inputImagem").files[0];

    //if de validação básica
    if(inputCodigo.value != "" && inputNome.value != "" && inputQtde.value != "" && inputQtde.value != '0' && selMarca.value != '0' && selCategoria.value != '0' &&
        inputValor != "" && inputFile != null) {

        //converter para um formData
        /*var data = {
            codigo: inputCodigo.value,
            nome: inputNome.value,
            quantidade: inputQtde.value,
            marca: selMarca.value,
            categoria: selCategoria.value
        }*/

        var data = new FormData();
        data.append("codigo", inputCodigo.value);
        data.append("nome", inputNome.value);
        data.append("quantidade", inputQtde.value);
        data.append("marca", selMarca.value);
        data.append("categoria", selCategoria.value);
        data.append("valor", inputValor.value);
        data.append("imagem", inputFile);

        fetch('/admin/produto/cadastro', {
            method: "POST",
            body: data
        })
        .then(r => {
            return r.json();
        })
        .then(r=> {
            if(r.ok) {
                alert("Produto cadastrado!");
            }
            else{
                alert("Erro ao cadastrar produto");
            }
        })
        .catch(e => {
            console.log(e);
        })

    }
    else{
        alert("Preencha todos os campos corretamente!");
        return;
    }
}