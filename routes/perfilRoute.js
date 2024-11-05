const express = require('express');
const PerfilController = require('../controllers/perfilController');

let router = express.Router();

let ctrl = new PerfilController();

router.get('/', ctrl.listagemView);

module.exports = router;