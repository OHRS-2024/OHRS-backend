const router = require('express').Router();
const registerController = require('../../controllers/auth/registerController');
const authController = require('../../controllers/auth/authController');
const logoutController = require('../../controllers/auth/logoutController');
const authorizationController = require('../../controllers/auth/authorizationController');

router.post('/register', registerController.createUser_post);
router.post('/verify', registerController.verify_post);
router.get('/register', registerController.register_get);

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

router.get('/logout', logoutController.handleLogout);
router.get('/refresh', authorizationController.handleRefreshToken);

module.exports = router;