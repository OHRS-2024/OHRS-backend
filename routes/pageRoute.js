const router = require('express').Router();
const auth = require('./authRoute');
const pageController = require('../controllers/pageController');

router.use('/home', pageController.get_home);   


module.exports = router;