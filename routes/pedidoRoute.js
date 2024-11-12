const express = require("express")
const PedidoController = require("../controllers/pedidoController")

const router = express.Router()

let ctrl = new PedidoController()

router.post("/gravar", ctrl.gravar)

module.exports = router
