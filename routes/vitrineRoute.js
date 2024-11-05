const express = require("express");
const VitrineController = require("../controllers/vitrineController");

const router = express.Router()
let ctrl = new VitrineController();

router.get("/vitrine", ctrl.indexView);

module.exports = router;