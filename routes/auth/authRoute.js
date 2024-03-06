const router = require('express').Router();
const registerController = require('../../controllers/auth/registerController');
const loginController = require('../../controllers/auth/loginController');

const { checkLoggedIn } = require('../../middlewares/auth/authmw');

router.post('/register', registerController.register_post);
router.get('/register', registerController.register_get);
router.get('/login', loginController.login_get);
router.post('/login', loginController.login_post);

module.exports = router;