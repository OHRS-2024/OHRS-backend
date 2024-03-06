const router = require('express').Router();
const { checkLoggedIn, checkAuthorized} = require('../middlewares/auth/authmw');
const auth = require('../routes/auth/authRoute');
const pages = require('../routes/pageRoute');


router.use('/auth', checkLoggedIn, auth);
router.use('/pages', checkAuthorized, pages);

module.exports = router;