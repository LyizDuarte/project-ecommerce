const express = require("express")
const PedidoController = require("../controllers/pedidoController")

const router = express.Router()

let ctrl = new PedidoController()

router.post("/gravar", ctrl.gravar)
router.get("/listar", ctrl.listar)
router.post("/listar", ctrl.listarComBusca)

module.exports = router
