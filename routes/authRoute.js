const router = require('express').Router();
const registerController = require('../controllers/auth/registerController');
const loginController = require('../controllers/auth/loginController');

router.get('/register', registerController.register_get);
router.get('/login', loginController.login_get);

router.post('/register', registerController.register_post);
router.post('/login', loginController.login_post);

module.exports = router;