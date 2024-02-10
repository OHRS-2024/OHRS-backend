const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pages = require('./routes/pageRoute');
const auth = require('./routes/authRoute');
const {logger, checkLoggedIn} = require('./middlewares/authmw')
const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', './layouts/index');

app.use(logger);

app.use('/auth', auth);
app.use('/pages',pages);
app.use('/', pages);

app.listen(PORT, () =>{
    console.log("SERVER RUNNIG AT PORT : " + PORT);
});