const express = require('express');
const UsuarioController = require('../controllers/usuarioController');

let ctrl = new UsuarioController();

let router = express.Router();
router.get('/',ctrl.listagemView);
router.get('/cadastrar',ctrl.cadastroView);
router.post('/cadastrar',ctrl.cadastrar);
router.get('/alterar/:id', ctrl.alterarView);
router.post("/alterar", ctrl.alterar);
router.post("/excluir", ctrl.excluir);

module.exports = router;