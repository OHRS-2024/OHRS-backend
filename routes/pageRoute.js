const router = require('express').Router();
const auth = require('./authRoute');
const pageController = require('../controllers/pageController');
const { checkLoggedIn } = require('../middlewares/authmw');

router.use(checkLoggedIn);
router.use('/home', pageController.get_home);   
router.use('/home', pageController.get_home);   


module.exports = router;