const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pages = require('./routes/pageRoute');
const auth = require('./routes/authRoute');
const app = express();
const PORT = 4000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());

app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', './layouts/index');

const logger = (req, res, next) =>{
    const method = req.method;
    const path = req.path;
    const ip = req.ip;
    
    console.log(`Request Method: ${method} | Status: ${res.statusCode || 404} | Path: ${path} | Origin IP: ${ip}`);
    next();
}


app.use(logger);
app.use('/', pages);


app.listen(PORT, () =>{
    console.log("SERVER RUNNIG AT PORT : " + PORT);
});