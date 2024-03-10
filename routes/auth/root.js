const express = require('express');
const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
    res.send('There is also a...');
});

module.exports = router;