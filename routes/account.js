const router = require('express').Router();
const verifyController = require('../controllers/account/verifyController');
const logoutController = require('../controllers/account/logoutController');

router.get('/logout', logoutController.logout_get);
router.post('/verify', verifyController.verify_post);
router.get('/verify', verifyController.verify_get);

module.exports = router;