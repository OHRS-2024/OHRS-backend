const router = require('express').Router();

const authController = require('../controllers/authController');

router.post('/register', authController.register_post);

router.get('/register', authController.register_get);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

module.exports = router;