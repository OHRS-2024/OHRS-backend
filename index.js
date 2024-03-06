const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rootRoute = require('./routes/rootRoute');
const cors = require('cors');
const {logger, checkLoggedIn} = require('./middlewares/auth/authmw')
const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());
app.use(cookieParser());
app.use(logger);

app.get('/',(req, res) =>{
    res.status(200).json({
        result:{
            success : true,
            message : 'Page loaded',
            redirectPage : null,
            error : false
        }
    })
});

app.use('/', rootRoute)
app.listen(PORT, () =>{ 
    console.log("SERVER RUNNIG AT PORT : " + PORT); 
});