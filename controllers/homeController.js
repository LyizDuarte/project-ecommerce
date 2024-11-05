
class HomeController {

    constructor() {

    }

    homeView(req, res) {
        res.render('home/index', {});
    }
}


module.exports = HomeController;