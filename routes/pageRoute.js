const router = require('express').Router();
const auth = require('./authRoute');
router.get('/', (req, res) =>{
    res.render('welcome');
    res.end();
});

router.use('/auth', auth);

module.exports = router;