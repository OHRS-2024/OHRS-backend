const router = require('express').Router();

const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');

const { checkLoggedIn } = require('../middlewares/authmw');

router.post('/register', registerController.register_post);

router.get('/register', registerController.register_get);

router.get('/login', loginController.login_get);

router.post('/login', loginController.login_post);

module.exports = router;