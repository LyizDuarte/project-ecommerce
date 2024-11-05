const express = require('express');
const MarcaController = require('../controllers/marcaController');

const marcaRouter = express.Router();

let ctrl = new MarcaController();
marcaRouter.get('/', ctrl.listarView);


module.exports = marcaRouter;