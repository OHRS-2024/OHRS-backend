const router = require('express').Router();
const multer  = require('multer');
const path = require('path');

router.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/index.html');
});

const upload = multer().any();

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.send('Error uploading files.');
        } else {
            res.send('Files uploaded successfully.');
        }
    });
});




module.exports = router;
