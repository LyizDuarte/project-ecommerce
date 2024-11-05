const UsuarioModel = require("../models/usuarioModel");


class LoginController {

    loginView(req, res) {
        res.render('login/index', { layout: 'login/index' });
    }

    async login(req, res) {
        let msg = "";
        if(req.body.email != null && req.body.password != null) {
            let usuario = new UsuarioModel();
            usuario = await usuario.obterPorEmailSenha(req.body.email, req.body.password);
            if(usuario != null) {
                res.cookie("usuarioLogado", usuario.usuarioId);
                res.redirect("/");
            }
            else {
                msg = "Usuário/Senha incorretos!";
            }
        }
        else {
            msg = "Usuário/Senha incorretos!";
        }
    }
}

module.exports = LoginController;