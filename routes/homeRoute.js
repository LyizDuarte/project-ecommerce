const express = require('express');
const HomeController = require('../controllers/homeController');

const homeRouter = express.Router();

let ctrl = new HomeController();
homeRouter.get('/', ctrl.homeView);

module.exports = homeRouter;